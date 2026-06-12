-- =====================================================================
-- Migration 10 — data de aquisição do carro (controle de giro de estoque)
-- O admin informa quando a GilsonCar comprou o carro. O "tempo no estoque"
-- passa a contar a partir dessa data (se preenchida); senão, do cadastro.
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================

-- Quando a GilsonCar adquiriu o carro. NULL = usa a data de cadastro como base.
alter table public.cars add column if not exists acquired_at date;

-- Recria a view segura: days_in_stock agora conta a partir de acquired_at
-- (quando preenchida). Resto idêntico à versão atual (margem por carro).
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
  greatest(
    0,
    floor(extract(epoch from (now() - coalesce(c.acquired_at::timestamptz, c.created_at))) / 86400)
  )::int as days_in_stock,
  c.negotiation_discount as max_discount,
  case
    when c.negotiation_discount is null then 'pending'
    else 'green'
  end as level
from public.cars c;

grant select on public.vehicles_public to authenticated;
