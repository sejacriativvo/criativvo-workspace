import { Lock } from 'lucide-react'
import Icon from '../Common/Icon'
import type { Achievement } from '../../types'

interface AchievementBadgeProps {
  achievement: Achievement
}

const rarityStyle = {
  comum: {
    bg: 'bg-ink-100 text-ink-600',
    shadow: '0 3px 0 0 #D1D1D1',
    label: 'Comum',
    pillBg: 'bg-ink-100 text-ink-600',
  },
  rara: {
    bg: 'bg-brand-500 text-white',
    shadow: '0 3px 0 0 #46A302',
    label: 'Rara',
    pillBg: 'bg-brand-50 text-brand-700',
  },
  epica: {
    bg: 'bg-grape-500 text-white',
    shadow: '0 3px 0 0 #8444C2',
    label: 'Épica',
    pillBg: 'bg-grape-400/20 text-grape-600',
  },
  lendaria: {
    bg: 'bg-sun-500 text-white',
    shadow: '0 3px 0 0 #DC9F00',
    label: 'Lendária',
    pillBg: 'bg-sun-400/30 text-ink-900',
  },
} as const

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const r = rarityStyle[achievement.rarity]
  const locked = !achievement.unlocked

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span
        className={`grid h-16 w-16 place-items-center rounded-3xl transition-transform hover:-translate-y-0.5 ${
          locked ? 'bg-ink-200 text-ink-400' : r.bg
        }`}
        style={{ boxShadow: locked ? '0 3px 0 0 #C4C4C4' : r.shadow }}
      >
        {locked ? (
          <Lock className="h-6 w-6" strokeWidth={2.4} />
        ) : (
          <Icon name={achievement.iconKey} className="h-7 w-7" strokeWidth={2.4} />
        )}
      </span>
      <p
        className={`font-display text-[12px] font-bold leading-tight ${
          locked ? 'text-ink-400' : 'text-ink-900'
        }`}
      >
        {achievement.title}
      </p>
      {!locked && (
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${r.pillBg}`}>
          {r.label}
        </span>
      )}
    </div>
  )
}
