-- =====================================================================
-- Belloni Motors — adicionar campos do catálogo público
-- Rodar no Supabase SQL Editor (dashboard.supabase.com)
-- =====================================================================

-- 1) Novos campos na tabela cars
alter table public.cars
  add column if not exists brand    text,
  add column if not exists category text,
  add column if not exists doors    text,
  add column if not exists premium  boolean not null default false;

-- 2) Atualizar vehicles_public para incluir os novos campos
create or replace view public.vehicles_public
with (security_invoker = off) as
select
  c.id,
  c.name,
  c.brand,
  c.category,
  c.doors,
  c.premium,
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
  c.acquisition_date,
  c.created_at,
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::int as days_in_stock,
  (floor((c.price - c.cost) * s.discount_pct / 100) * 100)::numeric as max_discount,
  case
    when (c.price - c.cost) / nullif(c.price, 0) >= s.green_threshold  then 'green'
    when (c.price - c.cost) / nullif(c.price, 0) >= s.yellow_threshold then 'yellow'
    else 'red'
  end as level
from public.cars c
cross join public.settings s
where s.id = 1;

-- 3) Manter acesso para usuários logados
grant select on public.vehicles_public to authenticated;

-- 4) Liberar leitura pública (site usa anon key, sem login)
grant select on public.vehicles_public to anon;

-- Pronto. O site vai conseguir ler o estoque sem autenticação.
