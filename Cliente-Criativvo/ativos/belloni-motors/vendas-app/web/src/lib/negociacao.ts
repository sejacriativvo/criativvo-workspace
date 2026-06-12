// Lógica de negociação — espelho TS do que a view do banco calcula.
// O banco já devolve max_discount e level prontos (sem expor custo).
// Aqui ficam só helpers de formatação e os textos do semáforo.
import type { Settings, Level } from './types';
export type { Level };

export const DEFAULT_SETTINGS: Settings = {
  discount_pct: 0.4,
  green_threshold: 0.13,
  yellow_threshold: 0.07,
  dealership_name: 'Belloni Motors',
  store_domain: 'bellonimotors.com.br',
  monthly_goal: 0,
  monthly_sales: 0,
  sales_month: null,
  manual_sales: 0,
  manual_revenue: 0,
  manual_profit: 0,
  manual_month: null,
};

export function brl(n: number): string {
  return (
    'R$ ' +
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

// Versão curta pros cards: a partir de 1 milhão vira "R$ 2,4 mi" (cabe numa
// linha só, fácil de ler). Abaixo de 1 milhão mostra o valor cheio.
export function brlCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    const mi = (n / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return `R$ ${mi} mi`;
  }
  return brl(n);
}

export function fmt(n: number): string {
  return n.toLocaleString('pt-BR');
}

export const LEVEL_LABEL: Record<Level, string> = {
  green: 'Desconto liberado',
  yellow: 'Desconto liberado',
  red: 'Desconto liberado',
  pending: 'Margem a definir',
};

// Texto de orientação pro vendedor (não revela custo, só o teto de desconto).
export function levelHint(level: Level, maxDiscount: number | null): string {
  if (level === 'pending')
    return 'Margem ainda não definida. Não ofereça desconto sem confirmar com o gerente.';
  return `Você pode oferecer até ${brl(maxDiscount ?? 0)} de desconto. Acima disso, peça aprovação.`;
}

// Cor base do semáforo (Tailwind tokens usados nas telas).
export const LEVEL_COLOR: Record<Level, string> = {
  green: 'emerald',
  yellow: 'emerald',
  red: 'emerald',
  pending: 'slate',
};

// Badge de tempo no estoque (mesma regra do protótipo).
export function stockBadge(days: number, inPrep: boolean) {
  if (inPrep) return { cls: 'prep', label: 'Em preparação' };
  if (days <= 30) return { cls: 'fresh', label: `${days}d · Recente` };
  if (days <= 90) return { cls: 'medium', label: `${days}d · Atenção` };
  return { cls: 'urgent', label: `${days}d · Girar` };
}

// Visão SÓ do admin: lucro real (precisa de custo) e lucro após o desconto máximo.
// Custo é opcional; se não tiver, retorna nulos (admin pode só ter definido o desconto).
export function adminMetrics(
  price: number,
  cost: number | null,
  discount: number | null,
) {
  if (cost == null) {
    return { margin: null, marginPct: null, profitAfterDiscount: null };
  }
  const margin = price - cost;
  const marginPct = price > 0 ? margin / price : 0;
  const profitAfterDiscount = margin - (discount ?? 0);
  return { margin, marginPct, profitAfterDiscount };
}

export const CLIENT_STATUS_LABEL: Record<string, string> = {
  lead: 'Lead novo',
  visit: 'Visita marcada',
  negotiating: 'Negociando',
  followup: 'Ligar de volta',
  sold: 'Vendeu',
  lost: 'Não comprou',
};
