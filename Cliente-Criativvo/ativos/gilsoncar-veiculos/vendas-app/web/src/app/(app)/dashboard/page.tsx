import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { CarRow, Client } from '@/lib/types';
import { brl, brlCompact } from '@/lib/negociacao';
import { DashboardKpis } from './kpis';
import { Funnel, Donut } from './charts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Mês corrente no fuso de SP (bate com o log de vendas e o relatório).
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const [yy, mm] = today.split('-');
  const curY = Number(yy);
  const curM = Number(mm);
  const first = `${yy}-${mm}-01`;
  const lastDay = new Date(curY, curM, 0).getDate();
  const last = `${yy}-${mm}-${String(lastDay).padStart(2, '0')}`;

  const [{ data: cars }, { data: clients }, { data: salesRows }, { data: adRows }] = await Promise.all([
    supabase.from('cars').select('*'),
    supabase.from('clients').select('*'),
    supabase.from('sales').select('store').gte('sold_on', first).lte('sold_on', last),
    supabase.from('ad_reports').select('investimento, lucro').eq('year', curY).eq('month', curM),
  ]);

  const carList = (cars as CarRow[]) ?? [];
  const clientList = (clients as Client[]) ?? [];

  const available = carList.filter((c) => c.status === 'available');
  const totalValue = available.reduce((s, c) => s + c.price, 0); // se vender tudo na tabela
  const withCost = available.filter((c) => c.cost != null);
  const patrimonio = withCost.reduce((s, c) => s + (c.cost ?? 0), 0); // custo investido
  const pending = available.filter((c) => c.negotiation_discount == null); // sem margem
  // Giro real: dias desde a AQUISIÇÃO (quando a GilsonCar comprou), não desde o
  // cadastro no app (recente pra todos por causa do sync da Shopify).
  const stockDays = (c: CarRow) =>
    Math.floor((Date.now() - new Date(c.acquired_at ?? c.created_at).getTime()) / 86400000);
  const stale = available.filter((c) => stockDays(c) > 90).length;

  const byStatus = (s: string) => clientList.filter((c) => c.status === s).length;
  const negotiating = byStatus('negotiating');

  // Vendas/investido/lucro do mês — fonte única: o log de vendas (Metas) e o
  // relatório de tráfego. Mesmos números que aparecem em Metas e Relatórios.
  const vendasMes = (salesRows as { store: string }[] | null)?.length ?? 0;
  const adList = (adRows as { investimento: number | null; lucro: number | null }[] | null) ?? [];
  const invMes = adList.reduce((s, r) => s + (r.investimento ?? 0), 0);
  const lucroMes = adList.reduce((s, r) => s + (r.lucro ?? 0), 0);

  // dados dos gráficos
  const funnel = [
    { label: 'Lead', value: byStatus('lead'), color: '#0ea5e9' },
    { label: 'Visita', value: byStatus('visit'), color: '#6366f1' },
    { label: 'Negociando', value: byStatus('negotiating'), color: '#f59e0b' },
    { label: 'Retornar', value: byStatus('followup'), color: '#a855f7' },
    { label: 'Vendas (mês)', value: vendasMes, color: '#10b981' }, // fecha o funil
  ];
  const estoqueComp = [
    { label: 'Com margem', value: available.filter((c) => !c.in_prep && c.negotiation_discount != null).length, color: '#10b981' },
    { label: 'Sem margem', value: available.filter((c) => !c.in_prep && c.negotiation_discount == null).length, color: '#f59e0b' },
    { label: 'Em preparação', value: available.filter((c) => c.in_prep).length, color: '#94a3b8' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Painel</h1>
      <p className="text-sm text-neutral-500 mb-5">Visão geral do estoque e das vendas.</p>

      {pending.length > 0 && (
        <Link
          href="/estoque"
          className="mb-3 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3"
        >
          <span className="grid place-items-center h-8 w-8 rounded-full bg-amber-400 text-white font-bold text-sm shrink-0">
            {pending.length}
          </span>
          <span className="text-sm text-amber-900">
            {pending.length === 1 ? 'carro sem margem definida' : 'carros sem margem definida'}.
            O vendedor não vê desconto até você definir. <b>Resolver</b>
          </span>
        </Link>
      )}

      <DashboardKpis
        available={available.length}
        total={carList.length}
        marketValue={brlCompact(totalValue)}
        patrimonio={brlCompact(patrimonio)}
        withCostCount={withCost.length}
        pending={pending.length}
        negotiating={negotiating}
        vendasMes={vendasMes}
        invMes={brlCompact(invMes)}
        lucroMes={brlCompact(lucroMes)}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        <Funnel title="Funil de clientes" data={funnel} />
        <Donut title="Composição do estoque" data={estoqueComp} />
      </div>

      {/* Carros mais parados */}
      <h2 className="text-sm font-semibold text-neutral-700 mt-6 mb-2">Carros parados há mais tempo</h2>
      <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
        {[...available]
          .sort((a, b) => stockDays(b) - stockDays(a))
          .slice(0, 6)
          .map((c) => {
            const days = stockDays(c);
            return (
              <Link key={c.id} href={`/estoque/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">{c.name}</div>
                  <div className="text-xs text-neutral-400">{c.year} · {c.km}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-neutral-900">{brl(c.price)}</div>
                  <div className={`text-xs ${days > 90 ? 'text-rose-600' : 'text-neutral-400'}`}>{days} dias</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
