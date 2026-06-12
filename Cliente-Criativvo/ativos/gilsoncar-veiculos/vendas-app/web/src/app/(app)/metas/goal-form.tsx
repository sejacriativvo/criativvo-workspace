'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveGoals } from './actions';

export function GoalForm({ ibitinga, borborema }: { ibitinga: number; borborema: number }) {
  const [state, formAction, pending] = useActionState(saveGoals, null);
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="text-xs font-semibold text-neutral-600">Meta de vendas do mês (por loja)</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-neutral-500">
          Ibitinga
          <input
            name="goal_ibitinga"
            type="number"
            min="0"
            defaultValue={ibitinga || ''}
            placeholder="20"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-neutral-500">
          Borborema
          <input
            name="goal_borborema"
            type="number"
            min="0"
            defaultValue={borborema || ''}
            placeholder="10"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-3 py-2 disabled:opacity-60"
        >
          {pending ? '...' : 'Salvar metas'}
        </button>
        {state?.ok && <span className="text-xs text-emerald-600">Salvo!</span>}
        {state?.error && <span className="text-xs text-rose-600">{state.error}</span>}
      </div>
    </form>
  );
}
