// Helpers do relatório de tráfego: fórmulas, agregação por mês e formatação.
// As "fórmulas" (custo/lead, % convertida, ROI...) são calculadas aqui a partir
// dos totais do mês — nunca guardadas no banco.
import type { AdReport, Store } from './types';
import { brl } from './negociacao';

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
export const MES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const STORE_LABEL: Record<string, string> = {
  belloni: 'Belloni Motors',
};

export type Totals = {
  investimento: number;
  conversas: number;
  vendidos: number | null; // null = ainda não preenchido (verde)
  lucro: number | null;
  hasResults: boolean;     // tem vendidos/lucro lançados?
};

export type Metrics = {
  custoLead: number | null;
  pctConv: number | null;
  custoVenda: number | null;
  roi: number | null;
  receitaLead: number | null;
};

function n(v: number | null | undefined): number {
  return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
}

// Soma os totais de um conjunto de linhas (semanas de um mês, ou as duas lojas).
export function aggregate(rows: AdReport[]): Totals {
  let investimento = 0;
  let conversas = 0;
  let vendidos = 0;
  let lucro = 0;
  let hasResults = false;
  for (const r of rows) {
    investimento += n(r.investimento);
    conversas += n(r.conversas);
    if (r.vendidos != null || r.lucro != null) hasResults = true;
    vendidos += n(r.vendidos);
    lucro += n(r.lucro);
  }
  return {
    investimento,
    conversas,
    vendidos: hasResults ? vendidos : null,
    lucro: hasResults ? lucro : null,
    hasResults,
  };
}

// Totais de um mês para uma loja: usa as semanas se existirem; senão o mensal.
export function monthTotals(
  rows: AdReport[],
  store: Store,
  year: number,
  month: number,
): Totals | null {
  const inMonth = rows.filter((r) => r.store === store && r.year === year && r.month === month);
  const weekly = inMonth.filter((r) => r.granularity === 'week');
  if (weekly.length) return aggregate(weekly);
  const monthly = inMonth.filter((r) => r.granularity === 'month');
  if (monthly.length) return aggregate(monthly);
  return null;
}

// Soma as duas lojas (visão "Rede").
export function sumTotals(a: Totals | null, b: Totals | null): Totals | null {
  if (!a && !b) return null;
  const x = a ?? { investimento: 0, conversas: 0, vendidos: null, lucro: null, hasResults: false };
  const y = b ?? { investimento: 0, conversas: 0, vendidos: null, lucro: null, hasResults: false };
  const hasResults = x.hasResults || y.hasResults;
  return {
    investimento: x.investimento + y.investimento,
    conversas: x.conversas + y.conversas,
    vendidos: hasResults ? n(x.vendidos) + n(y.vendidos) : null,
    lucro: hasResults ? n(x.lucro) + n(y.lucro) : null,
    hasResults,
  };
}

// Totais por mês para a loja.
export function totalsFor(
  rows: AdReport[],
  store: string,
  year: number,
  month: number,
): Totals | null {
  return monthTotals(rows, store as Store, year, month);
}

// As fórmulas vermelhas, a partir dos totais.
export function metrics(t: Totals | null): Metrics {
  if (!t) return { custoLead: null, pctConv: null, custoVenda: null, roi: null, receitaLead: null };
  const inv = t.investimento;
  const conv = t.conversas;
  const vend = t.vendidos;
  const luc = t.lucro;
  return {
    custoLead: conv > 0 ? inv / conv : null,
    pctConv: conv > 0 && vend != null ? vend / conv : null,
    custoVenda: vend != null && vend > 0 ? inv / vend : null,
    roi: inv > 0 && luc != null ? luc / inv : null,
    receitaLead: conv > 0 && luc != null ? luc / conv : null,
  };
}

