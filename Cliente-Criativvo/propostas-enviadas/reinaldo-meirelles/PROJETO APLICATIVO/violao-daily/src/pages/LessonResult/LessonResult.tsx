import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, Flame, Star, Target, Trophy } from 'lucide-react'
import Button from '../../components/Common/Button'
import { useApp } from '../../context/AppContext'
import { useProgress } from '../../hooks/useProgress'
import { findLesson } from '../../data/lessons'

// Tela de resultado: fundo verde celebratório, card branco grande com XP / streak / unidade,
// conquista (se desbloqueada) e barra inferior verde com CONTINUAR.
export default function LessonResult() {
  const navigate = useNavigate()
  const { lessonId } = useParams<{ lessonId: string }>()
  const { lessons, user, achievements } = useApp()
  const { byUnit } = useProgress()

  const lesson = useMemo(() => (lessonId ? findLesson(lessonId) : undefined), [lessonId])
  const liveLesson = lessons.find((l) => l.id === lessonId)
  const unitProgress = byUnit.find((u) => u.unit.id === lesson?.unitId)
  const nextLesson = lessons.find((l) => l.status === 'current')
  const recentAchievement = achievements.find((a) => a.unlocked && a.unlockedAt === 'agora')

  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 250)
    return () => clearTimeout(t)
  }, [])

  if (!lesson) return null

  const xpGained = liveLesson?.xp ?? lesson.xp

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-brand-500">
      {/* Confetti decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: -30, opacity: 0, rotate: 0 }}
            animate={{ y: 800, opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ delay: i * 0.06, duration: 2.4, ease: 'easeOut' }}
            className="absolute block"
            style={{
              left: `${(i * 47) % 100}%`,
              width: i % 2 === 0 ? 8 : 6,
              height: i % 2 === 0 ? 8 : 14,
              background:
                i % 4 === 0 ? '#FFC800' : i % 4 === 1 ? '#1CB0F6' : i % 4 === 2 ? '#FF4B4B' : '#FFFFFF',
              borderRadius: i % 3 === 0 ? '50%' : '4px',
            }}
          />
        ))}
      </div>

      {/* Topo curto com mensagem grande */}
      <div className="relative z-10 px-6 pt-12 text-center text-white">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-white text-brand-500"
          style={{ boxShadow: '0 6px 0 0 rgba(0,0,0,0.15)' }}
        >
          <Trophy className="h-12 w-12" strokeWidth={2.4} />
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 font-display text-4xl font-bold leading-tight"
        >
          Boa, {user.name.split(' ')[0]}!
        </motion.h1>
        <p className="mt-2 text-base font-bold opacity-90">Lição concluída</p>
      </div>

      {/* Card branco com recompensas */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative z-10 mx-5 mt-8 rounded-[32px] bg-white p-6"
        style={{ boxShadow: '0 8px 0 0 rgba(0,0,0,0.1)' }}
      >
        <div className="grid grid-cols-3 gap-3">
          <Reward
            icon={<Star className="h-6 w-6 text-sun-500" fill="#FFC800" strokeWidth={1.5} />}
            label="XP"
            value={`+${xpGained}`}
            tone="amber"
          />
          <Reward
            icon={<Flame className="h-6 w-6 text-sun-600" fill="#FF9600" strokeWidth={1.5} />}
            label="Sequência"
            value={`${user.streak}d`}
            tone="orange"
          />
          <Reward
            icon={<Target className="h-6 w-6 text-sky-500" strokeWidth={2.4} />}
            label="Unidade"
            value={unitProgress ? `${unitProgress.completed}/${unitProgress.total}` : '—'}
            tone="blue"
          />
        </div>

        {revealed && recentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 flex items-center gap-3 rounded-3xl border-2 border-sun-500/40 bg-sun-400/15 p-4"
          >
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun-500 text-white"
              style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
            >
              <Award className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sun-600">
                Nova conquista
              </p>
              <p className="truncate font-display text-base font-bold text-ink-900">
                {recentAchievement.title}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="flex-1" />

      {/* Barra inferior verde clara estilo "Perfeito" + botão CONTINUAR */}
      <div className="relative z-10 border-t-4 border-brand-700 bg-brand-50 px-4 py-4">
        <p className="mb-3 text-center font-display text-2xl font-bold text-brand-700">Excelente!</p>
        <div className="flex flex-col gap-2">
          {nextLesson && (
            <Button fullWidth onClick={() => navigate(`/lesson/${nextLesson.id}`)}>
              Continuar
            </Button>
          )}
          <button
            onClick={() => navigate('/home')}
            className="text-xs font-bold uppercase tracking-wider text-brand-700"
          >
            Voltar ao mapa
          </button>
        </div>
      </div>
    </div>
  )
}

function Reward({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'amber' | 'orange' | 'blue'
}) {
  const toneCls =
    tone === 'amber'
      ? 'border-sun-500/40 bg-sun-400/10'
      : tone === 'orange'
        ? 'border-sun-600/40 bg-sun-600/10'
        : 'border-sky-200 bg-sky-50'
  return (
    <div className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center ${toneCls}`}>
      <span className="grid h-10 w-10 place-items-center">{icon}</span>
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
      <p className="font-display text-lg font-bold text-ink-900">{value}</p>
    </div>
  )
}
