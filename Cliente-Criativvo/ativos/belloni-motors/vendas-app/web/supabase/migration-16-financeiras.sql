-- =====================================================================
-- Migration 16 — Financeiras (central de acessos dos bancos do time)
-- Logins/senhas temporários que mudam direto. Visível e EDITÁVEL por
-- ADMIN e VENDEDOR. Tráfego (Alisson) NUNCA vê. Protegido por RLS.
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run. Seguro repetir.
-- (Os dados dos bancos NÃO ficam aqui; entram depois, direto no banco.)
-- =====================================================================

create table if not exists public.bank_credentials (
  id          uuid primary key default gen_random_uuid(),
  bank        text not null unique,   -- slug (santander, bv, itau...) define o avatar
  label       text not null,          -- nome exibido
  login       text,
  password    text,
  note        text,
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles(id) on delete set null
);

-- Quem acessa: admin ou vendedor (tráfego nunca).
create or replace function public.can_see_finance()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role in ('admin','vendor')
  );
$$;
grant execute on function public.can_see_finance() to authenticated;

alter table public.bank_credentials enable row level security;

drop policy if exists bank_cred_read on public.bank_credentials;
create policy bank_cred_read on public.bank_credentials
  for select using (public.can_see_finance());

drop policy if exists bank_cred_write on public.bank_credentials;
create policy bank_cred_write on public.bank_credentials
  for all using (public.can_see_finance()) with check (public.can_see_finance());
