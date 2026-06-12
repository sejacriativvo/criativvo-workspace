interface LogoProps {
  className?: string
  variant?: 'default' | 'compact'
}

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="Tocaê"
        className="h-10 w-10 rounded-2xl"
        style={{ boxShadow: '0 4px 0 0 #46A302' }}
      />
      {variant === 'default' && (
        <div className="leading-none">
          <p className="font-display text-lg font-bold tracking-tight text-ink-900">tocaê</p>
        </div>
      )}
    </div>
  )
}
