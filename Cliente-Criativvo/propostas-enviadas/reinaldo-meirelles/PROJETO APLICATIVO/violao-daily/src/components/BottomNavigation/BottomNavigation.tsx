import { NavLink } from 'react-router-dom'
import { Map, Music, Trophy, User, Zap } from 'lucide-react'

const items = [
  { to: '/home', label: 'Mapa', Icon: Map },
  { to: '/practice', label: 'Prática', Icon: Zap },
  { to: '/songs', label: 'Músicas', Icon: Music },
  { to: '/ranking', label: 'Ranking', Icon: Trophy },
  { to: '/profile', label: 'Perfil', Icon: User },
]

// Tab bar inferior estilo app gamificado: ícones grandes, label minúsculo,
// item ativo com fundo destacado e ícone preenchido.
export default function BottomNavigation() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t-2 border-ink-200 bg-white px-2 pt-2 pb-2">
      <div className="mx-auto flex items-center justify-between">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-500'
                      : 'bg-transparent text-ink-400'
                  }`}
                  style={isActive ? { boxShadow: '0 3px 0 0 #BFE9FB' } : undefined}
                >
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.6 : 2} fill={isActive ? 'currentColor' : 'none'} fillOpacity={isActive ? 0.15 : 0} />
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-sky-600' : 'text-ink-400'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
