import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart, Play, Square, X } from 'lucide-react'
import Button from '../../components/Common/Button'
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram'
import Metronome from '../../components/Metronome/Metronome'
import { useApp } from '../../context/AppContext'
import { findLesson } from '../../data/lessons'
import type { LessonBlock } from '../../types'

type Feedback = 'idle' | 'correct' | 'wrong'

// Tela de lição estilo app gamificado:
// - Header simples com X, barra grossa de progresso, coração de energia
// - Conteúdo centralizado, fonte grande, pouco texto
// - Footer fixo com botão CONTINUAR ou barra colorida de acerto/erro
export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { completeLesson, consumeEnergy, user } = useApp()
  const lesson = useMemo(() => (lessonId ? findLesson(lessonId) : undefined), [lessonId])

  const [blockIndex, setBlockIndex] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>('idle')

  useEffect(() => {
    if (lesson && !user.isPremium) consumeEnergy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id])

  if (!lesson) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-xl font-bold">Lição não encontrada</p>
        <Button className="mt-4" onClick={() => navigate('/home')}>
          Voltar ao mapa
        </Button>
      </div>
    )
  }

  const totalBlocks = lesson.blocks.length
  const progress = Math.round(((blockIndex + 1) / totalBlocks) * 100)
  const block = lesson.blocks[blockIndex]
  const isLast = blockIndex === totalBlocks - 1

  const finish = () => {
    completeLesson(lesson.id)
    navigate(`/lesson-result/${lesson.id}`)
  }

  const advance = () => {
    setFeedback('idle')
    if (isLast) {
      finish()
      return
    }
    setBlockIndex((i) => i + 1)
  }

  const retry = () => setFeedback('idle')

  return (
    <div className="relative flex h-full flex-col bg-ink-100">
      {/* Header — X + barra + coração */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-ink-100 bg-white px-4 pb-3 pt-4">
        <button
          onClick={() => navigate('/home')}
          className="grid h-10 w-10 place-items-center rounded-2xl text-ink-400 hover:bg-ink-100"
          aria-label="Sair"
        >
          <X className="h-6 w-6" strokeWidth={2.6} />
        </button>
        <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-ink-200">
          <div
            className="relative h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          >
            {progress > 8 && (
              <span className="absolute inset-x-2 top-0.5 h-1 rounded-full bg-white/40" aria-hidden />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-5 w-5 text-rose-500" fill="#FF4B4B" strokeWidth={1.5} />
          <span className="font-display text-base font-bold text-rose-500">
            {user.isPremium ? '∞' : user.energy}
          </span>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-5 pb-44 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={blockIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <BlockRenderer block={block} onAnswer={(ok) => setFeedback(ok ? 'correct' : 'wrong')} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — barra colorida de feedback ou botão CONTINUAR */}
      <FeedbackFooter
        feedback={feedback}
        isLast={isLast}
        onContinue={advance}
        onRetry={retry}
        onSkip={advance}
      />
    </div>
  )
}

interface FeedbackFooterProps {
  feedback: Feedback
  isLast: boolean
  onContinue: () => void
  onRetry: () => void
  onSkip: () => void
}

function FeedbackFooter({ feedback, isLast, onContinue, onRetry, onSkip }: FeedbackFooterProps) {
  if (feedback === 'idle') {
    return (
      <div className="absolute bottom-0 left-0 right-0 border-t-2 border-ink-100 bg-white p-4">
        <Button fullWidth onClick={onSkip}>
          {isLast ? 'Concluir' : 'Continuar'}
        </Button>
      </div>
    )
  }

  const isCorrect = feedback === 'correct'

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`absolute bottom-0 left-0 right-0 border-t-4 ${
        isCorrect ? 'border-brand-500 bg-brand-50' : 'border-rose-500 bg-rose-50'
      } px-4 pb-5 pt-4`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`grid h-12 w-12 place-items-center rounded-full ${
            isCorrect ? 'bg-brand-500 text-white' : 'bg-rose-500 text-white'
          }`}
        >
          {isCorrect ? <Check className="h-7 w-7" strokeWidth={3.5} /> : <X className="h-7 w-7" strokeWidth={3.5} />}
        </span>
        <div>
          <p className={`font-display text-2xl font-bold ${isCorrect ? 'text-brand-700' : 'text-rose-600'}`}>
            {isCorrect ? 'Boa!' : 'Quase lá!'}
          </p>
          <p className={`text-xs font-bold ${isCorrect ? 'text-brand-700' : 'text-rose-600'}`}>
            {isCorrect ? 'Você acertou' : 'Reposicione e tente de novo'}
          </p>
        </div>
      </div>
      {isCorrect ? (
        <Button fullWidth onClick={onContinue}>
          {isLast ? 'Concluir' : 'Continuar'}
        </Button>
      ) : (
        <Button variant="danger" fullWidth onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </motion.div>
  )
}

interface BlockRendererProps {
  block: LessonBlock
  onAnswer?: (isCorrect: boolean) => void
}

function BlockRenderer({ block, onAnswer }: BlockRendererProps) {
  switch (block.type) {
    case 'explanation':
      return (
        <div className="space-y-4 text-center">
          <h2 className="heading-display text-3xl">Vamos lá</h2>
          <p className="text-base font-semibold leading-relaxed text-ink-700">{block.text}</p>
        </div>
      )

    case 'chord':
      return (
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="heading-display text-3xl">Toque este acorde</h2>
          <ChordDiagram name={block.chord ?? 'C'} size="lg" />
          <p className="max-w-[280px] text-sm font-semibold text-ink-600">
            Posicione cada dedo conforme o número e toque corda por corda.
          </p>
        </div>
      )

    case 'video':
      return (
        <div className="space-y-4">
          <h2 className="heading-display text-center text-3xl">Veja a demonstração</h2>
          <div
            className="relative aspect-video overflow-hidden rounded-3xl bg-grape-500"
            style={{ boxShadow: '0 4px 0 0 #8444C2' }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <button
                className="grid h-20 w-20 place-items-center rounded-full bg-white text-grape-600"
                style={{ boxShadow: '0 4px 0 0 #E0B7FF' }}
              >
                <Play className="h-8 w-8" fill="currentColor" />
              </button>
            </div>
          </div>
          <p className="text-center text-sm font-semibold text-ink-600">
            {block.videoLabel ?? 'Assista quantas vezes precisar.'}
          </p>
        </div>
      )

    case 'practice':
      return <PracticeBlock block={block} onAnswer={onAnswer} />

    case 'quiz':
      return <QuizBlock block={block} onAnswer={onAnswer} />

    case 'timer':
      return <TimerBlock block={block} onAnswer={onAnswer} />

    case 'metronome':
      return (
        <div className="space-y-4 text-center">
          <h2 className="heading-display text-3xl">Cole no tempo</h2>
          <p className="text-sm font-semibold text-ink-600">
            Comece devagar e foque na firmeza do pulso.
          </p>
          <Metronome initialBpm={block.bpm ?? 80} />
        </div>
      )

    case 'checklist':
      return <Checklist items={block.items ?? []} />

    default:
      return null
  }
}

function PracticeBlock({ block, onAnswer }: { block: LessonBlock; onAnswer?: (ok: boolean) => void }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="heading-display text-3xl">{block.title ?? 'Mãos no violão'}</h2>
      <p className="text-base font-semibold text-ink-600">
        {block.text ?? 'Repita o gesto até ficar confortável.'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAnswer?.(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-ink-200 bg-white p-6 font-display text-base font-bold text-ink-700 transition-transform active:scale-95"
          style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Check className="h-6 w-6" strokeWidth={3} />
          </span>
          Consegui
        </button>
        <button
          onClick={() => onAnswer?.(false)}
          className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-ink-200 bg-white p-6 font-display text-base font-bold text-ink-700 transition-transform active:scale-95"
          style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <Square className="h-6 w-6" strokeWidth={2.4} />
          </span>
          Tentar de novo
        </button>
      </div>
    </div>
  )
}

function QuizBlock({ block, onAnswer }: { block: LessonBlock; onAnswer?: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const correct = block.correctIndex ?? 0

  const handlePick = (i: number) => {
    setPicked(i)
    onAnswer?.(i === correct)
  }

  return (
    <div className="space-y-6">
      <h2 className="heading-display text-center text-3xl">
        {block.title ?? 'Qual é a alternativa?'}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {block.options?.map((opt, i) => {
          const isPicked = picked === i
          const isCorrect = picked !== null && i === correct
          const isWrong = isPicked && i !== correct
          return (
            <button
              key={opt}
              onClick={() => handlePick(i)}
              className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border-[3px] p-4 text-center transition-all active:scale-95 ${
                isCorrect
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : isWrong
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : isPicked
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-ink-200 bg-white text-ink-700'
              }`}
              style={{
                boxShadow: isCorrect
                  ? '0 4px 0 0 #46A302'
                  : isWrong
                    ? '0 4px 0 0 #C53030'
                    : isPicked
                      ? '0 4px 0 0 #0E84BC'
                      : '0 4px 0 0 #E5E5E5',
              }}
            >
              <span className="font-display text-lg opacity-50">{i + 1}</span>
              <span className="font-display text-base font-bold">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TimerBlock({ block, onAnswer }: { block: LessonBlock; onAnswer?: (ok: boolean) => void }) {
  const total = block.durationSec ?? 30
  const [remaining, setRemaining] = useState(total)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id)
          setRunning(false)
          onAnswer?.(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, onAnswer])

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - remaining / total)

  return (
    <div className="space-y-6 text-center">
      <h2 className="heading-display text-3xl">{block.title ?? 'Treine por alguns segundos'}</h2>

      <div
        className="card-soft mx-auto inline-flex flex-col items-center gap-4 p-6"
        style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
      >
        <svg width={180} height={180} viewBox="0 0 180 180">
          <circle cx={90} cy={90} r={radius} stroke="#E5E5E5" strokeWidth={12} fill="none" />
          <circle
            cx={90}
            cy={90}
            r={radius}
            stroke="#58CC02"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 90 90)"
            fill="none"
            style={{ transition: 'stroke-dashoffset 0.6s linear' }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Fredoka"
            fontSize="46"
            fontWeight="700"
            fill="#3C3C3C"
          >
            {remaining}
          </text>
        </svg>
        <button onClick={() => setRunning((r) => !r)} className={running ? 'btn-3d btn-3d-red' : 'btn-3d btn-3d-green'}>
          {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pausar' : 'Iniciar'}
        </button>
      </div>
    </div>
  )
}

function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  return (
    <div className="space-y-4">
      <h2 className="heading-display text-center text-3xl">Antes de fechar</h2>
      <p className="text-center text-sm font-semibold text-ink-600">
        Marque o que você já completou nesta lição.
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => {
          const c = !!checked[i]
          return (
            <li key={i}>
              <button
                onClick={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
                className={`flex w-full items-center gap-3 rounded-3xl border-[3px] p-4 text-left transition-all ${
                  c ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-white'
                }`}
                style={{ boxShadow: c ? '0 4px 0 0 #46A302' : '0 4px 0 0 #E5E5E5' }}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full ${
                    c ? 'bg-brand-500 text-white' : 'border-2 border-ink-300'
                  }`}
                >
                  {c && <Check className="h-5 w-5" strokeWidth={3.5} />}
                </span>
                <span className={`text-base font-bold ${c ? 'text-brand-700' : 'text-ink-700'}`}>{item}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
