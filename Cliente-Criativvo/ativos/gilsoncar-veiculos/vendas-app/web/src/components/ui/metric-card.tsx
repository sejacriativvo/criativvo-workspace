'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Aceita componentes de ícone (ex.: ícones do lucide-react).
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export type TrendType = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  /** Valor principal (ex.: "1.234", "R$ 5,6 mi", "92%"). */
  value: string;
  /** Título/descrição da métrica (ex.: "Vendas no mês"). */
  title: string;
  /** Ícone opcional no topo do card. */
  icon?: IconType;
  /** Linha de apoio (texto descritivo neutro, ex.: "tráfego das duas lojas"). */
  sub?: string;
  /** Variação pra tendência (ex.: "+12%"). Se vier, mostra seta colorida no lugar do sub. */
  trendChange?: string;
  /** Direção da tendência. */
  trendType?: TrendType;
  /** Cor do valor (ex.: "text-emerald-700"). */
  accentClassName?: string;
  /** Dado confidencial (R$): borra no modo privacidade (olho do cabeçalho). */
  private?: boolean;
  /** Classe extra no container. */
  className?: string;
}

// Card de métrica clean (design shadcn do demo): bastante respiro, título em
// cinza, valor em destaque e uma linha de apoio. Levanta levemente no hover.
export function MetricCard({
  value,
  title,
  icon: IconComponent,
  sub,
  trendChange,
  trendType = 'neutral',
  accentClassName,
  private: isPrivate,
  className,
}: MetricCardProps) {
  const TrendIcon = trendType === 'up' ? ArrowUp : trendType === 'down' ? ArrowDown : Minus;
  const trendColorClass =
    trendType === 'up'
      ? 'text-emerald-600'
      : trendType === 'down'
      ? 'text-rose-600'
      : 'text-muted-foreground';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn('cursor-pointer rounded-lg', className)}
    >
      <Card className="h-full transition-colors duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {IconComponent && (
            <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent>
          <div {...(isPrivate ? { 'data-private': '' } : {})} className={cn('mb-2 whitespace-nowrap text-2xl font-bold tabular-nums', accentClassName ?? 'text-foreground')}>{value}</div>
          {trendChange ? (
            <p className={cn('flex items-center text-xs font-medium', trendColorClass)}>
              <TrendIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              {trendChange}
            </p>
          ) : sub ? (
            <p className="text-xs text-muted-foreground">{sub}</p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MetricCard;
