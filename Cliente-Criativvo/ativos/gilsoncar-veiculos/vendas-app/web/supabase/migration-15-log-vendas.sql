-- =====================================================================
-- Migration 15 — log de vendas (fonte ÚNICA do número de vendas)
-- Cada venda vira uma linha datada. O +/- das Metas grava aqui; o Relatório
-- conta por semana (venda de hoje cai na semana de hoje) e o Painel conta no
-- mês. Acaba com os 3 contadores separados (settings, CRM e digitado à mão).
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run. Seguro repetir.
-- =====================================================================

-- 1) Tabela do log. Só guarda loja + data — sem nada sensível.
create table if not exists public.sales (
  id          uuid primary key default gen_random_uuid(),
  store       text not null check (store in ('ibitinga','borborema')),
  sold_on     date not null default current_date,
  created_at  timestamptz not null default now(),
  created_by  uuid default auth.uid() references public.profiles(id) on delete set null
);
create index if not exists sales_store_date_idx on public.sales (store, sold_on);

-- 2) RLS: qualquer logado LÊ (Metas/Relatório/Painel mostram a contagem);
--    só o admin (Italo) CRIA/APAGA venda.
alter table public.sales enable row level security;

drop policy if exists sales_read on public.sales;
create policy sales_read on public.sales
  for select using (auth.uid() is not null);

drop policy if exists sales_insert on public.sales;
create policy sales_insert on public.sales
  for insert with check (public.is_admin());

drop policy if exists sales_delete on public.sales;
create policy sales_delete on public.sales
  for delete using (public.is_admin());

-- 3) Semente: traz o contador atual das Metas (mês corrente, em settings) pro
--    log, datado hoje — pra ninguém perder as vendas já registradas.
--    Idempotente: só insere se o log do mês ainda estiver vazio pra cada loja.
do $$
declare
  ym     text := to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM');
  today  date := (now() at time zone 'America/Sao_Paulo')::date;
  smonth text;
  s_ibi  int;
  s_bor  int;
begin
  select sales_month, coalesce(sales_ibitinga,0), coalesce(sales_borborema,0)
    into smonth, s_ibi, s_bor
  from public.settings where id = 1;

  if smonth = ym then
    if s_ibi > 0 and not exists (
      select 1 from public.sales where store='ibitinga' and to_char(sold_on,'YYYY-MM')=ym
    ) then
      insert into public.sales (store, sold_on)
      select 'ibitinga', today from generate_series(1, s_ibi);
    end if;

    if s_bor > 0 and not exists (
      select 1 from public.sales where store='borborema' and to_char(sold_on,'YYYY-MM')=ym
    ) then
      insert into public.sales (store, sold_on)
      select 'borborema', today from generate_series(1, s_bor);
    end if;
  end if;
end $$;
