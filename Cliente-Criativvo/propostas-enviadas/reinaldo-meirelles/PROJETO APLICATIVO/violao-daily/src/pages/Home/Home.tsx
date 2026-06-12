import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Sparkles } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import LearningMap from '../../components/LearningMap/LearningMap'
import MissionCard from '../../components/MissionCard/MissionCard'
import { useApp } from '../../context/AppContext'
import { useProgress } from '../../hooks/useProgress'
import { useStreak } from '../../hooks/useStreak'
import { dailyMissions } from '../../data/missions'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useApp()
  const { currentUnit } = useProgress()
  const { streak } = useStreak()

  return (
    <div className="flex flex-col bg-white">
      <TopStatsBar />

      {/* Streak badge horizontal */}
      <section className="px-4 pt-3">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-3xl border-2 border-sun-500/40 bg-sun-400/15 p-3"
        >
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-500"
            style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
          >
            <Flame className="h-6 w-6 text-white" fill="#FFFFFF" strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <p className="font-display text-base font-bold text-ink-900">{streak} dias seguidos!</p>
            <p className="text-xs font-bold text-ink-600">Conclua 1 lição hoje pra manter o fogo</p>
          </div>
        </motion.div>
      </section>

      {/* Próxima lição — card grande verde com botão */}
      {currentUnit?.currentLesson && (
        <section className="px-4 pt-3">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative overflow-hidden rounded-3xl bg-brand-500 p-5 text-white"
            style={{ boxShadow: '0 5px 0 0 #46A302' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15"
            />
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">Próxima lição</p>
            <p className="mt-1 font-display text-2xl font-bold leading-tight">
              {currentUnit.currentLesson.title}
            </p>
            <p className="mt-1 text-sm font-semibold opacity-90">
              {currentUnit.unit.title} • {user.dailyMinutes} min hoje
            </p>
            <button
              onClick={() => navigate(`/lesson/${currentUnit.currentLesson!.id}`)}
              className="relative mt-4 inline-flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 font-display text-base font-bold uppercase tracking-wider text-brand-600 transition-transform active:scale-[0.98]"
              style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.12)' }}
            >
              Continuar
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </motion.div>
        </section>
      )}

      {/* Missão diária */}
      <section className="px-4 pt-3">
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">
          Missão de hoje
        </p>
        {dailyMissions[0] && (
          <MissionCard mission={dailyMissions[0]} onClick={() => navigate('/practice')} />
        )}
      </section>

      {/* CTA premium */}
      <section className="px-4 pt-3">
        <button
          onClick={() => navigate('/premium')}
          className="flex w-full items-center justify-between rounded-3xl border-2 border-sun-500/40 bg-sun-400/15 p-3 text-left"
          style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-500 text-white"
              style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
            >
              <Sparkles className="h-5 w-5" fill="white" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink-900">Energia ilimitada</p>
              <p className="text-xs font-bold text-ink-600">Conheça o Premium</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-sun-600" strokeWidth={3} />
        </button>
      </section>

      {/* Mapa */}
      <section className="mt-4">
        <LearningMap />
      </section>
    </div>
  )
}
