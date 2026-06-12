import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Crown, Mic, Music, Sparkles, X, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const benefits = [
  { icon: Zap, label: 'Energia ilimitada para praticar sem parar', color: '#FFC800', shadow: '#DC9F00' },
  { icon: Music, label: 'Acesso a todas as músicas do catálogo', color: '#1CB0F6', shadow: '#0E84BC' },
  { icon: Sparkles, label: 'Treinos personalizados pra você', color: '#CE82FF', shadow: '#8444C2' },
  { icon: Mic, label: 'Em breve: correção por áudio com IA', color: '#FF4B4B', shadow: '#C53030' },
  { icon: BadgeCheck, label: 'Relatório detalhado de evolução', color: '#58CC02', shadow: '#46A302' },
  { icon: Crown, label: 'Conquistas e desafios exclusivos', color: '#FF9600', shadow: '#C97700' },
]

export default function Premium() {
  const navigate = useNavigate()
  const { togglePremium, user } = useApp()
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')

  const subscribe = () => {
    togglePremium()
    navigate('/profile')
  }

  return (
    <div className="relative flex h-full flex-col bg-sun-400/20">
      {/* Topo amarelo cheio com coroa grande */}
      <div className="relative bg-sun-500 px-5 pb-12 pt-6 text-center">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/30 text-white"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
          </button>
          <p className="font-display text-base font-bold uppercase tracking-widest text-white">
            Premium
          </p>
          <span className="w-10" />
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div
            className="grid h-24 w-24 place-items-center rounded-[28px] bg-white text-sun-600"
            style={{ boxShadow: '0 6px 0 0 rgba(0,0,0,0.15)' }}
          >
            <Crown className="h-12 w-12" fill="#FFC800" strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-white">Pratique sem limites</h1>
          <p className="mt-1 text-sm font-bold text-white/90">Toque mais, evolua mais rápido</p>
        </div>
      </div>

      {/* Card branco subindo */}
      <div className="-mt-8 flex-1 rounded-t-[36px] bg-white px-5 pb-32 pt-6">
        {/* Planos */}
        <div className="grid grid-cols-2 gap-3">
          <PlanCard
            label="Mensal"
            price="R$ 29,90"
            description="por mês"
            active={plan === 'monthly'}
            onClick={() => setPlan('monthly')}
          />
          <PlanCard
            label="Anual"
            price="R$ 199,90"
            description="-44% no anual"
            badge="POPULAR"
            active={plan === 'annual'}
            onClick={() => setPlan('annual')}
          />
        </div>

        {/* Lista de benefícios */}
        <div className="mt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            Tudo isso liberado
          </p>
          <ul className="space-y-2.5">
            {benefits.map(({ icon: Icon, label, color, shadow }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-3xl border-2 border-ink-200 bg-white p-3"
                style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white"
                  style={{ background: color, boxShadow: `0 3px 0 0 ${shadow}` }}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </span>
                <p className="font-display text-sm font-bold text-ink-900">{label}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Comparativo */}
        <div className="mt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-500">
            Compare os planos
          </p>
          <div
            className="overflow-hidden rounded-3xl border-2 border-ink-200 bg-white"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            <div className="grid grid-cols-3 gap-2 border-b-2 border-ink-100 bg-ink-50 px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Recurso
              </span>
              <span className="text-center text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Grátis
              </span>
              <span className="text-center text-[10px] font-bold uppercase tracking-widest text-sun-600">
                Premium
              </span>
            </div>
            {[
              ['Energia', '5/dia', 'Ilimitada'],
              ['Músicas', 'Básicas', 'Todas'],
              ['Treinos', 'Limitados', 'Personalizados'],
              ['Relatórios', '—', 'Detalhados'],
              ['Anúncios', 'Sim', 'Não'],
            ].map((row, i) => (
              <div
                key={row[0]}
                className={`grid grid-cols-3 items-center gap-2 px-4 py-3 ${
                  i > 0 ? 'border-t-2 border-ink-100' : ''
                }`}
              >
                <span className="text-sm font-bold text-ink-700">{row[0]}</span>
                <span className="text-center text-xs font-semibold text-ink-500">{row[1]}</span>
                <span className="text-center text-xs font-bold text-sun-600">{row[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer fixo com botão grande */}
      <div className="absolute bottom-0 left-0 right-0 border-t-2 border-ink-100 bg-white p-4">
        <button
          onClick={subscribe}
          className="btn-3d btn-3d-yellow w-full"
        >
          {user.isPremium ? 'Cancelar (modo demo)' : `Começar Premium • ${plan === 'annual' ? 'R$ 199/ano' : 'R$ 29,90/mês'}`}
        </button>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-ink-400">
          Cancele quando quiser
        </p>
      </div>
    </div>
  )
}

interface PlanCardProps {
  label: string
  price: string
  description: string
  badge?: string
  active: boolean
  onClick: () => void
}

function PlanCard({ label, price, description, badge, active, onClick }: PlanCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-start gap-1 rounded-3xl border-[3px] p-4 text-left transition-all active:scale-95 ${
        active ? 'border-sun-500 bg-sun-400/20' : 'border-ink-200 bg-white'
      }`}
      style={{ boxShadow: active ? '0 4px 0 0 #DC9F00' : '0 4px 0 0 #E5E5E5' }}
    >
      {badge && (
        <span
          className="absolute -top-2.5 right-3 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ boxShadow: '0 2px 0 0 #C53030' }}
        >
          {badge}
        </span>
      )}
      <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
      <p className="font-display text-xl font-bold text-ink-900">{price}</p>
      <p className={`text-[11px] font-bold ${active ? 'text-sun-600' : 'text-ink-500'}`}>{description}</p>
    </button>
  )
}

void X
