'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MESSAGES: Record<string, { text: string; icon: string; color: string }> = {
  created: { text: 'Carro cadastrado com sucesso!',  icon: '✓', color: 'bg-emerald-600' },
  updated: { text: 'Alterações salvas com sucesso!', icon: '✓', color: 'bg-emerald-600' },
  sold:    { text: 'Carro marcado como vendido.',    icon: '✓', color: 'bg-emerald-600' },
  deleted: { text: 'Carro removido do estoque.',     icon: '✓', color: 'bg-neutral-700' },
  margin:  { text: 'Custo salvo com sucesso!',       icon: '✓', color: 'bg-emerald-600' },
};

export function SuccessToast({ ok }: { ok: string | null }) {
  const router   = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ok) return;
    timer.current = setTimeout(() => {
      router.replace(pathname);
    }, 4000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [ok, pathname, router]);

  if (!ok) return null;
  const m = MESSAGES[ok];
  if (!m) return null;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
      ${m.color} text-white rounded-2xl px-5 py-3 shadow-xl text-sm font-semibold
      transition-all duration-300`}
      style={{ animation: 'toast-in 0.3s ease' }}>
      <span className="text-base">{m.icon}</span>
      {m.text}
      <style>{`@keyframes toast-in{from{opacity:0;transform:translate(-50%,-12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
}