// Dinheiro no padrão BR: vírgula decimal, ponto de milhar, centavos só quando há.
export function brl2(v: number): string {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
export function pct(v: number | null): string {
  return v == null ? '—' : `${(v * 100).toFixed(1).replace('.', ',')}%`;
}
export function money(v: number | null): string {
  return v == null ? '—' : brl2(v);
}
export function moneyOr0(v: number | null): string {
  return brl2(v ?? 0);
}
export function roiTxt(v: number | null): string {
  return v == null ? '—' : `${v.toFixed(1).replace('.', ',')}x`;
}

// A partir de quando o "vendidos" vem automático do CRM (antes disso é o
// importado da planilha: Março/Abril/Maio 2026 e o histórico).
export const CRM_START = { y: 2026, m: 6 };
export function isLiveMonth(year: number, month: number): boolean {
  return year > CRM_START.y || (year === CRM_START.y && month >= CRM_START.m);
}

// Em qual das 4 semanas do mês cai um dia (mesmos cortes do weeksOfMonth).
export function weekIndexForDay(day: number): number {
  if (day <= 8) return 0;
  if (day <= 15) return 1;
  if (day <= 22) return 2;
  return 3;
}

// Gera as 4 semanas de um mês (pra meses ainda sem dados, ex. Junho em diante).
export function weeksOfMonth(year: number, month: number): { period_index: number; label: string }[] {
  const last = new Date(year, month, 0).getDate(); // último dia do mês
  const cuts = [[1, 8], [9, 15], [16, 22], [23, last]];
  const mm = String(month).padStart(2, '0');
  return cuts.map(([a, b], i) => ({
    period_index: i,
    label: `${String(a).padStart(2, '0')}/${mm} - ${String(b).padStart(2, '0')}/${mm}`,
  }));
}

// Quebra por semana de um mês (pra tabela "resultado por semana").
export function weeklyBreakdown(
  rows: AdReport[],
  store: string,
  year: number,
  month: number,
): { label: string; total: Totals }[] {
  const stores: string[] = [store];
  const weeks = rows.filter(
    (r) => stores.includes(r.store) && r.year === year && r.month === month && r.granularity === 'week',
  );
  if (!weeks.length) return [];
  const byIdx = new Map<number, AdReport[]>();
  for (const w of weeks) {
    const arr = byIdx.get(w.period_index) ?? [];
    arr.push(w);
    byIdx.set(w.period_index, arr);
  }
  return [...byIdx.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([idx, arr]) => ({
      label: arr.find((x) => x.period_label)?.period_label ?? `Semana ${idx + 1}`,
      total: aggregate(arr),
    }));
}

// ——— Vendas registradas (log) por loja/semana ———
// vendidos = contagem das vendas do log (o +/- das Metas grava cada venda
// datada). Cai na semana da própria data. O lucro continua manual no Relatório
// (o admin digita), por isso aqui lucro = null — fica pro merge não sobrescrever.
export type CrmMap = Record<string, { vend: number; lucro: number | null }>;

export function buildSalesMap(
  sales: { sold_on: string | null }[],
): CrmMap {
  const map: CrmMap = {};
  const STORE = 'belloni';
  for (const s of sales) {
    if (!s.sold_on) continue;
    // sold_on vem 'YYYY-MM-DD' — parse manual evita o fuso jogar pro dia anterior.
    const [y, m, d] = s.sold_on.split('-').map(Number);
    if (!y || !m || !d) continue;
    if (!isLiveMonth(y, m)) continue;
    const wi = weekIndexForDay(d);
    const k = `${STORE}-${y}-${m}-${wi}`;
    const cur = map[k] ?? { vend: 0, lucro: null };
    cur.vend += 1;
    map[k] = cur;
  }
  return map;
}

// Funde o CRM nas linhas: o valor digitado (manual) vence; onde está vazio,
// usa o CRM. Cria linhas pras semanas que só têm venda no CRM.
export function mergeCrmRows(rows: AdReport[], crm: CrmMap): AdReport[] {
  const out = rows.map((r) => ({ ...r }));
  const seen = new Set<string>();
  for (const r of out) {
    if (r.granularity === 'week' && isLiveMonth(r.year, r.month)) {
      const k = `${r.store}-${r.year}-${r.month}-${r.period_index}`;
      seen.add(k);
      const c = crm[k];
      if (c) {
        if (r.vendidos == null) r.vendidos = c.vend;
        if (r.lucro == null) r.lucro = c.lucro;
      }
    }
  }
  for (const k of Object.keys(crm)) {
    if (seen.has(k)) continue;
    const [store, ys, ms, wis] = k.split('-');
    const y = Number(ys);
    const m = Number(ms);
    const wi = Number(wis);
    out.push({
      id: `crm-${k}`,
      store: store as Store,
      year: y,
      month: m,
      granularity: 'week',
      period_index: wi,
      period_label: weeksOfMonth(y, m)[wi]?.label ?? null,
      investimento: null,
      conversas: null,
      vendidos: crm[k].vend,
      lucro: crm[k].lucro,
      updated_at: '',
      updated_by: null,
    });
  }
  return out;
}

// Sempre devolve as semanas do mês (4+), com dados onde houver e zeros onde não.
// Usado pra tabela semanal ser o centro do relatório (mesmo em mês vazio).
const EMPTY_TOTALS: Totals = {
  investimento: 0,
  conversas: 0,
  vendidos: null,
  lucro: null,
  hasResults: false,
};
export function weekTableFor(
  rows: AdReport[],
  store: string,
  year: number,
  month: number,
): { label: string; total: Totals }[] {
  const stores: string[] = [store];
  const weeks = rows.filter(
    (r) => stores.includes(r.store) && r.year === year && r.month === month && r.granularity === 'week',
  );
  const byIdx = new Map<number, AdReport[]>();
  for (const w of weeks) {
    const a = byIdx.get(w.period_index) ?? [];
    a.push(w);
    byIdx.set(w.period_index, a);
  }
  const gen = weeksOfMonth(year, month);
  const maxIdx = Math.max(gen.length - 1, ...(byIdx.size ? [...byIdx.keys()] : [0]));
  const out: { label: string; total: Totals }[] = [];
  for (let i = 0; i <= maxIdx; i++) {
    const arr = byIdx.get(i);
    const label = arr?.find((x) => x.period_label)?.period_label ?? gen[i]?.label ?? `Semana ${i + 1}`;
    out.push({ label, total: arr ? aggregate(arr) : { ...EMPTY_TOTALS } });
  }
  return out;
}

// Resumo de cada mês do ano (pra tabela "mês a mês").
export function yearBreakdown(
  rows: AdReport[],
  store: string,
  year: number,
): { month: number; total: Totals | null }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    total: totalsFor(rows, store, year, i + 1),
  }));
}

// Meses que têm algum dado (pra navegação e gráfico anual).
export function monthsWithData(rows: AdReport[], store: string): { year: number; month: number }[] {
  const set = new Set<string>();
  for (const r of rows) {
    if (store !== 'rede' && r.store !== store) continue;
    set.add(`${r.year}-${r.month}`);
  }
  return [...set]
    .map((k) => {
      const [y, m] = k.split('-').map(Number);
      return { year: y, month: m };
    })
    .sort((a, b) => a.year - b.year || a.month - b.month);
}
