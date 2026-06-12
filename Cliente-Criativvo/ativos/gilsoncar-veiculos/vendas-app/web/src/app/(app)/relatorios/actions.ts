'use server';

import { revalidatePath } from 'next/cache';
import { requireReports } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { isLiveMonth } from '@/lib/relatorios';
import type { Store } from '@/lib/types';

type WeekInput = {
  period_index: number;
  period_label: string;
  investimento: number | null;
  conversas: number | null;
  vendidos: number | null;
  lucro: number | null;
};

// Salva as semanas de um mês/loja. Tráfego (Alisson) só grava os azuis
// (investimento, conversas); admin (Italo) grava também os verdes (vendidos, lucro).
export async function saveWeeks(payload: {
  store: Store;
  year: number;
  month: number;
  weeks: WeekInput[];
}) {
  const profile = await requireReports();
  const isAdmin = profile.role === 'admin';
  const supabase = await createClient();

  // Cada papel grava SÓ a sua parte. Admin (Italo) = verde (vendidos/lucro).
  // Tráfego (Alisson) = azul (investimento/conversas). O upsert só mexe nas
  // colunas enviadas, então um não sobrescreve o dado do outro.
  const rows = payload.weeks.map((w) => {
    const base: Record<string, unknown> = {
      store: payload.store,
      year: payload.year,
      month: payload.month,
      granularity: 'week',
      period_index: w.period_index,
      period_label: w.period_label,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    };
    if (isAdmin) {
      // vendidos agora vem do log de vendas (+/- das Metas), não da digitação.
      // O admin só lança o lucro — nunca tocamos em vendidos aqui.
      base.lucro = w.lucro;
    } else {
      base.investimento = w.investimento;
      base.conversas = w.conversas;
    }
    return base;
  });

  const { error } = await supabase
    .from('ad_reports')
    .upsert(rows, { onConflict: 'store,year,month,granularity,period_index' });

  if (error) return { error: error.message };
  revalidatePath('/relatorios');
  return { ok: true };
}

// Lançamento de mês histórico (antes do CRM): o admin registra o total de
// carros vendidos e o lucro do mês. Grava no registro MENSAL, sem tocar no
// investimento/conversas (que vêm da Meta). Mês "vivo" (jun/2026+) usa o CRM.
export async function saveMonthHistory(payload: {
  store: Store;
  year: number;
  month: number;
  vendidos: number | null;
  lucro: number | null;
}) {
  const profile = await requireReports();
  if (profile.role !== 'admin') return { error: 'Só o admin lança o histórico do mês.' };
  if (isLiveMonth(payload.year, payload.month)) {
    return { error: 'Esse mês usa as vendas do CRM (use o +/- das Metas).' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('ad_reports').upsert(
    {
      store: payload.store,
      year: payload.year,
      month: payload.month,
      granularity: 'month',
      period_index: 0,
      vendidos: payload.vendidos,
      lucro: payload.lucro,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    },
    { onConflict: 'store,year,month,granularity,period_index' },
  );

  if (error) return { error: error.message };
  revalidatePath('/relatorios');
  revalidatePath('/dashboard');
  return { ok: true };
}

// Faixa de dias de cada semana do mês (mesmos cortes do weekIndexForDay).
function weekRange(year: number, month: number, weekIndex: number): [number, number] {
  const last = new Date(year, month, 0).getDate();
  return ([[1, 8], [9, 15], [16, 22], [23, last]] as [number, number][])[weekIndex] ?? [23, last];
}

// Edição da VENDA direto na tabela do relatório (admin). A matemática ao lado
// (% conv, custo/venda, ROI) recalcula sozinha porque deriva do vendidos.
// - Mês VIVO (jun/2026+) + semana: reconcilia o LOG de vendas dessa semana, pra
//   painel, metas e relatório continuarem com o MESMO número.
// - Mês histórico: grava vendidos direto no ad_reports (preserva os outros campos).
export async function setReportSales(payload: {
  store: Store;
  year: number;
  month: number;
  granularity: 'week' | 'month';
  periodIndex: number;
  periodLabel?: string | null;
  target: number;
}) {
  const profile = await requireReports();
  if (profile.role !== 'admin') return { error: 'Só o admin edita as vendas.' };
  const supabase = await createClient();
  const tgt = Math.max(0, Math.round(payload.target || 0));

  if (isLiveMonth(payload.year, payload.month) && payload.granularity === 'week') {
    const mm = String(payload.month).padStart(2, '0');
    const [a, b] = weekRange(payload.year, payload.month, payload.periodIndex);
    const first = `${payload.year}-${mm}-${String(a).padStart(2, '0')}`;
    const last = `${payload.year}-${mm}-${String(b).padStart(2, '0')}`;

    const { data: salesRows, error: readErr } = await supabase
      .from('sales')
      .select('id, sold_on, created_at')
      .eq('store', payload.store)
      .gte('sold_on', first)
      .lte('sold_on', last)
      .order('sold_on', { ascending: true })
      .order('created_at', { ascending: true });
    if (readErr) return { error: readErr.message };

    const cur = salesRows?.length ?? 0;
    if (tgt > cur) {
      const novas = Array.from({ length: tgt - cur }, () => ({ store: payload.store, sold_on: first }));
      const { error } = await supabase.from('sales').insert(novas);
      if (error) return { error: error.message };
    } else if (tgt < cur) {
      const ids = (salesRows ?? []).slice(tgt).map((r) => r.id);
      const { error } = await supabase.from('sales').delete().in('id', ids);
      if (error) return { error: error.message };
    }
    revalidatePath('/relatorios');
    revalidatePath('/dashboard');
    revalidatePath('/metas');
    return { ok: true };
  }

  const { error } = await supabase.from('ad_reports').upsert(
    {
      store: payload.store,
      year: payload.year,
      month: payload.month,
      granularity: payload.granularity,
      period_index: payload.periodIndex,
      period_label: payload.periodLabel ?? null,
      vendidos: tgt,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    },
    { onConflict: 'store,year,month,granularity,period_index' },
  );
  if (error) return { error: error.message };
  revalidatePath('/relatorios');
  revalidatePath('/dashboard');
  return { ok: true };
}
