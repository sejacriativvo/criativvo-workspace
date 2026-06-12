-- =====================================================================
-- Migration 11 — Relatorios de trafego por loja (Ibitinga / Borborema)
-- Cria o papel "trafego" (Alisson), a tabela de relatorios + RLS e importa
-- os dados da planilha (Marco/Abril/Maio 2026 semanal + historico mensal).
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run. Seguro repetir.
-- (Se aparecer aviso de "destructive": e por causa do drop/recria de policy e
--  constraint. Nenhum dado e perdido. Pode rodar.)
-- =====================================================================

-- 1) Papel "trafego" (Alisson): so acessa a aba Relatorios.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin','vendor','traffic'));

-- 2) Quem pode ver relatorios: admin ou trafego (vendedor NUNCA, tem lucro/ROI).
create or replace function public.can_see_reports()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role in ('admin','traffic')
  );
$$;
grant execute on function public.can_see_reports() to authenticated;

-- 3) Tabela de relatorios. 2026 entra por semana; historico 2025 e mensal.
--    Azul (Alisson): investimento, conversas. Verde (Italo): vendidos, lucro.
--    As "formulas" (custo/lead, % convertida, ROI...) sao calculadas no app.
create table if not exists public.ad_reports (
  id           uuid primary key default gen_random_uuid(),
  store        text not null check (store in ('ibitinga','borborema')),
  year         int  not null,
  month        int  not null check (month between 1 and 12),
  granularity  text not null default 'week' check (granularity in ('week','month')),
  period_index int  not null default 0,            -- semana (0..4) ou 0 no mensal
  period_label text,                               -- ex '01/03 - 08/03'
  investimento numeric,                            -- azul (Alisson)
  conversas    integer,                            -- azul (Alisson)
  vendidos     integer,                            -- verde (Italo)
  lucro        numeric,                            -- verde (Italo)
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id) on delete set null
);
create unique index if not exists ad_reports_key
  on public.ad_reports(store, year, month, granularity, period_index);
create index if not exists ad_reports_period_idx
  on public.ad_reports(store, year, month);

-- 4) RLS: admin e trafego leem/escrevem; vendedor nao ve nada.
alter table public.ad_reports enable row level security;
drop policy if exists ad_reports_read on public.ad_reports;
create policy ad_reports_read on public.ad_reports
  for select using (public.can_see_reports());
drop policy if exists ad_reports_write on public.ad_reports;
create policy ad_reports_write on public.ad_reports
  for all using (public.can_see_reports()) with check (public.can_see_reports());

-- 5) Dados importados da planilha (idempotente).
insert into public.ad_reports
  (store, year, month, granularity, period_index, period_label, investimento, conversas, vendidos, lucro)
values
  ('ibitinga', 2026, 3, 'week', 0, '01/03 - 08/03', 813.32, 82, 5, 38300),
  ('ibitinga', 2026, 3, 'week', 1, '09/03 - 15/03', 766.46, 110, 3, 16000),
  ('ibitinga', 2026, 3, 'week', 2, '16/03 - 22/03', 775.56, 89, 9, 95300),
  ('ibitinga', 2026, 3, 'week', 3, '23/03 - 31/03', 837.50, 148, 6, 52000),
  ('ibitinga', 2026, 4, 'week', 0, '01/04 - 07/04', 633.95, 106, 4, 23400),
  ('ibitinga', 2026, 4, 'week', 1, '08/04 - 14/04', 583.50, 143, 2, 16500),
  ('ibitinga', 2026, 4, 'week', 2, '15/04 - 21/04', 720.88, 111, 9, 71800),
  ('ibitinga', 2026, 4, 'week', 3, '22/04 - 30/04', 983.05, 242, 7, 46400),
  ('ibitinga', 2026, 5, 'week', 0, '01/05 - 10/05', 840.39, 198, 2, 30500),
  ('ibitinga', 2026, 5, 'week', 1, '11/05 - 17/05', 714.40, 145, 8, NULL),
  ('ibitinga', 2026, 5, 'week', 2, '18/05 - 24/05', 697.89, 176, 3, NULL),
  ('ibitinga', 2026, 5, 'week', 3, '25/05 - 31/05', 694.13, 136, 8, NULL),
  ('ibitinga', 2025, 10, 'month', 0, NULL, 1037.29, 105, NULL, NULL),
  ('ibitinga', 2025, 11, 'month', 0, NULL, 1975.98, 222, NULL, NULL),
  ('ibitinga', 2025, 12, 'month', 0, NULL, 1866.84, 301, NULL, NULL),
  ('ibitinga', 2026, 1, 'month', 0, NULL, 2523.55, 332, NULL, NULL),
  ('ibitinga', 2026, 2, 'month', 0, NULL, 2423.44, 422, NULL, NULL),
  ('borborema', 2026, 3, 'week', 0, '01/03 - 08/03', 280.43, 10, 2, 10000),
  ('borborema', 2026, 3, 'week', 1, '09/03 - 15/03', 279.28, 3, 6, 42000),
  ('borborema', 2026, 3, 'week', 2, '16/03 - 22/03', 280.46, 7, 2, 3000),
  ('borborema', 2026, 3, 'week', 3, '23/03 - 31/03', 361.94, 9, 7, 43000),
  ('borborema', 2026, 4, 'week', 0, '01/04 - 07/04', 273.61, 10, 3, 20000),
  ('borborema', 2026, 4, 'week', 1, '08/04 - 14/04', 170.47, 5, 1, 5600),
  ('borborema', 2026, 4, 'week', 2, '15/04 - 21/04', 140.02, 4, 0, 0),
  ('borborema', 2026, 4, 'week', 3, '22/04 - 30/04', 247.70, 38, 4, 45000),
  ('borborema', 2026, 5, 'week', 0, '01/05 - 10/05', 290.24, 54, 0, 0),
  ('borborema', 2026, 5, 'week', 1, '11/05 - 17/05', 209.77, 71, 3, 21000),
  ('borborema', 2026, 5, 'week', 2, '18/05 - 24/05', 235.50, 68, 2, 10600),
  ('borborema', 2026, 5, 'week', 3, '25/05 - 31/05', NULL, NULL, 1, 6800),
  ('borborema', 2026, 2, 'month', 0, NULL, 302.51, 24, NULL, NULL)
on conflict (store, year, month, granularity, period_index) do update set
  period_label = excluded.period_label,
  investimento = excluded.investimento,
  conversas    = excluded.conversas,
  vendidos     = excluded.vendidos,
  lucro        = excluded.lucro,
  updated_at   = now();
