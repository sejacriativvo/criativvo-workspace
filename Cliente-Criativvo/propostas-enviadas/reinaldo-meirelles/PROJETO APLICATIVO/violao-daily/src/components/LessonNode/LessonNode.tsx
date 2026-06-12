import { Check, Lock, Play, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Lesson, Unit } from '../../types'
import Icon from '../Common/Icon'

interface LessonNodeProps {
  lesson: Lesson
  unit: Unit
  index: number
  onClick: (lesson: Lesson) => void
}

// Cada node é um botão circular grande estilo "fase de jogo".
// Curva alternada esquerda-direita para criar sensação de trilha.
export default function LessonNode({ lesson, unit, index, onClick }: LessonNodeProps) {
  const offset = nodeOffset(index)
  const status = lesson.status

  const accentBg = `linear-gradient(180deg, ${unit.accentFrom} 0%, ${unit.accentTo} 100%)`
  const shadowColor = unit.accentTo

  return (
    <div
      className="relative flex w-full justify-center py-2"
      style={{
        paddingLeft: offset > 0 ? `${offset}px` : 0,
        paddingRight: offset < 0 ? `${-offset}px` : 0,
      }}
    >
      <motion.button
        whileTap={{ scale: status === 'locked' ? 1 : 0.92 }}
        whileHover={{ scale: status === 'locked' ? 1 : 1.04 }}
        onClick={() => onClick(lesson)}
        className="group relative flex flex-col items-center"
      >
        <div className="relative">
          {/* Glow pulsante apenas na fase atual */}
          {status === 'current' && (
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
              style={{ background: accentBg }}
            />
          )}

          {/* Botão principal — círculo grande com sombra inferior 3D */}
          <span
            className={`relative grid h-[88px] w-[88px] place-items-center rounded-full transition-all ${
              status === 'locked'
                ? 'bg-ink-200'
                : status === 'available'
                  ? 'bg-white border-[3px] border-ink-200'
                  : ''
            }`}
            style={
              status !== 'locked' && status !== 'available'
                ? {
                    background: accentBg,
                    boxShadow: `0 6px 0 0 ${shadowColor}, 0 12px 24px -8px ${shadowColor}55`,
                  }
                : status === 'available'
                  ? { boxShadow: '0 4px 0 0 #E5E5E5' }
                  : { boxShadow: '0 4px 0 0 #C4C4C4' }
            }
          >
            <span className="grid h-full w-full place-items-center">
              {status === 'completed' && <Check className="h-9 w-9 text-white" strokeWidth={3.5} />}
              {status === 'locked' && <Lock className="h-7 w-7 text-ink-400" strokeWidth={2.6} />}
              {status === 'current' && <Star className="h-9 w-9 text-white" fill="white" strokeWidth={2} />}
              {status === 'available' && (
                <Icon name={lesson.iconKey ?? 'sparkle'} className="h-8 w-8 text-ink-500" strokeWidth={2.2} />
              )}
            </span>
          </span>

          {/* Bandeirinha "INICIAR" pra fase atual */}
          {status === 'current' && (
            <motion.span
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-700"
              style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
            >
              INICIAR
              <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-px h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-white" />
            </motion.span>
          )}

          {/* XP chip embaixo */}
          {status !== 'locked' && status !== 'current' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ink-700 border border-ink-200">
              +{lesson.xp} XP
            </span>
          )}
        </div>

        <div className="mt-4 max-w-[150px] text-center">
          <p
            className={`font-display text-[13px] font-semibold leading-tight ${
              status === 'locked' ? 'text-ink-400' : 'text-ink-700'
            }`}
          >
            {lesson.title}
          </p>
        </div>
      </motion.button>
    </div>
  )
}

// Distribui os nodes em formato de trilha alternando leve para esquerda e direita
function nodeOffset(index: number): number {
  const positions = [0, 70, 90, 50, -50, -90, -70, 0]
  return positions[index % positions.length]
}
