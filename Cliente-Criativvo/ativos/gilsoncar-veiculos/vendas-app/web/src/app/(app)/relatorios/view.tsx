'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, BadgeCheck, TrendingUp, Percent } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartBar,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { MetricCard } from '@/components/ui/metric-card';
import type { AdReport, Role, Store } from '@/lib/types';
import {
  MESES,
  MES_ABREV,
  STORE_LABEL,
  totalsFor,
  metrics,
  money,
  pct,
  roiTxt,
  weeksOfMonth,
  weekTableFor,
  weekIndexForDay,
  yearBreakdown,
  sumTotals,
  brl2,
  isLiveMonth,
  mergeCrmRows,
  type Totals,
  type CrmMap,
} from '@/lib/relatorios';
import { saveWeeks, saveMonthHistory, setReportSales } from './actions';
import { MetaSyncButton } from './meta-sync-button';

type StoreSel = Store | 'rede';
const STORES: StoreSel[] = ['ibitinga', 'borborema', 'rede'];
const FEE: Record<StoreSel, number> = { ibitinga: 4000, borborema: 750, rede: 4750 };

function Delta({ now, prev }: { now: number | null; prev: number | null }) {
  if (now == null || prev == null || prev === 0) return null;
  const d = (now - prev) / prev;
  const up = d >= 0;
  return (
    <span className={`text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
      {up ? '▲' : '▼'} {Math.abs(d * 100).toFixed(0)}%
    </span>
  );
}

export function RelatoriosView({ rows, crm, role }: { rows: AdReport[]; crm: CrmMap; role: Role }) {
  const router = useRouter();
  const now = new Date();

  const [store, setStore] = useState<StoreSel>('ibitinga');
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [toast, setToast] = useState<string | null>(null);

  const isRede = store === 'rede';
  const isLive = isLiveMonth(ym.y, ym.m);

  // Exibição usa as linhas com o CRM fundido (vendidos/lucro automáticos).
  // O lançamento (formulário) usa as linhas cruas (só o que foi digitado).
  const displayRows = useMemo(() => mergeCrmRows(rows, crm), [rows, crm]);

  function shift(d: number) {
    setYm((p) => {
      let m = p.m + d;
      let y = p.y;
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      return { y, m };
    });
  }

  // Linhas do mês selecionado (das lojas escolhidas).
  const stores: Store[] = isRede ? ['ibitinga', 'borborema'] : [store];
  const monthRows = displayRows.filter(
    (r) => stores.includes(r.store) && r.year === ym.y && r.month === ym.m,
  );
  const hasWeekly = monthRows.some((r) => r.granularity === 'week');
  const hasMonthly = monthRows.some((r) => r.granularity === 'month');
  const showHistorico = !hasWeekly && hasMonthly; // mês só com total mensal (histórico)

  const t = totalsFor(displayRows, store, ym.y, ym.m);
  const tableRows: { label: string; total: Totals; gran?: 'week' | 'month'; pidx?: number; plabel?: string | null }[] =
    showHistorico && t
      ? [{ label: `${MESES[ym.m - 1]} (mês inteiro)`, total: t, gran: 'month', pidx: 0, plabel: null }]
      : weekTableFor(displayRows, store, ym.y, ym.m).map((r, i) => ({ ...r, gran: 'week', pidx: i, plabel: r.label }));
  const monthTotal = tableRows.reduce<Totals | null>((acc, r) => sumTotals(acc, r.total), null);

  const prev = totalsFor(displayRows, store, ym.y - 1, ym.m); // mesmo mês, ano anterior

  // Custo de marketing = tráfego do mês + serviço da Criativvo (÷ vendas = por carro).
  const fee = FEE[store];
  const invMes = monthTotal?.investimento ?? 0;
  const vendMes = monthTotal?.vendidos ?? null;
  const custoMkt = invMes + fee;
  const custoMes = vendMes && vendMes > 0 ? custoMkt / vendMes : null;

  // Mês rodando -> headline da SEMANA atual (tráfego por carro).
  // Mês fechado -> headline do mês completo (tráfego + serviço).
  const isCurrentMonth = ym.y === now.getFullYear() && ym.m === now.getMonth() + 1;
  const curWeekIdx = weekIndexForDay(now.getDate());
  const curWeek = isCurrentMonth ? tableRows[curWeekIdx]?.total ?? null : null;
  const curWeekLabel = isCurrentMonth ? tableRows[curWeekIdx]?.label ?? '' : '';
  const curInv = curWeek?.investimento ?? 0;
  const curVend = curWeek?.vendidos ?? 0;
  const custoSemana = curVend > 0 ? curInv / curVend : null;

  // Resumo mês a mês do ano (comparar meses).
  const monthTable = yearBreakdown(displayRows, store, ym.y).filter((r) => r.total);

  // Lançamento (só loja específica). Sempre 4 semanas, mescladas com o que existe.
  const storeWeekRows = isRede
    ? []
    : rows.filter((r) => r.store === store && r.year === ym.y && r.month === ym.m && r.granularity === 'week');
  const storeMonthly = isRede
    ? undefined
    : rows.find((r) => r.store === store && r.year === ym.y && r.month === ym.m && r.granularity === 'month');
  const entryHistorico = !isRede && storeWeekRows.length === 0 && !!storeMonthly;

  const initialWeeks = useMemo(() => {
    if (isRede || entryHistorico) return [];
    const byIdx = new Map(storeWeekRows.map((w) => [w.period_index, w]));
    return weeksOfMonth(ym.y, ym.m).map((g) => {
      const w = byIdx.get(g.period_index);
      return {
        period_index: g.period_index,
        period_label: w?.period_label ?? g.label,
        investimento: w?.investimento ?? null,
        conversas: w?.conversas ?? null,
        vendidos: w?.vendidos ?? null,
        lucro: w?.lucro ?? null,
      };
    });
  }, [rows, store, ym.y, ym.m]); // eslint-disable-line react-hooks/exhaustive-deps

  // Contagem do CRM por semana (mostra como referência no lançamento do Italo).
  const entryCrm: Record<number, number> = {};
  if (!isRede) {
    for (let i = 0; i < 5; i++) {
      const k = `${store}-${ym.y}-${ym.m}-${i}`;
      if (crm[k]) entryCrm[i] = crm[k].vend;
    }
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-600 text-white text-sm font-semibold px-4 py-2 shadow-lg">
          ✓ {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Relatórios</h1>
          <p className="text-xs text-neutral-400">Tráfego pago por loja</p>
        </div>
        <MetaSyncButton />
      </div>

      {/* Loja */}
      <div className="flex gap-2 mb-3 mt-3">
        {STORES.map((s) => (
          <button
            key={s}
            onClick={() => setStore(s)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold border transition ${
              store === s ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
            }`}
          >
            {STORE_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Mês */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={() => shift(-1)} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 active:scale-95">‹</button>
        <span className="font-bold text-neutral-900 min-w-40 text-center capitalize">{MESES[ym.m - 1]} {ym.y}</span>
        <button onClick={() => shift(1)} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 active:scale-95">›</button>
      </div>

      {/* Headline: semana atual se o mês está rodando; mês completo se já fechou */}
      {isCurrentMonth ? (
        <div className="bg-neutral-900 text-white rounded-2xl p-5">
          <div className="text-sm text-neutral-400">
            Custo de tráfego por carro · esta semana{curWeekLabel ? ` (${curWeekLabel})` : ''}
          </div>
          <div data-private className="text-4xl font-extrabold mt-1">{custoSemana == null ? '—' : brl2(custoSemana)}</div>
          <div className="mt-2 text-sm text-neutral-300">
            {curVend > 0 ? (
              <>Tráfego <b className="text-white">{money(curInv)}</b> ÷ {curVend} venda(s) desta semana.</>
            ) : (
              'Nenhuma venda registrada nesta semana ainda.'
            )}
            <span className="block text-neutral-400 mt-1">O serviço ({brl2(fee)}/mês) entra no custo total quando o mês fechar.</span>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 text-white rounded-2xl p-5">
          <div className="text-sm text-neutral-400">
            Custo pra vender 1 carro · <span className="capitalize">{MESES[ym.m - 1]}</span>
          </div>
          <div data-private className="text-4xl font-extrabold mt-1">{custoMes == null ? '—' : brl2(custoMes)}</div>
          <div className="mt-2 text-sm text-neutral-300">
            Tráfego <b className="text-white">{money(invMes)}</b> + serviço Criativvo{' '}
            <b className="text-white">{brl2(fee)}</b> = <b className="text-white">{brl2(custoMkt)}</b>
            {vendMes && vendMes > 0 ? <> ÷ {vendMes} venda(s)</> : ' · sem vendas no mês'}
          </div>
        </div>
      )}

      {/* Números-chave do mês (cartões coloridos) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <MetricCard title="Investido no tráfego" value={money(invMes)} icon={Megaphone} accentClassName="text-sky-700" private />
        <MetricCard title="Carros vendidos" value={vendMes == null ? '—' : String(vendMes)} icon={BadgeCheck} accentClassName="text-indigo-700" />
        <MetricCard title="Lucro" value={money(monthTotal?.lucro ?? null)} icon={TrendingUp} accentClassName="text-emerald-700" private />
        <MetricCard title="ROI" value={roiTxt(metrics(monthTotal).roi)} icon={Percent} accentClassName="text-amber-700" private />
      </div>

      {/* Tabela protagonista: por semana */}
      <div className="mt-3 bg-white rounded-2xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-sm font-semibold text-neutral-700">
            {showHistorico ? 'Resultado do mês' : 'Por semana'} — <span className="capitalize">{MESES[ym.m - 1]}</span> {ym.y}
          </div>
          {role === 'admin' && !isRede && (
            <span className="text-[11px] text-emerald-600 font-medium">✎ vendas editáveis</span>
          )}
        </div>
        <ResultsTable
          rows={tableRows}
          totalLabel="Total do mês"
          editable={
            role === 'admin' && !isRede
              ? { store: store as Store, year: ym.y, month: ym.m, onSaved: () => { flash('Venda atualizada'); router.refresh(); } }
              : undefined
          }
        />
      </div>

      {/* Comparativo ano anterior */}
      {prev && (
        <div className="mt-3 bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="text-sm font-semibold text-neutral-700 mb-3">
            Comparativo com <span className="capitalize">{MESES[ym.m - 1]}</span>/{ym.y - 1}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <CompareRow label="Investimento" prev={prev.investimento} now={invMes} fmt={brl2} />
            <CompareRow label="Leads" prev={prev.conversas} now={monthTotal?.conversas ?? 0} fmt={(n) => String(n)} />
            <CompareRow label="Vendidos" prev={prev.vendidos} now={vendMes} fmt={(n) => String(n)} />
            <CompareRow label="Lucro" prev={prev.lucro} now={monthTotal?.lucro ?? null} fmt={brl2} />
          </div>
          {prev.vendidos == null && (
            <p className="mt-2 text-xs text-neutral-400">
              O ano passado só tem investimento e leads registrados.
            </p>
          )}
        </div>
      )}

      {/* Mês a mês — um gráfico só: vendas e investimento lado a lado por mês */}
      {monthTable.length > 0 && (
        <div className="mt-3 bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="text-sm font-semibold text-neutral-700 mb-3">Vendas e investimento por mês — {ym.y}</div>
          <MonthlyCharts rows={monthTable} />
        </div>
      )}

      {/* Lançamento — cada um vê só a sua parte */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2">Lançamento — {STORE_LABEL[store]}</h2>
        {isRede ? (
          <Note>Escolha <b>Ibitinga</b> ou <b>Borborema</b> pra lançar os dados.</Note>
        ) : entryHistorico ? (
          role === 'admin' ? (
            <MonthHistoryEntry
              key={`mh-${store}-${ym.y}-${ym.m}`}
              store={store as Store}
              year={ym.y}
              month={ym.m}
              vendidos={storeMonthly?.vendidos ?? null}
              lucro={storeMonthly?.lucro ?? null}
              onSaved={() => { flash('Salvo'); router.refresh(); }}
            />
          ) : (
            <Note>Dado histórico (mensal) — só leitura. O lançamento por semana começa em março/2026.</Note>
          )
        ) : role === 'traffic' ? (
          <WeekEntry
            key={`t-${store}-${ym.y}-${ym.m}`}
            store={store as Store}
            year={ym.y}
            month={ym.m}
            initial={initialWeeks}
            fields={['investimento', 'conversas']}
            onSaved={() => { flash('Salvo'); router.refresh(); }}
          />
        ) : (
          <WeekEntry
            key={`a-${store}-${ym.y}-${ym.m}`}
            store={store as Store}
            year={ym.y}
            month={ym.m}
            initial={initialWeeks}
            fields={['lucro']}
            crmVend={isLive ? entryCrm : undefined}
            onSaved={() => { flash('Salvo'); router.refresh(); }}
          />
        )}
      </div>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-sm text-neutral-600">
      {children}
    </div>
  );
}

const monthChartConfig = {
  vendas: { label: 'Vendas', color: '#2563eb' },
  investimento: { label: 'Investimento (R$)', color: '#7dd3fc' },
} satisfies ChartConfig;

// Vendas e investimento por mês — barras agrupadas, largura cheia. Eixos Y
// escondidos e separados, porque vendas é unidade e investimento é R$.
function MonthlyCharts({ rows }: { rows: { month: number; total: Totals | null }[] }) {
  const data = rows.map((r) => ({
    mes: MES_ABREV[r.month - 1],
    vendas: r.total?.vendidos ?? 0,
    investimento: Math.round(r.total?.investimento ?? 0),
  }));

  return (
    <div className="w-full">
      <div className="flex gap-4 text-[11px] text-neutral-500 mb-2">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: '#2563eb' }} /> Vendas</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: '#7dd3fc' }} /> Investimento (R$)</span>
      </div>
      <ChartContainer className="aspect-auto h-64 w-full" config={monthChartConfig}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis axisLine={false} dataKey="mes" tickFormatter={(value) => value.slice(0, 3)} tickLine={false} tickMargin={10} />
          <YAxis yAxisId="vendas" hide />
          <YAxis yAxisId="inv" orientation="right" hide />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} cursor={false} />
          <ChartBar yAxisId="vendas" dataKey="vendas" fill="var(--color-vendas)" radius={4} seriesIndex={0} />
          <ChartBar yAxisId="inv" dataKey="investimento" fill="var(--color-investimento)" radius={4} seriesIndex={1} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

