'use client';

import { useEffect, useRef, useState } from 'react';
import type { Store } from '@/lib/types';
import { STORE_LABEL } from '@/lib/relatorios';
import { setSaleCount } from './actions';

// Cartão de meta por loja. O +/- muda o número NA HORA e só grava no banco
// quando você para de clicar (manda o total final) — sem corrida, sem voltar atrás.
export function StoreGoalCard({
  store,
  initial,
  goal,
  isAdmin,
}: {
  store: Store;
  initial: number;
  goal: number;
  isAdmin: boolean;
}) {
  const [vendas, setVendas] = useState(initial);
  const [saving, setSaving] = useState(false);
  const ref = useRef(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function adj(delta: number) {
    const next = Math.max(0, ref.current + delta);
    ref.current = next;
    setVendas(next);
    setSaving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await setSaleCount(ref.current);
      setSaving(false);
    }, 500);
  }

  const pct = goal > 0 ? Math.min(100, Math.round((vendas / goal) * 100)) : 0;
  const faltam = Math.max(0, goal - vendas);
  const bateu = goal > 0 && vendas >= goal;

  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-5">
      <div className="text-sm text-neutral-400">{STORE_LABEL[store]}</div>
      <div className="text-4xl font-extrabold mt-1">
        {vendas}
        {goal > 0 && <span className="text-xl text-neutral-500"> / {goal}</span>}
      </div>

      {goal > 0 ? (
        <>
          <div className="mt-3 h-3 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${bateu ? 'bg-emerald-400' : 'bg-white'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-sm font-medium">
            {bateu ? '🎉 Meta batida!' : `Faltam ${faltam} venda(s) (${pct}%).`}
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-neutral-400">
          {isAdmin ? 'Defina a meta dessa loja abaixo.' : 'Meta ainda não definida.'}
        </p>
      )}

      {isAdmin && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => adj(-1)}
            aria-label="Remover venda"
            className="h-10 w-10 grid place-items-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-2xl font-bold leading-none active:scale-90 transition"
          >
            −
          </button>
          <button
            onClick={() => adj(1)}
            aria-label="Registrar venda"
            className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold leading-none active:scale-90 transition"
          >
            +
          </button>
          <span className="text-xs text-neutral-500">{saving ? 'salvando...' : 'registrar venda'}</span>
        </div>
      )}
    </div>
  );
}
