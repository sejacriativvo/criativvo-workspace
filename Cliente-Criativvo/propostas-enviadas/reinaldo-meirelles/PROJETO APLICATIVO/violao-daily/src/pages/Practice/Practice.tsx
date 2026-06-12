import { useMemo, useState } from 'react'
import { Clock, Play, Star } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import Metronome from '../../components/Metronome/Metronome'
import Icon from '../../components/Common/Icon'
import { practiceCards } from '../../data/practice'
import type { PracticeCard } from '../../data/practice'

const tabs: { key: PracticeCard['category'] | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'recomendada', label: 'Recomendada' },
  { key: 'acordes', label: 'Acordes' },
  { key: 'ritmo', label: 'Ritmo' },
  { key: 'troca', label: 'Trocas' },
  { key: 'metronomo', label: 'Metrônomo' },
  { key: 'revisao', label: 'Revisão' },
]

const difficultyTone: Record<PracticeCard['difficulty'], string> = {
  fácil: 'bg-brand-50 text-brand-700 border border-brand-200',
  médio: 'bg-sun-400/30 text-ink-900 border border-sun-500/40',
  difícil: 'bg-rose-50 text-rose-500 border border-rose-100',
}

const cardThemes = [
  { bg: '#1CB0F6', shadow: '#0E84BC' },
  { bg: '#CE82FF', shadow: '#8444C2' },
  { bg: '#FFC800', shadow: '#DC9F00' },
  { bg: '#FF9600', shadow: '#C97700' },
  { bg: '#58CC02', shadow: '#46A302' },
  { bg: '#FF4B4B', shadow: '#C53030' },
]

export default function Practice() {
  const [active, setActive] = useState<typeof tabs[number]['key']>('todos')

  const filtered = useMemo(
    () => (active === 'todos' ? practiceCards : practiceCards.filter((p) => p.category === active)),
    [active],
  )

  return (
    <div className="bg-white">
      <TopStatsBar />

      <div className="px-4 pt-3">
        <h1 className="font-display text-3xl font-bold text-ink-900">Prática</h1>
        <p className="text-sm font-semibold text-ink-500">Treinos rápidos pra fortalecer seu jogo</p>

        {/* Filtros */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 no-scrollbar">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`whitespace-nowrap rounded-2xl border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  active === t.key
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-ink-200 bg-white text-ink-600'
                }`}
                style={
                  active === t.key
                    ? { boxShadow: '0 3px 0 0 #46A302' }
                    : { boxShadow: '0 3px 0 0 #E5E5E5' }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrônomo destaque */}
        <div className="mt-6">
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            Sua ferramenta
          </p>
          <Metronome initialBpm={84} />
        </div>

        {/* Cards de prática estilo "level select" */}
        <div className="mt-6">
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            {filtered.length} treinos pra você
          </p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((card, i) => {
              const theme = cardThemes[i % cardThemes.length]
              return (
                <button
                  key={card.id}
                  className="flex flex-col items-start gap-2 overflow-hidden rounded-3xl border-2 border-ink-200 bg-white p-3 text-left transition-transform active:scale-95"
                  style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
                >
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                    style={{ background: theme.bg, boxShadow: `0 3px 0 0 ${theme.shadow}` }}
                  >
                    <Icon name={card.iconKey} className="h-7 w-7" strokeWidth={2.4} />
                  </span>
                  <p className="font-display text-base font-bold leading-tight text-ink-900">
                    {card.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`pill ${difficultyTone[card.difficulty]}`}>{card.difficulty}</span>
                    <span className="pill bg-ink-100 text-ink-600 border border-ink-200">
                      <Clock className="h-3 w-3" /> {card.durationMin}m
                    </span>
                  </div>
                  <div className="mt-1 flex w-full items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sun-600">
                      <Star className="h-3 w-3" fill="#FFC800" strokeWidth={1.5} /> +{card.xp}
                    </span>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-500 text-white"
                      style={{ boxShadow: '0 3px 0 0 #46A302' }}
                    >
                      <Play className="h-4 w-4" fill="white" />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
