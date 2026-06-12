-- =====================================================================
-- Migration 04 — datas de acompanhamento no cliente
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
-- visit_date já existe (visita agendada). Aqui adicionamos:
alter table public.clients add column if not exists contacted_at date; -- quando conversamos
alter table public.clients add column if not exists visited_at date;   -- quando veio à loja
