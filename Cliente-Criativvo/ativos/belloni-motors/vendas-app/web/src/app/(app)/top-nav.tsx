'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { logout } from '@/app/auth/actions';
import type { Role } from '@/lib/types';
import { NAV_ITEMS, NavIcon } from './nav-shared';
import { PrivacyToggle } from './privacy-toggle';
import { Avatar } from '@/components/ui/avatar';

// Barra de navegação flutuante no topo (desktop). No celular quem navega é o dock.
// Diferenciais: aba ativa com um destaque escuro que DESLIZA entre os itens
// (layoutId), leve subida no hover, e tudo numa barra de vidro só.
export function TopNav({
  role,
  pendingCount = 0,
  name,
  initials,
  roleLabel,
  avatarUrl,
}: {
  role: Role;
  pendingCount?: number;
  name: string;
  initials: string;
  roleLabel: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = NAV_ITEMS.filter((i) => i.roles.includes(role));
  const canAdd = role !== 'traffic';

  function onAdd() {
    if (pathname === '/clientes') window.dispatchEvent(new CustomEvent('gc:new-client'));
    else router.push('/clientes?new=1');
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-30 hidden justify-center px-4 lg:flex">
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex w-full max-w-7xl items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 px-3 py-2.5 shadow-lg backdrop-blur-lg"
      >
        {/* Marca: Belloni Motors */}
        <Link href="/estoque" className="flex shrink-0 items-center pl-1" aria-label="Belloni Motors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-belloni-dark.png" alt="Belloni Motors" className="h-9 w-auto object-contain" />
        </Link>

        {/* Navegação (centro) */}
        <nav className="flex flex-1 items-center justify-center gap-2">
          {items.map((i) => {
            const active = pathname === i.href || pathname.startsWith(i.href + '/');
            const badge = i.badge === 'pending' && pendingCount > 0 ? pendingCount : 0;
            return (
              <Link key={i.href} href={i.href} prefetch className="relative">
                <motion.span
                  animate={{ y: active ? -1 : 0 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  className={`relative flex origin-bottom items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="topnav-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-neutral-900"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <NavIcon name={i.icon} className="h-4 w-4 shrink-0" />
                  <span>{i.label}</span>
                  {badge > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Ações (direita) */}
        <div className="flex shrink-0 items-center gap-2">
          {canAdd && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden xl:inline">Cliente</span>
            </motion.button>
          )}
          <PrivacyToggle />
          <Avatar src={avatarUrl} initials={initials} name={name} roleLabel={roleLabel} />
          <form action={logout}>
            <button type="submit" title="Sair" className="px-1 text-sm text-neutral-400 transition hover:text-neutral-900">
              Sair
            </button>
          </form>
        </div>
      </motion.header>
    </div>
  );
}
