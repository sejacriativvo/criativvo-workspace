interface ProgressBarProps {
  value: number // 0-100
  className?: string
  tone?: 'brand' | 'amber' | 'midnight' | 'rose' | 'blue'
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const tones: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  brand: 'bg-brand-500',
  amber: 'bg-sun-500',
  midnight: 'bg-midnight-700',
  rose: 'bg-rose-500',
  blue: 'bg-sky-500',
}

// Barra de progresso grossa, arredondada, com brilho superior (estilo gamificado).
const heights = { sm: 'h-2.5', md: 'h-4', lg: 'h-5' }

export default function ProgressBar({
  value,
  className = '',
  tone = 'brand',
  height = 'md',
  showLabel,
}: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full ${className}`}>
      <div className={`relative w-full overflow-hidden rounded-full bg-ink-200 ${heights[height]}`}>
        <div
          className={`relative h-full rounded-full transition-all duration-700 ease-out ${tones[tone]}`}
          style={{ width: `${safe}%` }}
        >
          {safe > 8 && (
            <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/40" aria-hidden />
          )}
        </div>
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs font-bold text-ink-600">{safe}%</p>
      )}
    </div>
  )
}
