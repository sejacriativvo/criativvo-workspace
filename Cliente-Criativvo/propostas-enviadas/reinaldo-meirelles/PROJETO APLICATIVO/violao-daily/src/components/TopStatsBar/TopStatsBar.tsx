import { Flame, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../Common/Logo'
import { useApp } from '../../context/AppContext'
import { formatXP } from '../../utils/progress'

// Topo gamificado: ícones grandes coloridos para streak / XP / energia
// + avatar circular para entrar no perfil.
export default function TopStatsBar() {
  const { user } = useApp()

  return (
    <header className="sticky top-0 z-20 bg-white/95 px-4 pt-3 pb-3 backdrop-blur-md border-b-2 border-ink-100">
      <div className="flex items-center justify-between gap-2">
        <Logo variant="compact" />

        <div className="flex items-center gap-1.5">
          <Stat
            icon={<Flame className="h-4 w-4 text-sun-600" fill="#FF9600" strokeWidth={1.5} />}
            label={user.streak.toString()}
            color="text-sun-600"
          />
          <Stat
            icon={<Star className="h-4 w-4 text-sun-500" fill="#FFC800" strokeWidth={1.5} />}
            label={formatXP(user.xp)}
            color="text-sun-600"
          />
          <Stat
            icon={<Heart className="h-4 w-4 text-rose-500" fill="#FF4B4B" strokeWidth={1.5} />}
            label={user.isPremium ? '∞' : user.energy.toString()}
            color="text-rose-500"
          />

          <Link
            to="/profile"
            className="ml-1 grid h-10 w-10 place-items-center rounded-2xl bg-grape-500 font-display text-sm font-bold text-white"
            style={{ boxShadow: '0 3px 0 0 #8444C2' }}
          >
            {user.avatar}
          </Link>
        </div>
      </div>
    </header>
  )
}

function Stat({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1 px-1.5">
      {icon}
      <span className={`font-display text-base font-bold ${color}`}>{label}</span>
    </div>
  )
}
