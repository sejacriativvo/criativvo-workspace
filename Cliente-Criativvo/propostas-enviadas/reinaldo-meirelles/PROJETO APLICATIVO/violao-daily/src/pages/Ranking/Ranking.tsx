import { useMemo } from 'react'
import { Crown, Timer, Trophy } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import RankingList from '../../components/RankingList/RankingList'
import { ranking, leagues } from '../../data/ranking'
import { useApp } from '../../context/AppContext'

function xpToNext(currentIndex: number, sorted: typeof ranking): number {
  if (currentIndex <= 0) return 0
  const better = sorted[currentIndex - 1]
  const me = sorted[currentIndex]
  return Math.max(1, better.weeklyXP - me.weeklyXP + 1)
}

export default function Ranking() {
  const { user } = useApp()

  const sorted = useMemo(() => [...ranking].sort((a, b) => b.weeklyXP - a.weeklyXP), [])
  const myIndex = sorted.findIndex((u) => u.isCurrent)
  const myPosition = myIndex + 1
  const xpFalta = xpToNext(myIndex, sorted)
  const currentLeague = leagues.find((l) => l.key === user.league)
  const nextLeague = leagues[leagues.findIndex((l) => l.key === user.league) + 1]

  return (
    <div className="bg-white">
      <TopStatsBar />

      <div className="px-4 pt-3">
        <h1 className="font-display text-3xl font-bold text-ink-900">Ranking</h1>
        <p className="text-sm font-semibold text-ink-500">Liga semanal — termina domingo</p>

        {/* Card da liga atual com cor sólida */}
        <section
          className="relative mt-4 overflow-hidden rounded-3xl p-5 text-white"
          style={{
            background: currentLeague?.color ?? '#B45309',
            boxShadow: `0 5px 0 0 ${darken(currentLeague?.color ?? '#B45309')}`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15"
          />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">Liga atual</p>
              <h2 className="font-display text-3xl font-bold">{currentLeague?.label}</h2>
              <p className="text-sm font-semibold opacity-90">{currentLeague?.description}</p>
            </div>
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur"
              style={{ boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}
            >
              <Trophy className="h-6 w-6" strokeWidth={2.4} />
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/15 p-2 text-center">
            <Stat label="Você" value={`${myPosition}º`} />
            <Stat label="XP semana" value={String(sorted[myIndex]?.weeklyXP ?? 0)} />
            <Stat label="Termina" value="2d" icon={<Timer className="h-3 w-3" />} />
          </div>

          {nextLeague && (
            <div className="relative mt-3 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-bold">
              <Crown className="h-4 w-4 text-sun-400" fill="#FFC800" strokeWidth={1.5} />
              Mais {xpFalta} XP para subir
            </div>
          )}
        </section>

        {/* Pódio top 3 */}
        <section className="mt-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-500">Top 3</p>
          <div className="grid grid-cols-3 items-end gap-3">
            <Podium user={sorted[1]} place={2} />
            <Podium user={sorted[0]} place={1} />
            <Podium user={sorted[2]} place={3} />
          </div>
        </section>

        {/* Lista do ranking */}
        <section className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            Classificação
          </p>
          <RankingList users={sorted} />
        </section>

        {/* Ligas */}
        <section className="mt-6 pb-2">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            Suba de liga
          </p>
          <div className="grid grid-cols-5 gap-2">
            {leagues.map((l) => {
              const reached =
                leagues.findIndex((x) => x.key === user.league) >= leagues.findIndex((x) => x.key === l.key)
              return (
                <div
                  key={l.key}
                  className="flex flex-col items-center gap-1 text-center text-[10px]"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${
                      reached ? '' : 'opacity-40 grayscale'
                    }`}
                    style={{
                      background: l.color,
                      boxShadow: `0 3px 0 0 ${darken(l.color)}`,
                    }}
                  >
                    <Trophy className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                  <p className={`font-display font-bold ${reached ? 'text-ink-900' : 'text-ink-400'}`}>
                    {l.label}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="px-2 py-2">
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">{label}</p>
      <p className="mt-0.5 inline-flex items-center gap-1 font-display text-base font-bold">
        {icon}
        {value}
      </p>
    </div>
  )
}

function Podium({
  user,
  place,
}: {
  user?: { name: string; avatar: string; weeklyXP: number; isCurrent?: boolean }
  place: number
}) {
  if (!user) return <div />
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' } as const
  const colors = { 1: '#FFC800', 2: '#AFAFAF', 3: '#FF9600' } as const
  const shadows = { 1: '#DC9F00', 2: '#777777', 3: '#C97700' } as const
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="grid h-12 w-12 place-items-center rounded-2xl bg-grape-500 font-display text-base font-bold text-white"
        style={{ boxShadow: '0 3px 0 0 #8444C2' }}
      >
        {user.avatar}
      </div>
      <p className="font-display text-xs font-bold text-ink-900">{user.name.split(' ')[0]}</p>
      <p className="text-[10px] font-bold text-ink-500">{user.weeklyXP} XP</p>
      <div
        className={`flex w-full ${heights[place as 1 | 2 | 3]} items-end justify-center rounded-t-3xl font-display text-2xl font-bold text-white`}
        style={{
          background: colors[place as 1 | 2 | 3],
          boxShadow: `0 4px 0 0 ${shadows[place as 1 | 2 | 3]}`,
        }}
      >
        <span className="pb-2">{place}</span>
      </div>
    </div>
  )
}

function darken(hex: string): string {
  // escurece levemente o hex pra usar como sombra inferior 3D
  const c = hex.replace('#', '')
  if (c.length !== 6) return hex
  const num = parseInt(c, 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - 32)
  const g = Math.max(0, ((num >> 8) & 0xff) - 32)
  const b = Math.max(0, (num & 0xff) - 32)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
