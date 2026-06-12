-- =====================================================================
-- Migration 12 — loja na venda (pra contar "vendidos" por loja no relatório)
-- Quando o vendedor marca "Vendeu", escolhe Ibitinga ou Borborema. O relatório
-- conta automático por loja/semana (pela data de fechamento). Italo só lança lucro.
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.clients
  add column if not exists store text check (store in ('ibitinga', 'borborema'));
