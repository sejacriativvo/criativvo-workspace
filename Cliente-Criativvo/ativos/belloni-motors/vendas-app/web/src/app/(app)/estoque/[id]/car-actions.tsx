'use client';

import { useState } from 'react';
import { markSold, deleteCar } from '../novo/actions';

export function CarActions({ carId }: { carId: string }) {
  const [confirmSold, setConfirmSold]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, setPending]             = useState<'sold' | 'delete' | null>(null);

  async function handleSold() {
    if (!confirmSold) { setConfirmSold(true); setConfirmDelete(false); return; }
    setPending('sold');
    await markSold(carId);
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); setConfirmSold(false); return; }
    setPending('delete');
    await deleteCar(carId);
  }

  return (
    <div className="mt-3 space-y-2">

      {/* Marcar como vendido */}
      {confirmSold ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3">
          <p className="text-sm font-semibold text-emerald-900 mb-2">
            Confirmar venda desse carro?
          </p>
          <div className="flex gap-2">
            <button onClick={handleSold} disabled={pending === 'sold'}
              className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-2">
              {pending === 'sold' ? 'Registrando…' : 'Sim, marcar como vendido'}
            </button>
            <button onClick={() => setConfirmSold(false)}
              className="px-4 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleSold} disabled={!!pending}
          className="w-full rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-emerald-800 text-sm font-semibold py-2.5">
          Marcar como vendido
        </button>
      )}

      {/* Remover carro */}
      {confirmDelete ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-900 mb-1">Remover esse carro?</p>
          <p className="text-xs text-rose-700 mb-2">Essa ação não pode ser desfeita.</p>
          <div className="flex gap-2">
            <button onClick={handleDelete} disabled={pending === 'delete'}
              className="flex-1 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold py-2">
              {pending === 'delete' ? 'Removendo…' : 'Sim, remover'}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="px-4 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleDelete} disabled={!!pending}
          className="w-full rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-700 text-sm font-semibold py-2.5">
          Remover carro
        </button>
      )}

    </div>
  );
}
