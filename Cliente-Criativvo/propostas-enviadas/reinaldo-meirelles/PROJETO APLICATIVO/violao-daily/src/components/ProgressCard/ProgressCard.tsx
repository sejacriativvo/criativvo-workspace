import type { ReactNode } from 'react'

interface ProgressCardProps {
  title: string
  value: string
  caption?: string
  icon?: ReactNode
  tone?: 'brand' | 'amber' | 'midnight' | 'rose' | 'blue' | 'grape'
  className?: string
}

const tones = {
  brand: { bg: 'bg-brand-50 text-brand-600 border-brand-200', shadow: '0 3px 0 0 #E5E5E5' },
  amber: { bg: 'bg-sun-400/20 text-sun-600 border-sun-500/40', shadow: '0 3px 0 0 #E5E5E5' },
  midnight: { bg: 'bg-midnight-700/10 text-midnight-700 border-midnight-700/20', shadow: '0 3px 0 0 #E5E5E5' },
  rose: { bg: 'bg-rose-50 text-rose-500 border-rose-100', shadow: '0 3px 0 0 #E5E5E5' },
  blue: { bg: 'bg-sky-50 text-sky-600 border-sky-100', shadow: '0 3px 0 0 #E5E5E5' },
  grape: { bg: 'bg-grape-400/20 text-grape-600 border-grape-400/40', shadow: '0 3px 0 0 #E5E5E5' },
}

export default function ProgressCard({
  title,
  value,
  caption,
  icon,
  tone = 'brand',
  className = '',
}: ProgressCardProps) {
  const t = tones[tone]
  return (
    <div
      className={`rounded-3xl border-2 border-ink-200 bg-white p-4 ${className}`}
      style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={`grid h-12 w-12 place-items-center rounded-2xl border-2 ${t.bg}`}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">{title}</p>
          <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
          {caption && <p className="text-xs font-semibold text-ink-500">{caption}</p>}
        </div>
      </div>
    </div>
  )
}
