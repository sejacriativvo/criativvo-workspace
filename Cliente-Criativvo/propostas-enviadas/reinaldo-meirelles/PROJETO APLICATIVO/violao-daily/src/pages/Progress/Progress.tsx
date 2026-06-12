import { Calendar, Clock, Flame, Music, Sparkles, Star, Target, Trophy } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import ProgressCard from '../../components/ProgressCard/ProgressCard'
import { useApp } from '../../context/AppContext'
import { useProgress } from '../../hooks/useProgress'
import { useXP } from '../../hooks/useXP'

const weekly = [
  { label: 'Seg', value: 35 },
  { label: 'Ter', value: 60 },
  { label: 'Qua', value: 80 },
  { label: 'Qui', value: 50 },
  { label: 'Sex', value: 90 },
  { label: 'Sáb', value: 70 },
  { label: 'Dom', value: 45 },
]

const masteredChords = ['Em', 'G', 'C', 'D']
const learningChords = ['Am', 'E']
const lockedChords = ['F', 'B7']

const masteredRhythms = ['Pop básico', 'Sertanejo']
const learningRhythms = ['Ritmo com pausa']

export default function Progress() {
  const { user } = useApp()
  const { totalCompleted, byUnit, overallProgress } = useProgress()
  const { level, progressToNext, xpUntilNext } = useXP()

  return (
    <div className="bg-white">
      <TopStatsBar />

      <div className="px-4 pt-3">
        <h1 className="font-display text-3xl font-bold text-ink-900">Progresso</h1>
        <p className="text-sm font-semibold text-ink-500">Sua evolução em números</p>

        {/* Card nível atual — destaque colorido */}
        <section
          className="relative mt-4 overflow-hidden rounded-3xl bg-grape-500 p-5 text-white"
          style={{ boxShadow: '0 5px 0 0 #8444C2' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15"
          />
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">Nível {level}</p>
              <p className="font-display text-4xl font-bold">{user.xp} XP</p>
              <p className="mt-1 text-sm font-semibold opacity-90">
                +{xpUntilNext} XP para o próximo nível
              </p>
            </div>
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur"
              style={{ boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}
            >
              <Star className="h-7 w-7 text-white" fill="white" />
            </div>
          </div>
          <div className="relative mt-4 h-3 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </section>

        {/* Stats grid */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <ProgressCard
            title="Sequência"
            value={`${user.streak}d`}
            caption={`Maior: ${user.longestStreak}d`}
            icon={<Flame className="h-6 w-6 text-sun-600" fill="#FF9600" strokeWidth={1.5} />}
            tone="amber"
          />
          <ProgressCard
            title="Lições"
            value={String(totalCompleted)}
            caption={`Mapa: ${overallProgress}%`}
            icon={<Target className="h-6 w-6 text-brand-600" strokeWidth={2.4} />}
            tone="brand"
          />
          <ProgressCard
            title="Tempo"
            value="4h 20m"
            caption="Este mês"
            icon={<Clock className="h-6 w-6 text-sky-600" strokeWidth={2.4} />}
            tone="blue"
          />
          <ProgressCard
            title="Músicas"
            value="3"
            caption="Aprendidas"
            icon={<Music className="h-6 w-6 text-rose-500" strokeWidth={2.4} />}
            tone="rose"
          />
        </section>

        {/* Resumo semanal — gráfico de barras gamificado */}
        <section className="mt-6">
          <SectionTitle
            icon={<Calendar className="h-4 w-4 text-sky-600" />}
            title="Esta semana"
            subtitle="Minutos por dia"
          />
          <div
            className="mt-3 rounded-3xl border-2 border-ink-200 bg-white p-4"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            <div className="flex h-36 items-end justify-between gap-2">
              {weekly.map((d, i) => {
                const isToday = i === 4
                return (
                  <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={`relative w-full rounded-t-xl transition-all ${
                        isToday ? 'bg-brand-500' : 'bg-sky-500'
                      }`}
                      style={{
                        height: `${d.value}%`,
                        boxShadow: isToday ? '0 3px 0 0 #46A302' : '0 3px 0 0 #0E84BC',
                      }}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        isToday ? 'text-brand-700' : 'text-ink-500'
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Acordes */}
        <section className="mt-6">
          <SectionTitle
            icon={<Trophy className="h-4 w-4 text-sun-500" />}
            title="Acordes"
            subtitle="Seu vocabulário no violão"
          />
          <div
            className="mt-3 space-y-3 rounded-3xl border-2 border-ink-200 bg-white p-4"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            <ChordRow title="Dominados" tone="bg-brand-500" chordTone="brand" chords={masteredChords} />
            <ChordRow title="Aprendendo" tone="bg-sun-500" chordTone="amber" chords={learningChords} />
            <ChordRow title="Próximos" tone="bg-ink-300" chordTone="ink" chords={lockedChords} />
          </div>
        </section>

        {/* Ritmos */}
        <section className="mt-6">
          <SectionTitle
            icon={<Sparkles className="h-4 w-4 text-brand-600" />}
            title="Ritmos"
            subtitle="Sua biblioteca rítmica"
          />
          <div
            className="mt-3 space-y-3 rounded-3xl border-2 border-ink-200 bg-white p-4"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            <ChordRow title="Aprendidos" tone="bg-brand-500" chordTone="brand" chords={masteredRhythms} />
            <ChordRow title="Em treino" tone="bg-sun-500" chordTone="amber" chords={learningRhythms} />
          </div>
        </section>

        {/* Unidades */}
        <section className="mt-6 pb-2">
          <SectionTitle
            icon={<Target className="h-4 w-4 text-brand-600" />}
            title="Unidades"
            subtitle="Sua trilha completa"
          />
          <div className="mt-3 flex flex-col gap-2">
            {byUnit.map((u) => (
              <div
                key={u.unit.id}
                className="flex items-center gap-3 rounded-3xl border-2 border-ink-200 bg-white p-3"
                style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${u.unit.accentFrom}, ${u.unit.accentTo})`,
                    boxShadow: `0 3px 0 0 ${u.unit.accentTo}`,
                  }}
                >
                  {u.unit.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-ink-900">{u.unit.title}</p>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-ink-200">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-ink-700">
                  {u.completed}/{u.total}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-500">
        {icon}
        {title}
      </p>
      <h2 className="font-display text-base font-bold text-ink-900">{subtitle}</h2>
    </div>
  )
}

function ChordRow({
  title,
  chords,
  tone,
  chordTone,
}: {
  title: string
  chords: string[]
  tone: string
  chordTone: 'brand' | 'amber' | 'ink'
}) {
  const chipMap = {
    brand: 'bg-brand-50 text-brand-700 border-2 border-brand-200',
    amber: 'bg-sun-400/30 text-ink-900 border-2 border-sun-500/40',
    ink: 'bg-ink-100 text-ink-500 border-2 border-ink-200',
  }
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {chords.map((c) => (
          <span key={c} className={`rounded-2xl px-3 py-1.5 font-display text-sm font-bold ${chipMap[chordTone]}`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
