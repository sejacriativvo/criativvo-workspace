'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Vehicle } from '@/lib/types';
import { brl } from '@/lib/negociacao';
import { SyncButton } from './sync-button';

function daysChip(days: number, inPrep: boolean) {
  if (inPrep) return { cls: 'bg-neutral-100 text-neutral-500', label: 'Em preparação' };
  if (days <= 30) return { cls: 'bg-emerald-50 text-emerald-700', label: `${days}d` };
  if (days <= 90) return { cls: 'bg-amber-50 text-amber-700', label: `${days}d` };
  return { cls: 'bg-rose-50 text-rose-700', label: `${days}d · girar` };
}

type Filter = 'all' | 'pending' | 'green' | 'yellow' | 'red' | 'stale' | 'prep';

export function EstoqueList({
  vehicles,
  isAdmin,
  costMap,
}: {
  vehicles: Vehicle[];
  isAdmin: boolean;
  costMap: Record<string, number | null>;
}) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const pendingCount = useMemo(
    () => vehicles.filter((v) => v.level === 'pending').length,
    [vehicles],
  );

  const list = useMemo(() => {
    return vehicles.filter((v) => {
      if (filter === 'pending' && v.level !== 'pending') return false;
      if (filter === 'green' && v.level !== 'green') return false;
      if (filter === 'yellow' && v.level !== 'yellow') return false;
      if (filter === 'red' && v.level !== 'red') return false;
      if (filter === 'stale' && v.days_in_stock <= 90) return false;
      if (filter === 'prep' && !v.in_prep) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !v.name.toLowerCase().includes(s) &&
          !(v.year ?? '').includes(s) &&
          !(v.cor ?? '').toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [vehicles, q, filter]);

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: `Todos (${vehicles.length})` },
    ...(pendingCount > 0 ? [{ key: 'pending' as Filter, label: `Sem margem (${pendingCount})` }] : []),
    { key: 'stale', label: 'Girar (+90d)' },
    { key: 'prep', label: 'Em preparação' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Estoque</h1>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <a
              href="/estoque/novo"
              className="rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white text-sm font-semibold px-3 py-2"
            >
              + Adicionar carro
            </a>
          )}
          {isAdmin && <SyncButton />}
        </div>
      </div>

      {/* Busca + filtros grudam no topo no celular: dá pra pesquisar/filtrar
          mesmo rolando a lista. No desktop ficam no fluxo normal. */}
      <div className="sticky top-14 z-20 -mx-4 mb-3 bg-neutral-50/90 px-4 pb-2 pt-2 backdrop-blur lg:static lg:top-auto lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-0 lg:backdrop-blur-none">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar modelo, ano, cor..."
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-900 mb-3"
        />

        <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                filter === c.key
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && pendingCount > 0 && (
        <button
          onClick={() => setFilter('pending')}
          className="w-full text-left mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-center gap-3"
        >
          <span className="grid place-items-center h-8 w-8 rounded-full bg-amber-400 text-white font-bold text-sm shrink-0">
            {pendingCount}
          </span>
          <span className="text-sm text-amber-900">
            {pendingCount === 1 ? 'carro sem margem definida' : 'carros sem margem definida'}.
            Defina a margem pra liberar o desconto pro vendedor. <b>Ver</b>
          </span>
        </button>
      )}

      {list.length === 0 ? (
        <p className="text-center text-neutral-400 py-16 text-sm">Nenhum carro encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {list.map((v) => {
            const dc = daysChip(v.days_in_stock, v.in_prep);
            const pending = v.level === 'pending';
            const cost = costMap[v.id];
            const margin = cost != null ? v.price - cost : null;
            return (
              <Link
                key={v.id}
                href={`/estoque/${v.id}`}
                className={`block bg-white rounded-2xl border overflow-hidden hover:shadow-md transition ${
                  pending ? 'border-amber-400 ring-2 ring-amber-200' : 'border-neutral-200'
                }`}
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  {v.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.img} alt={v.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-neutral-300 text-sm">
                      sem foto
                    </div>
                  )}
                  <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${dc.cls}`}>
                    {dc.label}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-base text-neutral-900 line-clamp-2 min-h-[2.75rem]">
                    {v.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {v.year} · {v.km} · {v.cor}
                  </p>

                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Tabela</span>
                    <span className="text-base font-semibold text-neutral-500">{brl(v.price)}</span>
                  </div>

                  {pending ? (
                    <div className="mt-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center text-sm font-semibold text-amber-700">
                      {isAdmin ? 'Definir margem' : 'Margem a definir'}
                    </div>
                  ) : (
                    <div className="mt-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                          Mínimo
                        </span>
                        {(v.max_discount ?? 0) > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-600">
                            −{brl(v.max_discount ?? 0)}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-extrabold leading-tight text-emerald-700">
                        {brl(v.price - (v.max_discount ?? 0))}
                      </div>
                    </div>
                  )}

                  {isAdmin && !pending && margin != null && (
                    <div data-private className="mt-2 pt-2 border-t border-dashed border-neutral-200 text-xs flex justify-between">
                      <span className="text-neutral-500">Custo {brl(cost!)}</span>
                      <span className="font-semibold text-emerald-700">Lucro {brl(margin)}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
