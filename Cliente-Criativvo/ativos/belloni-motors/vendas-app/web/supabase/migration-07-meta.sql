-- =====================================================================
-- Migration 07 — meta de vendas do mês (definida pelo admin)
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.settings add column if not exists monthly_goal integer not null default 0;
