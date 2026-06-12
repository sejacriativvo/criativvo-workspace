-- =====================================================================
-- Migration 09 — lucro das vendas manuais (antes do CRM)
-- Admin lança o lucro total dessas vendas; entra no "Lucro do mês" do painel.
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.settings add column if not exists manual_profit numeric not null default 0;
