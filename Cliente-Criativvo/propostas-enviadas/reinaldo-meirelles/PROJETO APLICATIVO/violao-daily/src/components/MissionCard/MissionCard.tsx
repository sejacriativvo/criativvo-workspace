import { ChevronRight, Star } from 'lucide-react'
import Icon from '../Common/Icon'
import type { Mission } from '../../types'

interface MissionCardProps {
  mission: Mission
  onClick?: () => void
}

// Card de missão com barra de progresso bem visível e chip XP em cores quentes.
export default function MissionCard({ mission, onClick }: MissionCardProps) {
  const progress = Math.min(100, Math.round((mission.current / mission.target) * 100))
  const completed = mission.current >= mission.target

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-3xl border-2 border-ink-200 bg-white p-3 text-left transition-transform active:scale-[0.99]"
      style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${
          completed ? 'bg-brand-500' : 'bg-sky-500'
        }`}
        style={{ boxShadow: completed ? '0 3px 0 0 #46A302' : '0 3px 0 0 #0E84BC' }}
      >
        <Icon name={mission.iconKey} className="h-6 w-6" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-display text-base font-bold text-ink-900">{mission.title}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-sun-400/30 px-2 py-0.5 text-xs font-bold text-ink-900">
            <Star className="h-3 w-3" fill="#FFC800" strokeWidth={1} />
            {mission.reward}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-ink-200">
            <div
              className="relative h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            >
              {progress > 8 && (
                <span className="absolute inset-x-1 top-0.5 h-0.5 rounded-full bg-white/40" aria-hidden />
              )}
            </div>
          </div>
          <span className="font-display text-xs font-bold text-ink-700">
            {mission.current}/{mission.target}
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-ink-400" />
    </button>
  )
}
