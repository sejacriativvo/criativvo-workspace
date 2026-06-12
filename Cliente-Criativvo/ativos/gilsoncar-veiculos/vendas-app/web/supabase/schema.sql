-- =====================================================================
-- GilsonCar Vendas — Schema + Segurança (RLS)
-- =====================================================================
-- Rode isto no Supabase: Dashboard > SQL Editor > New query > cole tudo > Run.
-- O ponto central: o VENDEDOR nunca consegue ler "cost" (custo) nem "margem".
-- Isso é garantido no banco (Row Level Security), não no front. Mesmo que
-- alguém abra o navegador e tente puxar a tabela, o custo não vem.
-- =====================================================================

-- ---------- Extensões ----------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- =====================================================================
-- 1) PROFILES — cada usuário do app (Gilson = admin, time = vendor)
--    Liga 1:1 com auth.users do Supabase.
-- =====================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'vendor' check (role in ('admin','vendor')),
  name        text,
  initials    text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Helper: o usuário logado é admin? (SECURITY DEFINER = lê profiles ignorando
-- RLS, evita recursão e impede o vendedor de "virar" admin via query.)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active = true
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- Cria o profile automaticamente quando um usuário novo se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, initials, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    upper(left(coalesce(new.raw_user_meta_data->>'name', new.email), 2)),
    'vendor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- 2) SETTINGS — parâmetros da negociação (configuráveis pelo admin)
--    desconto_max = margem * discount_pct, arredondado p/ centena.
-- =====================================================================
create table if not exists public.settings (
  id                integer primary key default 1 check (id = 1),
  discount_pct      numeric not null default 0.40,  -- 40% da margem vira teto de desconto
  green_threshold   numeric not null default 0.13,  -- margem% >= 13% -> verde
  yellow_threshold  numeric not null default 0.07,  -- margem% >= 7%  -> amarelo (abaixo = vermelho)
  dealership_name   text not null default 'GilsonCar',
  store_domain      text default 'gilsoncarveiculos.com.br',
  updated_at        timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- =====================================================================
-- 3) CARS — estoque. "cost" é a coluna sensível.
-- =====================================================================
create table if not exists public.cars (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  year                text,
  km                  text,
  cor                 text,
  cambio              text,
  combustivel         text,
  price               numeric not null,            -- preço de venda (todos veem)
  cost                numeric not null default 0,  -- custo (SÓ ADMIN)
  opcionais           text[] not null default '{}',
  img                 text,
  in_prep             boolean not null default false,
  status              text not null default 'available' check (status in ('available','sold')),
  shopify_product_id  text unique,
  created_at          timestamptz not null default now(), -- base do "tempo no estoque"
  sold_at             timestamptz
);
create index if not exists cars_status_idx on public.cars(status);

-- =====================================================================
-- 4) CLIENTS — CRM / funil de negociação
-- =====================================================================
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text,
  status        text not null default 'lead'
                check (status in ('lead','visit','negotiating','followup','sold','lost')),
  car_id        uuid references public.cars(id) on delete set null,
  seller_id     uuid references public.profiles(id) on delete set null,
  notes         text,
  sold_value    numeric,
  discount      numeric,
  payment       text,
  visit_date    date,
  visit_time    text,
  followup_date date,
  lost_reason   text,
  created_at    timestamptz not null default now()
);
create index if not exists clients_status_idx on public.clients(status);

-- =====================================================================
-- 5) VIEW SEGURA — o que o VENDEDOR enxerga.
--    Calcula desconto máximo e semáforo a partir do custo, mas NUNCA
--    expõe custo nem margem. A view roda com permissão de dono
--    (security_invoker=off), então lê cars ignorando o RLS, mas só
--    devolve colunas seguras.
-- =====================================================================
create or replace view public.vehicles_public
with (security_invoker = off) as
select
  c.id,
  c.name,
  c.year,
  c.km,
  c.cor,
  c.cambio,
  c.combustivel,
  c.price,
  c.opcionais,
  c.img,
  c.in_prep,
  c.status,
  c.shopify_product_id,
  c.created_at,
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::int as days_in_stock,
  -- teto de desconto = margem * discount_pct, arredondado p/ baixo na centena
  (floor((c.price - c.cost) * s.discount_pct / 100) * 100)::numeric as max_discount,
  case
    when (c.price - c.cost) / nullif(c.price,0) >= s.green_threshold  then 'green'
    when (c.price - c.cost) / nullif(c.price,0) >= s.yellow_threshold then 'yellow'
    else 'red'
  end as level
from public.cars c
cross join public.settings s
where s.id = 1;

grant select on public.vehicles_public to authenticated;

-- =====================================================================
-- 6) RLS — liga a proteção em todas as tabelas
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.cars     enable row level security;
alter table public.clients  enable row level security;

-- PROFILES: cada um lê o próprio; admin lê/edita todos.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- SETTINGS: todos logados leem; só admin altera.
drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings
  for select using (auth.uid() is not null);

drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings
  for update using (public.is_admin()) with check (public.is_admin());

-- CARS: APENAS ADMIN lê a tabela crua (com custo). Vendedor lê pela view.
drop policy if exists cars_admin_read on public.cars;
create policy cars_admin_read on public.cars
  for select using (public.is_admin());

drop policy if exists cars_admin_write on public.cars;
create policy cars_admin_write on public.cars
  for all using (public.is_admin()) with check (public.is_admin());

-- CLIENTS: time todo (logado) usa o CRM. Não há custo aqui.
drop policy if exists clients_team_all on public.clients;
create policy clients_team_all on public.clients
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- =====================================================================
-- Pronto. Próximo: rode seed.sql para popular com o estoque de exemplo.
-- =====================================================================
