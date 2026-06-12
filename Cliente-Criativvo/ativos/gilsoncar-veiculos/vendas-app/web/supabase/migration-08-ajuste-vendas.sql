-- =====================================================================
-- Migration 08 — ajuste manual de vendas do mês (antes do CRM)
-- Permite o admin lançar quantas vendas já aconteceram no mês, sem cliente.
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.settings add column if not exists manual_sales integer not null default 0;
alter table public.settings add column if not exists manual_revenue numeric not null default 0;
alter table public.settings add column if not exists manual_month text; -- 'YYYY-MM' a que o ajuste se refere
