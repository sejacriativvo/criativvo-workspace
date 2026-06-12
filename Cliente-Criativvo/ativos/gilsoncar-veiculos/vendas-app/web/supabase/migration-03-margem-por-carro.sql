-- =====================================================================
-- Migration 03 — margem de negociação POR CARRO (valor em R$)
-- Agora o admin define livremente o desconto máximo de cada carro.
-- O custo continua opcional (só pra ver lucro, nunca exposto ao vendedor).
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================

-- Desconto máximo (R$) que o vendedor pode dar nesse carro. NULL = não definido.
alter table public.cars add column if not exists negotiation_discount numeric;

-- View segura recriada: o desconto que o vendedor vê é o que o admin definiu.
-- Sem margem definida -> level 'pending' (vendedor não vê desconto).
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
  greatest(0, floor(extract(epoch from (now() - c.created_at)) / 86400))::int as days_in_stock,
  c.negotiation_discount as max_discount,
  case
    when c.negotiation_discount is null then 'pending'
    else 'green'
  end as level
from public.cars c;

grant select on public.vehicles_public to authenticated;
