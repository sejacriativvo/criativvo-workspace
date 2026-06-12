'use client';

import { Car, Tag, Wallet, AlertCircle, Handshake, BadgeCheck, Megaphone, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

// Cards de métrica do Painel. Fica em client component porque os ícones (lucide)
// são funções — não podem ser passados de Server p/ Client Component como prop.
export function DashboardKpis({
  available,
  total,
  marketValue,
  patrimonio,
  withCostCount,
  pending,
  negotiating,
  vendasMes,
  invMes,
  lucroMes,
}: {
  available: number;
  total: number;
  marketValue: string;
  patrimonio: string;
  withCostCount: number;
  pending: number;
  negotiating: number;
  vendasMes: number;
  invMes: string;
  lucroMes: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard title="Carros disponíveis" value={String(available)} icon={Car} sub={`${total} no total`} />
        <MetricCard title="Valor de mercado" value={marketValue} icon={Tag} sub="se vender tudo na tabela" private />
        <MetricCard title="Patrimônio" value={patrimonio} icon={Wallet} sub={`custo de ${withCostCount} carro(s)`} private />
        <MetricCard title="Sem margem" value={String(pending)} icon={AlertCircle} accentClassName={pending > 0 ? 'text-amber-600' : undefined} sub="precisam definir" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <MetricCard title="Em negociação" value={String(negotiating)} icon={Handshake} sub="clientes ativos" />
        <MetricCard title="Vendas no mês" value={String(vendasMes)} icon={BadgeCheck} sub="registradas nas Metas" />
        <MetricCard title="Investido no mês" value={invMes} icon={Megaphone} sub="tráfego das duas lojas" private />
        <MetricCard title="Lucro do mês" value={lucroMes} icon={TrendingUp} accentClassName="text-emerald-700" sub="lançado no relatório" private />
      </div>
    </>
  );
}
