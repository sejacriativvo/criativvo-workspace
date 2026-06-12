import type { Unit } from '../../types'
import Icon from '../Common/Icon'

interface UnitHeaderProps {
  unit: Unit
  progress: number
  completed: number
  total: number
}

// Faixa horizontal cheia que separa visualmente as unidades — estilo "checkpoint" de jogo.
export default function UnitHeader({ unit, progress, completed, total }: UnitHeaderProps) {
  return (
    <div
      className="relative mx-3 mt-6 mb-2 overflow-hidden rounded-3xl p-5 text-white"
      style={{
        background: `linear-gradient(135deg, ${unit.accentFrom} 0%, ${unit.accentTo} 100%)`,
        boxShadow: `0 6px 0 0 ${unit.accentTo}`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-6 h-24 w-24 rounded-full bg-white/10"
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">
            Unidade {unit.number}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight">{unit.title}</h2>
          <p className="mt-1 text-sm font-semibold opacity-90">{unit.subtitle}</p>
        </div>
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur"
          style={{ boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}
        >
          <Icon name={unit.iconKey} className="h-7 w-7 text-white" strokeWidth={2.6} />
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold opacity-90">
          <span>
            {completed}/{total} fases
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
