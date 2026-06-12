-- =====================================================================
-- Migration 01 — Sync Shopify + estado "pendente de custo"
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run.
-- Seguro rodar mais de uma vez.
-- =====================================================================

-- 1) Custo passa a ser OPCIONAL. NULL = "ainda não cadastrado".
--    Isso evita o app calcular margem em cima de custo zero.
alter table public.cars alter column cost drop default;
alter table public.cars alter column cost drop not null;

-- Carros que estavam com custo 0 (vindos do seed sem custo real) podem
-- continuar 0; quem entrar da Shopify entra como NULL (pendente).

-- 2) De onde veio o carro (pra saber o que é sync x manual).
alter table public.cars add column if not exists source text not null default 'manual'
  check (source in ('manual','shopify'));
alter table public.cars add column if not exists synced_at timestamptz;

-- 3) View segura recriada: trata o caso "sem custo" como level 'pending'
--    e NÃO devolve desconto (max_discount = null). O vendedor nunca vê
--    um desconto inventado.
drop view if exists public.vehicles_public;
create view public.vehicles_public
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
  c.source,
  c.shopify_product_id,
  c.created_at,
  (c.cost is null) as cost_pending,
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::int as days_in_stock,
  case
    when c.cost is null then null
    else (floor((c.price - c.cost) * s.discount_pct / 100) * 100)::numeric
  end as max_discount,
  case
    when c.cost is null then 'pending'
    when (c.price - c.cost) / nullif(c.price,0) >= s.green_threshold  then 'green'
    when (c.price - c.cost) / nullif(c.price,0) >= s.yellow_threshold then 'yellow'
    else 'red'
  end as level
from public.cars c
cross join public.settings s
where s.id = 1;

grant select on public.vehicles_public to authenticated;

-- 4) Função para o sync inserir/atualizar carros da Shopify de forma segura
--    (mantém o custo já cadastrado; nunca sobrescreve custo com null).
--    SECURITY DEFINER: a rota de sync chama isso; respeita o resto do RLS.
create or replace function public.upsert_shopify_car(
  p_shopify_id text,
  p_name text,
  p_price numeric,
  p_img text,
  p_year text default null,
  p_km text default null,
  p_cor text default null,
  p_cambio text default null,
  p_combustivel text default null,
  p_status text default 'available'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.cars
    (shopify_product_id, name, price, img, year, km, cor, cambio, combustivel,
     status, source, synced_at, cost)
  values
    (p_shopify_id, p_name, p_price, p_img, p_year, p_km, p_cor, p_cambio, p_combustivel,
     p_status, 'shopify', now(), null)
  on conflict (shopify_product_id) do update set
    name = excluded.name,
    price = excluded.price,
    img = coalesce(excluded.img, public.cars.img),
    status = excluded.status,
    synced_at = now();
  -- repare: no update NÃO mexemos em cost. Custo cadastrado pelo admin fica intacto.
end;
$$;
