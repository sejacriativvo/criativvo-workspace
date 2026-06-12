import type { Role } from '@/lib/types';

// Itens de navegação compartilhados entre o dock (mobile) e a sidebar (desktop).
export type IconKey = 'estoque' | 'clientes' | 'calendario' | 'metas' | 'painel' | 'relatorios' | 'financeiras';
export type NavItem = { href: string; label: string; icon: IconKey; roles: Role[]; badge?: 'pending' };

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Painel', icon: 'painel', roles: ['admin'] },
  { href: '/estoque', label: 'Estoque', icon: 'estoque', roles: ['admin', 'vendor'], badge: 'pending' },
  { href: '/clientes', label: 'Clientes', icon: 'clientes', roles: ['admin', 'vendor'] },
  { href: '/calendario', label: 'Agenda', icon: 'calendario', roles: ['admin', 'vendor'] },
  { href: '/metas', label: 'Metas', icon: 'metas', roles: ['admin', 'vendor'] },
  { href: '/financeiras', label: 'Financeiras', icon: 'financeiras', roles: ['admin', 'vendor'] },
  { href: '/relatorios', label: 'Relatórios', icon: 'relatorios', roles: ['admin', 'traffic'] },
];

export function NavIcon({ name, className }: { name: IconKey; className: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (name === 'estoque')
    return (
      <svg {...common}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
  if (name === 'clientes')
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (name === 'calendario')
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    );
  if (name === 'metas')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  if (name === 'relatorios')
    return (
      <svg {...common}>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M9 17v-3M12 17v-5M15 17v-2" />
      </svg>
    );
  if (name === 'financeiras')
    return (
      <svg {...common}>
        <path d="M3 22h18" />
        <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
        <path d="M12 2 21 7H3l9-5z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  );
}
