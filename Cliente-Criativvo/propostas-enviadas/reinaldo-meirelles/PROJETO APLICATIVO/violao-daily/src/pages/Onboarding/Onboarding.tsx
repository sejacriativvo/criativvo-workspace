import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Music } from 'lucide-react'
import Logo from '../../components/Common/Logo'
import { useApp } from '../../context/AppContext'
import type { User } from '../../types'

const levels: { key: string; value: User['level']; label: string; emoji: string; description: string }[] = [
  { key: 'zero', value: 'iniciante', emoji: '🌱', label: 'Nunca toquei', description: 'Começo do zero' },
  { key: 'scratch', value: 'iniciante', emoji: '🎸', label: 'Sei alguns acordes', description: 'Já arranhei algo' },
  { key: 'basic', value: 'basico', emoji: '🎵', label: 'Toco músicas simples', description: 'Quero melhorar fluência' },
  { key: 'inter', value: 'intermediario', emoji: '🔥', label: 'Quero ritmo e técnica', description: 'Foco em performance' },
]

const goals: { key: string; label: string; emoji: string }[] = [
  { key: 'primeira', label: 'Tocar minha primeira música', emoji: '🎶' },
  { key: 'igreja', label: 'Tocar na igreja', emoji: '⛪' },
  { key: 'sertanejo', label: 'Tocar sertanejo', emoji: '🤠' },
  { key: 'mpb', label: 'Tocar MPB', emoji: '🇧🇷' },
  { key: 'hobby', label: 'Tocar por hobby', emoji: '😊' },
  { key: 'tecnica', label: 'Melhorar técnica', emoji: '✨' },
]