// Tabela de resultados (estilo planilha) — usada na semana e no mês a mês.
type TableRow = { label: string; total: Totals; gran?: 'week' | 'month'; pidx?: number; plabel?: string | null };

function ResultsTable({
  rows,
  totalLabel = 'Total',
  highlight,
  editable,
}: {
  rows: TableRow[];
  totalLabel?: string;
  highlight?: string;
  editable?: { store: Store; year: number; month: number; onSaved: () => void };
}) {
  const [edited, setEdited] = useState<Record<number, string>>({});
  const [savingKey, setSavingKey] = useState<number | null>(null);
  const [, startSave] = useTransition();

  const canEdit = (r: TableRow) => !!editable && r.gran != null && r.pidx != null;

  // Aplica a venda editada pra % conv, custo/venda e ROI recalcularem ao vivo.
  const effRows = rows.map((r) =>
    canEdit(r) && edited[r.pidx!] != null ? { ...r, total: { ...r.total, vendidos: toNum(edited[r.pidx!]) } } : r,
  );
  const grand = effRows.reduce<Totals | null>((acc, r) => sumTotals(acc, r.total), null);
  const C = 'px-2.5 py-2 text-right tabular-nums whitespace-nowrap';
  const H = 'px-2.5 py-2 text-right font-medium';

  function commit(r: TableRow) {
    if (!editable || r.pidx == null || r.gran == null || edited[r.pidx] == null) return;
    const target = Math.max(0, Math.round(toNum(edited[r.pidx]) ?? 0));
    const pidx = r.pidx;
    setSavingKey(pidx);
    startSave(async () => {
      const res = await setReportSales({
        store: editable.store,
        year: editable.year,
        month: editable.month,
        granularity: r.gran!,
        periodIndex: pidx,
        periodLabel: r.plabel ?? null,
        target,
      });
      setSavingKey(null);
      setEdited((prev) => {
        const n = { ...prev };
        delete n[pidx];
        return n;
      });
      if (res?.error) alert(res.error);
      else editable.onSaved();
    });
  }

  // Função (não componente) pra não remontar o input e perder o foco ao digitar.
  function renderRow(r: TableRow, opts?: { bold?: boolean; hl?: boolean }) {
    const bold = opts?.bold;
    const total = r.total;
    const m = metrics(total);
    const bg = bold ? 'bg-neutral-100' : opts?.hl ? 'bg-amber-50' : 'bg-white';
    const edit = !bold && canEdit(r);
    return (
      <tr key={r.label} className={`${bg} ${bold ? 'font-bold text-neutral-900 border-t-2 border-neutral-300' : 'border-b border-neutral-100'}`}>
        <td className={`px-2.5 py-2 text-left whitespace-nowrap sticky left-0 z-10 ${bg} ${bold ? '' : 'text-neutral-700'}`}>{r.label}</td>
        <td className={C}>{money(total.investimento)}</td>
        <td className={C}>{total.conversas}</td>
        <td className={C}>{money(m.custoLead)}</td>
        {edit ? (
          <td className="px-2.5 py-2 text-right">
            <input
              inputMode="numeric"
              value={edited[r.pidx!] ?? (total.vendidos == null ? '' : String(total.vendidos))}
              onChange={(e) => setEdited((p) => ({ ...p, [r.pidx!]: e.target.value }))}
              onBlur={() => commit(r)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              disabled={savingKey === r.pidx}
              className="w-16 rounded-md border border-emerald-300 bg-emerald-50/50 px-2 py-1 text-right text-sm font-semibold tabular-nums text-emerald-800 outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </td>
        ) : (
          <td className={C}>{total.vendidos == null ? '—' : total.vendidos}</td>
        )}
        <td className={C}>{pct(m.pctConv)}</td>
        <td className={C}>{money(m.custoVenda)}</td>
        <td data-private className={`${C} ${bold ? 'text-emerald-700' : 'font-semibold text-emerald-700'}`}>{money(total.lucro)}</td>
        <td className={C}>{roiTxt(m.roi)}</td>
      </tr>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <p className="text-[11px] text-neutral-400 mb-1 sm:hidden">← arraste pra ver todas as colunas →</p>
      <table className="w-full text-sm border-collapse min-w-[700px]">
        <thead>
          <tr className="text-[11px] text-neutral-500 border-b border-neutral-200">
            <th className="px-2.5 py-2 text-left font-medium sticky left-0 bg-white z-10">Período</th>
            <th className={H}>Investido</th>
            <th className={H}>Leads</th>
            <th className={H}>Custo/lead</th>
            <th className={H}>Vendas</th>
            <th className={H}>Conversão</th>
            <th className={H}>Custo/venda</th>
            <th className={H}>Lucro</th>
            <th className={H}>ROI</th>
          </tr>
        </thead>
        <tbody>{effRows.map((r) => renderRow(r, { hl: !!highlight && r.label === highlight }))}</tbody>
        {grand && <tfoot>{renderRow({ label: totalLabel, total: grand }, { bold: true })}</tfoot>}
      </table>
    </div>
  );
}

function CompareRow({
  label,
  prev,
  now,
  fmt,
}: {
  label: string;
  prev: number | null;
  now: number | null;
  fmt: (n: number) => string;
}) {
  return (
    <div>
      <div className="text-xs text-neutral-500 flex items-center gap-2">
        {label} <Delta now={now} prev={prev} />
      </div>
      <div className="text-sm mt-0.5">
        <span className="text-neutral-400">{prev == null ? '—' : fmt(prev)}</span>
        <span className="text-neutral-300 mx-1">→</span>
        <span className="font-bold text-neutral-900">{now == null ? '—' : fmt(now)}</span>
      </div>
    </div>
  );
}

type Field = 'investimento' | 'conversas' | 'vendidos' | 'lucro';
const FIELD_LABEL: Record<Field, string> = {
  investimento: 'Investimento',
  conversas: 'Conversas',
  vendidos: 'Vendidos',
  lucro: 'Lucro',
};
const FIELD_BLUE = (f: Field) => f === 'investimento' || f === 'conversas';

type WeekState = {
  period_index: number;
  period_label: string;
  investimento: string;
  conversas: string;
  vendidos: string;
  lucro: string;
};

function toStr(v: number | null): string {
  return v == null ? '' : String(v).replace('.', ',');
}
function toNum(s: string): number | null {
  let v = s.trim().replace(/\s/g, '');
  if (v === '') return null;
  if (v.includes(',')) v = v.replace(/\./g, '').replace(',', '.');
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function WeekEntry({
  store,
  year,
  month,
  initial,
  fields,
  crmVend,
  onSaved,
}: {
  store: Store;
  year: number;
  month: number;
  initial: {
    period_index: number;
    period_label: string;
    investimento: number | null;
    conversas: number | null;
    vendidos: number | null;
    lucro: number | null;
  }[];
  fields: Field[];
  crmVend?: Record<number, number>;
  onSaved: () => void;
}) {
  const [weeks, setWeeks] = useState<WeekState[]>(
    initial.map((w) => ({
      period_index: w.period_index,
      period_label: w.period_label,
      investimento: toStr(w.investimento),
      conversas: toStr(w.conversas),
      vendidos: toStr(w.vendidos),
      lucro: toStr(w.lucro),
    })),
  );
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function set(i: number, field: Field, value: string) {
    setWeeks((prev) => prev.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)));
  }

  function save() {
    setErr(null);
    start(async () => {
      const r = await saveWeeks({
        store,
        year,
        month,
        weeks: weeks.map((w) => ({
          period_index: w.period_index,
          period_label: w.period_label,
          investimento: toNum(w.investimento),
          conversas: toNum(w.conversas),
          vendidos: toNum(w.vendidos),
          lucro: toNum(w.lucro),
        })),
      });
      if (r?.error) setErr(r.error);
      else onSaved();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <p className="text-[11px] text-neutral-400 mb-2">
        {crmVend
          ? 'As vendas vêm sozinhas do +/- das Metas (contadas na semana da data). Aqui você só lança o lucro de cada semana.'
          : 'Preencha as semanas e salve. Você edita só os campos abaixo.'}
      </p>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-[11px] text-neutral-500 text-left">
              <th className="py-1 pr-2 font-medium">Semana</th>
              {fields.map((f) => (
                <th key={f} className={`py-1 px-1 font-medium ${FIELD_BLUE(f) ? 'text-sky-600' : 'text-emerald-600'}`}>
                  {FIELD_LABEL[f]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => (
              <tr key={w.period_index} className="border-t border-neutral-100">
                <td className="py-1.5 pr-2 text-xs text-neutral-600 whitespace-nowrap">
                  {w.period_label}
                  {crmVend && crmVend[w.period_index] != null && (
                    <span className="ml-1 text-[10px] font-semibold text-emerald-600">· {crmVend[w.period_index]} venda(s)</span>
                  )}
                </td>
                {fields.map((f) => {
                  const blue = FIELD_BLUE(f);
                  const decimal = f === 'investimento' || f === 'lucro';
                  const hint = f === 'vendidos' && crmVend && crmVend[w.period_index] != null
                    ? `CRM: ${crmVend[w.period_index]}`
                    : null;
                  return (
                    <td key={f} className="py-1.5 px-1 align-top">
                      <input
                        inputMode={decimal ? 'decimal' : 'numeric'}
                        value={w[f]}
                        onChange={(e) => set(i, f, e.target.value)}
                        placeholder={hint ? String(crmVend![w.period_index]) : decimal ? 'R$' : '0'}
                        className={`w-24 rounded-lg border px-2 py-1.5 text-sm outline-none ${
                          blue ? 'border-sky-200 bg-sky-50/40 focus:border-sky-500' : 'border-emerald-200 bg-emerald-50/40 focus:border-emerald-500'
                        }`}
                      />
                      {hint && <div className="text-[10px] text-neutral-400 mt-0.5">{hint}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err && <p className="text-sm text-rose-600 mt-2">{err}</p>}

      <button
        onClick={save}
        disabled={pending}
        className="mt-3 w-full sm:w-auto rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Salvar lançamento'}
      </button>
    </div>
  );
}

// Lançamento de mês histórico (admin): total de carros vendidos + lucro do mês.
// Investimento e conversas continuam vindo da Meta (não aparecem aqui).
function MonthHistoryEntry({
  store,
  year,
  month,
  vendidos,
  lucro,
  onSaved,
}: {
  store: Store;
  year: number;
  month: number;
  vendidos: number | null;
  lucro: number | null;
  onSaved: () => void;
}) {
  const [l, setL] = useState(toStr(lucro));
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function save() {
    setErr(null);
    start(async () => {
      // vendidos preservado (agora se edita direto na tabela acima).
      const r = await saveMonthHistory({ store, year, month, vendidos, lucro: toNum(l) });
      if (r?.error) setErr(r.error);
      else onSaved();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <p className="text-[11px] text-neutral-400 mb-3">
        Mês anterior ao CRM. As <b>vendas</b> você edita direto na tabela acima. Aqui lance só o <b>lucro</b> do mês (opcional). Investimento e conversas vêm da Meta.
      </p>
      <label className="block text-xs font-medium text-emerald-700">
        Lucro do mês (R$)
        <input
          inputMode="decimal"
          value={l}
          onChange={(e) => setL(e.target.value)}
          placeholder="R$"
          className="mt-1 block w-44 rounded-lg border border-emerald-200 bg-emerald-50/40 px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
      </label>

      {err && <p className="text-sm text-rose-600 mt-2">{err}</p>}

      <button
        onClick={save}
        disabled={pending}
        className="mt-3 w-full sm:w-auto rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Salvar lucro do mês'}
      </button>
    </div>
  );
}
