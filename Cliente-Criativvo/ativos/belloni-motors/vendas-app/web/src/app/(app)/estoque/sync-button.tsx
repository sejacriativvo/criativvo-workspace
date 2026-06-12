'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { syncShopifyAction } from './sync';
import { ShopifyLogo } from '@/components/ui/brand-logos';

export function SyncButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  function onClick() {
    setMsg(null);
    start(async () => {
      const r = await syncShopifyAction();
      if (r.ok) {
        const saiu = r.removed ? ` · ${r.removed} saiu(ram) (vendidos)` : '';
        setMsg(`Sincronizado: ${r.synced ?? 0} carro(s)${saiu}.`);
        router.refresh();
      } else {
        setMsg(r.error ?? 'Falha no sync.');
      }
      setTimeout(() => setMsg(null), 5000);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-[#5E8E3E] hover:bg-[#4f7834] disabled:opacity-60 text-white text-sm font-semibold px-3 py-2 transition-colors"
      >
        <ShopifyLogo className={`h-4 w-4 ${pending ? 'animate-pulse' : ''}`} />
        {pending ? 'Sincronizando...' : 'Sincronizar Shopify'}
      </button>
      {msg && (
        <div className="absolute right-0 mt-1 z-10 whitespace-nowrap rounded-lg bg-neutral-900 text-white text-xs px-3 py-2 shadow-lg">
          {msg}
        </div>
      )}
    </div>
  );
}
