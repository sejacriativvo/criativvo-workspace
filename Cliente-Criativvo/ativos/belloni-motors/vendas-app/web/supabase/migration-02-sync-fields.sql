-- =====================================================================
-- Migration 02 — função de sync também grava "em preparação"
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================

-- Remove a versão anterior da função (assinatura antiga).
drop function if exists public.upsert_shopify_car(text,text,numeric,text,text,text,text,text,text,text);

-- Recria com o campo in_prep (em preparação).
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
  p_status text default 'available',
  p_in_prep boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.cars
    (shopify_product_id, name, price, img, year, km, cor, cambio, combustivel,
     status, in_prep, source, synced_at, cost)
  values
    (p_shopify_id, p_name, p_price, p_img, p_year, p_km, p_cor, p_cambio, p_combustivel,
     p_status, p_in_prep, 'shopify', now(), null)
  on conflict (shopify_product_id) do update set
    name = excluded.name,
    price = excluded.price,
    img = coalesce(excluded.img, public.cars.img),
    year = coalesce(excluded.year, public.cars.year),
    km = coalesce(excluded.km, public.cars.km),
    cor = coalesce(excluded.cor, public.cars.cor),
    cambio = coalesce(excluded.cambio, public.cars.cambio),
    combustivel = coalesce(excluded.combustivel, public.cars.combustivel),
    status = excluded.status,
    in_prep = excluded.in_prep,
    synced_at = now();
  -- custo NUNCA é tocado no update. O que o admin cadastrou fica.
end;
$$;
