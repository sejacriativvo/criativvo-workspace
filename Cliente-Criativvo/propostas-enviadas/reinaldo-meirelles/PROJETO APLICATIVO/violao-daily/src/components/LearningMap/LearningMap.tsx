import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Zap } from 'lucide-react'
import LessonNode from '../LessonNode/LessonNode'
import UnitHeader from './UnitHeader'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import { useApp } from '../../context/AppContext'
import { useProgress } from '../../hooks/useProgress'
import type { Lesson } from '../../types'

// Coração do produto: trilha vertical com unidades temáticas e nodes interativos.
export default function LearningMap() {
  const navigate = useNavigate()
  const { byUnit } = useProgress()
  const { consumeEnergy, user } = useApp()
  const [lockedAlert, setLockedAlert] = useState<Lesson | null>(null)
  const [outOfEnergy, setOutOfEnergy] = useState(false)

  const handleSelect = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      setLockedAlert(lesson)
      return
    }
    if (!user.isPremium && user.energy <= 0) {
      setOutOfEnergy(true)
      return
    }
    navigate(`/lesson/${lesson.id}`)
  }

  return (
    <div className="relative px-2 pb-10">
      <div className="relative z-10 flex flex-col gap-2">
        {byUnit.map((entry, unitIdx) => (
          <motion.section
            key={entry.unit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.05, duration: 0.35 }}
            className="relative flex flex-col"
          >
            <UnitHeader
              unit={entry.unit}
              completed={entry.completed}
              total={entry.total}
              progress={entry.progress}
            />

            {/* Trilha pontilhada vertical atrás dos nodes */}
            <div className="relative flex flex-col items-stretch gap-3 py-6">
              <div
                aria-hidden
                className="dotted-trail pointer-events-none absolute inset-y-4 left-1/2 w-1 -translate-x-1/2 rounded-full opacity-70"
              />
              <div className="relative z-10 flex flex-col gap-4">
                {entry.lessons.map((lesson, idx) => (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    unit={entry.unit}
                    index={idx}
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <Modal open={!!lockedAlert} onClose={() => setLockedAlert(null)} title="Fase bloqueada">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-ink-100 text-ink-400" style={{ boxShadow: '0 4px 0 0 #D1D1D1' }}>
            <Lock className="h-9 w-9" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-ink-700">
            Complete a etapa anterior para desbloquear esta lição.
          </p>
          <Button fullWidth onClick={() => setLockedAlert(null)}>
            Entendi
          </Button>
        </div>
      </Modal>

      <Modal open={outOfEnergy} onClose={() => setOutOfEnergy(false)} title="Sua energia acabou">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-sun-400/30 text-sun-600" style={{ boxShadow: '0 4px 0 0 #DC9F00' }}>
            <Zap className="h-9 w-9" fill="#FFC800" strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-ink-700">
            A energia volta ao longo do dia. Quer prática ilimitada? Conheça o Premium.
          </p>
          <Button
            variant="amber"
            fullWidth
            onClick={() => {
              setOutOfEnergy(false)
              navigate('/premium')
            }}
          >
            Ver Premium
          </Button>
          <button
            onClick={() => setOutOfEnergy(false)}
            className="text-xs font-bold uppercase tracking-wider text-ink-500"
          >
            Volto depois
          </button>
        </div>
      </Modal>
    </div>
  )
}
