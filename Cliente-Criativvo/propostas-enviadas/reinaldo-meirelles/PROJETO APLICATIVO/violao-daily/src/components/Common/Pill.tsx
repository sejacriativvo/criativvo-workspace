import type { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'amber' | 'midnight' | 'rose' | 'blue' | 'grape'
  icon?: ReactNode
  className?: string
}

const tones = {
  neutral: 'bg-ink-100 text-ink-700 border border-ink-200',
  brand: 'bg-brand-50 text-brand-700 border border-brand-200',
  amber: 'bg-sun-400/30 text-ink-900 border border-sun-500/40',
  midnight: 'bg-midnight-700/10 text-midnight-700 border border-midnight-700/20',
  rose: 'bg-rose-50 text-rose-500 border border-rose-100',
  blue: 'bg-sky-50 text-sky-700 border border-sky-100',
  grape: 'bg-grape-400/20 text-grape-600 border border-grape-400/40',
}

export default function Pill({ children, tone = 'neutral', icon, className = '' }: PillProps) {
  return (
    <span className={`pill ${tones[tone]} ${className}`}>
      {icon}
      {children}
    </span>
  )
}
