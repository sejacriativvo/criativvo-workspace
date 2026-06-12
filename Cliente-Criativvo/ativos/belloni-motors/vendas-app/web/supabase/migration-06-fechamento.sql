-- =====================================================================
-- Migration 06 — data de fechamento do cliente (vendeu / não comprou)
-- Permite mostrar "Vendeu" e "Não comprou" por mês no quadro.
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
alter table public.clients add column if not exists closed_at timestamptz;

-- Backfill: quem já está fechado mas sem data, usa a data de criação.
update public.clients
set closed_at = created_at
where status in ('sold', 'lost') and closed_at is null;
