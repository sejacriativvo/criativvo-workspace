'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Store } from '@/lib/types';

// Data de hoje no fuso de SP ('YYYY-MM-DD') — pra venda nova cair na semana certa.
function brtToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

// Reconcilia o LOG de vendas (tabela sales) da loja pro total do mês = `target`.
// O cliente atualiza o número na hora e só chama isto quando para de clicar.
// Subiu? insere venda(s) datada(s) HOJE (entra na semana atual do Relatório).
// Desceu? apaga a(s) venda(s) mais recente(s) do mês. Sem corrida.
export async function setSaleCount(store: Store, target: number) {
  await requireAdmin();
  const supabase = await createClient();

  const today = brtToday();
  const [y, m] = today.split('-');
  const first = `${y}-${m}-01`;
  const lastDay = new Date(Number(y), Number(m), 0).getDate();
  const last = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;

  const { data: rows, error: readErr } = await supabase
    .from('sales')
    .select('id, sold_on, created_at')
    .eq('store', store)
    .gte('sold_on', first)
    .lte('sold_on', last)
    .order('sold_on', { ascending: true })
    .order('created_at', { ascending: true });
  if (readErr) return { error: readErr.message };

  const cur = rows?.length ?? 0;
  const tgt = Math.max(0, Math.round(target));

  if (tgt > cur) {
    const novas = Array.from({ length: tgt - cur }, () => ({ store, sold_on: today }));
    const { error } = await supabase.from('sales').insert(novas);
    if (error) return { error: error.message };
  } else if (tgt < cur) {
    // rows está em ordem crescente: o "rabo" (a partir de tgt) são as mais novas.
    const idsToDelete = (rows ?? []).slice(tgt).map((r) => r.id);
    const { error } = await supabase.from('sales').delete().in('id', idsToDelete);
    if (error) return { error: error.message };
  }

  revalidatePath('/metas');
  revalidatePath('/relatorios');
  revalidatePath('/dashboard');
  return { ok: true };
}

// Salva a meta de vendas por loja (Ibitinga e Borborema).
export async function saveGoals(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const ibi = Number(formData.get('goal_ibitinga') || 0);
  const bor = Number(formData.get('goal_borborema') || 0);
  const supabase = await createClient();
  const { error } = await supabase
    .from('settings')
    .update({ goal_ibitinga: ibi, goal_borborema: bor, monthly_goal: ibi + bor })
    .eq('id', 1);
  if (error) return { error: error.message };
  revalidatePath('/metas');
  revalidatePath('/dashboard');
  return { ok: true };
}
