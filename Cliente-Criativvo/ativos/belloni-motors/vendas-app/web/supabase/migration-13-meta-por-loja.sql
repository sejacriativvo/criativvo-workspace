-- =====================================================================
-- Migration 13 — meta de vendas por loja (Ibitinga e Borborema)
-- As vendas de cada loja são contadas automático do CRM (cada venda tem a loja).
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.settings add column if not exists goal_ibitinga  int not null default 0;
alter table public.settings add column if not exists goal_borborema int not null default 0;

-- Aproveita a meta única antiga como ponto de partida pra Ibitinga (só uma vez).
update public.settings
  set goal_ibitinga = coalesce(monthly_goal, 0)
  where id = 1 and goal_ibitinga = 0;
