'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { syncMetaAction } from './sync-meta';
import { MetaLogo } from '@/components/ui/brand-logos';

const LOJA: Record<string, string> = { belloni: 'Belloni Motors' };

// Botão "Sincronizar Meta": puxa investimento + conversas da API da Meta na hora.
export function MetaSyncButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  function onClick() {
    setMsg(null);
    start(async () => {
      const r = await syncMetaAction();
      if (r.ok) {
        const parts = (r.stores ?? []).map((s) => `${LOJA[s.store] ?? s.store}: ${s.conversas} conversas`);
        setMsg(parts.length ? `Meta atualizada · ${parts.join(' · ')}` : 'Meta: nada novo neste mês.');
        router.refresh();
      } else {
        setMsg(r.error ?? 'Falha ao sincronizar a Meta.');
      }
      setTimeout(() => setMsg(null), 6000);
    });
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0064E0] hover:bg-[#0055bf] disabled:opacity-60 text-white text-sm font-semibold px-3 py-2 transition-colors"
      >
        <MetaLogo className={`h-4 w-4 ${pending ? 'animate-pulse' : ''}`} />
        {pending ? 'Sincronizando...' : 'Sincronizar Meta'}
      </button>
      {msg && (
        <div className="absolute right-0 mt-1 z-20 max-w-xs whitespace-normal rounded-lg bg-neutral-900 text-white text-xs px-3 py-2 shadow-lg">
          {msg}
        </div>
      )}
    </div>
  );
}