const minutes: { key: string; value: User['dailyMinutes']; emoji: string; label: string; description: string }[] = [
  { key: '5', value: 5, emoji: '⚡', label: '5 minutos', description: 'Treino rápido' },
  { key: '10', value: 10, emoji: '🎯', label: '10 minutos', description: 'Equilibrado' },
  { key: '15', value: 15, emoji: '🚀', label: '15 minutos', description: 'Foco maior' },
  { key: '20', value: 20, emoji: '🏆', label: '20 minutos', description: 'Pra evoluir rápido' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAppCompat()
  const [step, setStep] = useState(0)

  // All start as null — nothing pre-selected
  const [levelKey, setLevelKey] = useState<string | null>(null)
  const [goalKey, setGoalKey] = useState<string | null>(null)
  const [timeKey, setTimeKey] = useState<string | null>(null)

  const next = () => setStep((s) => s + 1)

  const finish = () => {
    const selectedLevel = levels.find((l) => l.key === levelKey)?.value ?? 'iniciante'
    const selectedGoal = goals.find((g) => g.key === goalKey)?.label ?? goals[0].label
    const selectedTime = minutes.find((m) => m.key === timeKey)?.value ?? 10
    completeOnboarding({ level: selectedLevel, goal: selectedGoal, dailyMinutes: selectedTime })
    navigate('/home')
  }

  const totalSteps = 3

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          {step > 0 && step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="grid h-10 w-10 place-items-center rounded-2xl text-ink-400 hover:bg-ink-100 transition-colors"
              aria-label="Voltar"
            >
              ←
            </button>
          ) : (
            <Logo variant="compact" />
          )}
          {step > 0 && step < 4 && (
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-ink-200">
              <motion.div
                className="h-full rounded-full bg-brand-500"
                initial={false}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-6">
        <AnimatePresence mode="wait">
          {step === 0 && <Welcome key="0" onNext={next} />}

          {step === 1 && (
            <Choice
              key="1"
              title="Qual seu nível no violão?"
              options={levels.map((l) => ({
                key: l.key,
                label: l.label,
                description: l.description,
                emoji: l.emoji,
              }))}
              selectedKey={levelKey}
              onSelect={setLevelKey}
              onNext={next}
            />
          )}

          {step === 2 && (
            <Choice
              key="2"
              title="Qual é o seu objetivo?"
              options={goals.map((g) => ({ key: g.key, label: g.label, emoji: g.emoji }))}
              selectedKey={goalKey}
              onSelect={setGoalKey}
              onNext={next}
            />
          )}

          {step === 3 && (
            <Choice
              key="3"
              title="Quanto tempo por dia?"
              options={minutes.map((m) => ({
                key: m.key,
                label: m.label,
                description: m.description,
                emoji: m.emoji,
              }))}
              selectedKey={timeKey}
              onSelect={setTimeKey}
              onNext={next}
            />
          )}

          {step === 4 && <Final key="4" onFinish={finish} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Welcome ───────────────────────────────────────────────────────────────

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative mb-6 grid h-36 w-36 place-items-center rounded-[40px] bg-brand-500 text-white"
          style={{ boxShadow: '0 8px 0 0 #46A302' }}
        >
          <Music className="h-16 w-16" strokeWidth={2.4} />
          <span
            className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-2xl bg-sun-500 text-white text-2xl"
            style={{ boxShadow: '0 4px 0 0 #DC9F00' }}
          >
            ✨
          </span>
        </motion.div>
        <h1 className="font-display text-3xl font-bold leading-tight text-ink-900">
          Aprenda violão
          <br />
          em poucos minutos por dia
        </h1>
        <p className="mt-3 text-base font-semibold text-ink-500">
          Lições curtas, divertidas, no seu ritmo.
        </p>
      </div>
      <button
        onClick={onNext}
        className="btn-3d btn-3d-green w-full"
      >
        Começar agora
      </button>
    </motion.div>
  )
}

// ─── Choice ────────────────────────────────────────────────────────────────

interface ChoiceProps {
  title: string
  options: { key: string; label: string; description?: string; emoji?: string }[]
  selectedKey: string | null
  onSelect: (key: string) => void
  onNext: () => void
}

function Choice({ title, options, selectedKey, onSelect, onNext }: ChoiceProps) {
  const hasSelection = selectedKey !== null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col"
    >
      <h2 className="font-display text-2xl font-bold leading-tight text-ink-900">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-ink-400">Toque para selecionar</p>

      <div className="mt-5 flex flex-col gap-3 flex-1">
        {options.map((opt) => {
          const isActive = opt.key === selectedKey
          return (
            <motion.button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              whileTap={{ scale: 0.97 }}
              animate={
                isActive
                  ? { scale: [1, 1.02, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-3 rounded-3xl border-[3px] p-4 text-left transition-colors duration-150 ${
                isActive
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-ink-200 bg-white'
              }`}
              style={{
                boxShadow: isActive ? '0 4px 0 0 #46A302' : '0 4px 0 0 #E5E5E5',
              }}
            >
              {opt.emoji && (
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl border-2 transition-colors duration-150 ${
                    isActive ? 'bg-brand-100 border-brand-200' : 'bg-white border-ink-100'
                  }`}
                >
                  {opt.emoji}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className={`font-display text-base font-bold transition-colors duration-150 ${isActive ? 'text-brand-700' : 'text-ink-900'}`}>
                  {opt.label}
                </p>
                {opt.description && (
                  <p className="text-xs font-semibold text-ink-500">{opt.description}</p>
                )}
              </div>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-150 ${
                  isActive ? 'bg-brand-500 text-white' : 'border-2 border-ink-300 bg-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check className="h-5 w-5" strokeWidth={3.5} />
                  </motion.span>
                )}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Continue button — always visible, disabled until selection */}
      <div className="mt-5 pt-2">
        <motion.button
          onClick={hasSelection ? onNext : undefined}
          animate={hasSelection ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 4 }}
          transition={{ duration: 0.2 }}
          disabled={!hasSelection}
          className={`btn-3d w-full flex items-center justify-center gap-2 ${
            hasSelection ? 'btn-3d-green' : 'btn-3d-gray'
          }`}
          style={!hasSelection ? { cursor: 'not-allowed', boxShadow: '0 3px 0 0 #C4C4C4' } : undefined}
        >
          Continuar
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </motion.button>
        {!hasSelection && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center text-xs font-bold text-ink-400"
          >
            Selecione uma opção para continuar
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Final ─────────────────────────────────────────────────────────────────

function Final({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="grid h-28 w-28 place-items-center rounded-[36px] bg-brand-500 text-white"
          style={{ boxShadow: '0 8px 0 0 #46A302' }}
        >
          <Check className="h-14 w-14" strokeWidth={3.5} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-display text-3xl font-bold leading-tight text-ink-900"
        >
          Tudo pronto!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-base font-semibold text-ink-500"
        >
          Sua trilha personalizada está esperando.
        </motion.p>
      </div>
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onFinish}
        className="btn-3d btn-3d-green w-full"
      >
        Ver meu mapa
      </motion.button>
    </motion.div>
  )
}

// ─── Compat ────────────────────────────────────────────────────────────────

function useAppCompat() {
  const ctx = useApp() as any
  return {
    completeOnboarding: (partial: Partial<User>) => {
      if (typeof ctx.completeOnboarding === 'function') {
        ctx.completeOnboarding(partial)
      } else if (ctx.setUser && ctx.setHasOnboarded) {
        ctx.setUser({ ...ctx.user, ...partial })
        ctx.setHasOnboarded(true)
      }
    },
  }
}
