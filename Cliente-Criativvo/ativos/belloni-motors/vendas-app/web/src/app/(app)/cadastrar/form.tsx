'use client';

import { useActionState } from 'react';
import type { CarRow } from '@/lib/types';
import { saveMargin } from './actions';

export function MarginForm({ car }: { car: CarRow }) {
  const [state, formAction, pending] = useActionState(saveMargin, null);

  return (
    <form action={formAction} className="space-y-4 bg-white rounded-2xl border border-neutral-200 p-5">
      <input type="hidden" name="id" value={car.id} />

      <label className="block">
        <span className="text-sm font-semibold text-neutral-800">
          Custo do carro (R$)
        </span>
        <span className="block text-xs text-neutral-500 mb-1">
          A partir do custo e da margem global nas Configurações, o sistema calcula o desconto máximo automaticamente.
        </span>
        <input
          name="cost"
          type="number"
          min="0"
          required
          defaultValue={car.cost ?? ''}
          placeholder="60000"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-lg outline-none focus:border-neutral-900"
        />
      </label>

      <label className="block border-t border-neutral-100 pt-4">
        <span className="text-sm font-medium text-neutral-700">Data de aquisição (opcional)</span>
        <span className="block text-xs text-neutral-500 mb-1">
          Quando a Belloni Motors comprou esse carro. É a partir daqui que conta o tempo no estoque (giro).
        </span>
        <input
          name="acquired_at"
          type="date"
          defaultValue={car.acquired_at ?? ''}
          className="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
        />
      </label>

      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 hover:bg-neutral-950 disabled:opacity-60 text-white font-semibold py-2.5"
      >
        {pending ? 'Salvando...' : 'Salvar custo'}
      </button>
    </form>
  );
}
