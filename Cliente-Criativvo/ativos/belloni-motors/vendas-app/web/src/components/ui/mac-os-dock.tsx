'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import type { Role } from '@/lib/types';
import { NAV_ITEMS, NavIcon } from '@/app/(app)/nav-shared';

// Dock flutuante de navegação (celular). O destaque escuro DESLIZA entre os
// ícones quando você troca de aba (layoutId), o ícone ativo dá uma leve subida e
// o toque tem retorno (whileTap). Enxuto: só os ícones, sem botão extra.
export function MacOsDock({ role, pendingCount = 0 }: { role: Role; pendingCount?: number }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.roles.includes(role));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]">
      <motion.nav
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Navegação"
        className="pointer-events-auto flex items-center gap-0.5 rounded-2xl border border-neutral-200 bg-white/85 px-1.5 py-1.5 shadow-lg backdrop-blur-lg"
      >
        {items.map((i) => {
          const active = pathname === i.href || pathname.startsWith(i.href + '/');
          const badge = i.badge === 'pending' && pendingCount > 0 ? pendingCount : 0;
          return (
            <Link key={i.href} href={i.href} prefetch aria-label={i.label} className="relative">
              <motion.span
                whileTap={{ y: -6, scale: 1.14 }}
                animate={{ y: active ? -4 : 0, scale: active ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`relative grid h-10 w-10 origin-bottom place-items-center rounded-xl transition-colors ${
                  active ? 'text-white' : 'text-neutral-500'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-neutral-900 shadow-md"
                  />
                )}
                <NavIcon name={i.icon} className="h-5 w-5" />
                {badge > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </motion.span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
