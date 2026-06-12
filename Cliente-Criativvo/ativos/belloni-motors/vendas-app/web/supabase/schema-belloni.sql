-- =====================================================================
-- Belloni Motors — Schema completo (loja única, sem Financeiras)
-- Cole tudo no Supabase: SQL Editor > New query > Run
-- Seguro rodar mais de uma vez (idempotente).
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- 1) PROFILES
-- =====================================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'vendor'
             check (role in ('admin','vendor','traffic')),
  name       text,
  initials   text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helper: logado é admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active = true
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- Helper: pode ver relatórios? (admin ou traffic)
create or replace function public.can_see_reports()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role in ('admin','traffic')
  );
$$;
grant execute on function public.can_see_reports() to authenticated;

-- Cria profile automaticamente ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
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
-- 2) SETTINGS
-- =====================================================================
create table if not exists public.settings (
  id               integer primary key default 1 check (id = 1),
  discount_pct     numeric not null default 0.40,
  green_threshold  numeric not null default 0.13,
  yellow_threshold numeric not null default 0.07,
  dealership_name  text not null default 'Belloni Motors',
  store_domain     text default 'bellonimotors.com.br',
  monthly_goal     integer not null default 0,
  monthly_sales    integer not null default 0,
  sales_month      text,
  updated_at       timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- =====================================================================
-- 3) CARS — estoque
-- =====================================================================
create table if not exists public.cars (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  year               text,
  km                 text,
  cor                text,
  cambio             text,
  combustivel        text,
  price              numeric not null,
  cost               numeric not null default 0,
  opcionais          text[] not null default '{}',
  img                text,
  in_prep            boolean not null default false,
  status             text not null default 'available'
                     check (status in ('available','sold')),
  shopify_product_id text unique,
  acquisition_date   date,
  created_at         timestamptz not null default now(),
  sold_at            timestamptz,
  sold_value         numeric,
  sold_profit        numeric
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
  created_at    timestamptz not null default now(),
  closed_at     timestamptz
);
create index if not exists clients_status_idx on public.clients(status);

-- =====================================================================
-- 5) VIEW SEGURA — vendedor nunca vê custo/margem
-- =====================================================================
create or replace view public.vehicles_public
with (security_invoker = off) as
select
  c.id, c.name, c.year, c.km, c.cor, c.cambio, c.combustivel,
  c.price, c.opcionais, c.img, c.in_prep, c.status,
  c.shopify_product_id, c.acquisition_date, c.created_at,
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::int as days_in_stock,
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
-- 6) AD_REPORTS — relatórios de tráfego (loja única)
-- =====================================================================
create table if not exists public.ad_reports (
  id           uuid primary key default gen_random_uuid(),
  year         int  not null,
  month        int  not null check (month between 1 and 12),
  granularity  text not null default 'week' check (granularity in ('week','month')),
  period_index int  not null default 0,
  period_label text,
  investimento numeric,
  conversas    integer,
  vendidos     integer,
  lucro        numeric,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id) on delete set null
);
create unique index if not exists ad_reports_key
  on public.ad_reports(year, month, granularity, period_index);
create index if not exists ad_reports_period_idx
  on public.ad_reports(year, month);

-- =====================================================================
-- 7) SALES — log de vendas (loja única)
-- =====================================================================
create table if not exists public.sales (
  id         uuid primary key default gen_random_uuid(),
  sold_on    date not null default current_date,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references public.profiles(id) on delete set null
);
create index if not exists sales_date_idx on public.sales(sold_on);

-- =====================================================================
-- 8) RLS
-- =====================================================================
alter table public.profiles   enable row level security;
alter table public.settings   enable row level security;
alter table public.cars       enable row level security;
alter table public.clients    enable row level security;
alter table public.ad_reports enable row level security;
alter table public.sales      enable row level security;

-- PROFILES
drop policy if exists profiles_self_read   on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_all   on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- SETTINGS
drop policy if exists settings_read        on public.settings;
create policy settings_read on public.settings
  for select using (auth.uid() is not null);

drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings
  for update using (public.is_admin()) with check (public.is_admin());

-- CARS: só admin acessa a tabela crua (tem custo). Vendedor usa vehicles_public.
drop policy if exists cars_admin_read      on public.cars;
create policy cars_admin_read on public.cars
  for select using (public.is_admin());

drop policy if exists cars_admin_write     on public.cars;
create policy cars_admin_write on public.cars
  for all using (public.is_admin()) with check (public.is_admin());

-- CLIENTS: todo time logado usa o CRM
drop policy if exists clients_team_all     on public.clients;
create policy clients_team_all on public.clients
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- AD_REPORTS: admin e traffic leem/escrevem; vendedor nunca vê
drop policy if exists ad_reports_read      on public.ad_reports;
create policy ad_reports_read on public.ad_reports
  for select using (public.can_see_reports());

drop policy if exists ad_reports_write     on public.ad_reports;
create policy ad_reports_write on public.ad_reports
  for all using (public.can_see_reports()) with check (public.can_see_reports());

-- SALES: todos logados leem (metas/painel); só admin cria/apaga
drop policy if exists sales_read           on public.sales;
create policy sales_read on public.sales
  for select using (auth.uid() is not null);

drop policy if exists sales_insert         on public.sales;
create policy sales_insert on public.sales
  for insert with check (public.is_admin());

drop policy if exists sales_delete         on public.sales;
create policy sales_delete on public.sales
  for delete using (public.is_admin());

-- =====================================================================
-- Pronto. Próximo: Authentication > Add users (Belloni + vendedores).
-- Depois rodar make-admin-belloni.sql pra promover o Belloni a admin.
-- =====================================================================
