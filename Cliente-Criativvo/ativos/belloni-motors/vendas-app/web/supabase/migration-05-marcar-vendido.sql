-- =====================================================================
-- Migration 05 — marcar carro como vendido ao registrar a venda
-- O vendedor não pode editar a tabela cars (RLS). Esta função, com
-- permissão elevada, só muda o status pra 'sold' (nada sensível).
-- Rode no Supabase: SQL Editor > New query > cole > Run. Seguro repetir.
-- =====================================================================
create or replace function public.mark_car_sold(p_car_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.cars
  set status = 'sold', sold_at = now()
  where id = p_car_id;
end;
$$;
grant execute on function public.mark_car_sold(uuid) to authenticated;
