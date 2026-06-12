import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber' | 'blue' | 'grape'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

// Botões 3D estilo app gamificado: texto uppercase, sombra inferior forte, "afunda" ao clicar.
// IMPORTANTE: aplica `btn-3d` (base) + `btn-3d-{variant}` (cor) — ambas precisam estar juntas.
const styles: Record<Variant, string> = {
  primary: 'btn-3d btn-3d-green',
  secondary: 'btn-3d btn-3d-gray',
  ghost: 'btn-3d btn-3d-gray !shadow-none !border-0 !text-ink-500',
  danger: 'btn-3d btn-3d-red',
  amber: 'btn-3d btn-3d-yellow',
  blue: 'btn-3d btn-3d-blue',
  grape: 'btn-3d btn-3d-grape',
}

export default function Button({
  variant = 'primary',
  fullWidth,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  )
}
