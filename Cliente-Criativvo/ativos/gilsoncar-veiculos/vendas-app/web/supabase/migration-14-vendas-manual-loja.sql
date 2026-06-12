-- =====================================================================
-- Migration 14 — contador manual de vendas por loja (Metas)
-- O Italo registra cada venda no +/- das Metas (mais fácil que o CRM por ora).
-- Zera sozinho quando vira o mês (sales_month).
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.settings add column if not exists sales_ibitinga  int not null default 0;
alter table public.settings add column if not exists sales_borborema int not null default 0;
alter table public.settings add column if not exists sales_month text; -- 'YYYY-MM' a que a contagem se refere
