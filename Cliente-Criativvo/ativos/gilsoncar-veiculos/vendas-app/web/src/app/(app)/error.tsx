'use client';

import { useEffect } from 'react';

// Tela de erro do app. O caso mais comum é "version skew": o app ficou aberto,
// saiu um deploy novo, e uma ação antiga (ex: mover card) chama uma Server Action
// que mudou de ID -> dá erro de servidor. Recarregar pega o código novo e resolve.
// Por isso: auto-recarrega UMA vez por janela de 10s (some sozinho, sem loop).
export default function AppError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const KEY = 'gc-last-auto-reload';
    const last = Number(sessionStorage.getItem(KEY) || '0');
    if (Date.now() - last > 10_000) {
      sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    }
    // eslint-disable-next-line no-console
    console.error('AppError:', error?.message, error?.digest);
  }, [error]);

  function reloadNow() {
    sessionStorage.removeItem('gc-last-auto-reload');
    window.location.reload();
  }

  return (
    <div className="min-h-[60vh] grid place-items-center px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
          <svg viewBox="0 0 24 24" className="h-6 w-6 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-neutral-900">Recarregando…</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tivemos um soluço ao abrir a tela. Costuma acontecer logo depois de uma atualização do sistema e some ao recarregar.
        </p>
        <button
          onClick={reloadNow}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-4 py-2.5"
        >
          Recarregar agora
        </button>
      </div>
    </div>
  );
}
