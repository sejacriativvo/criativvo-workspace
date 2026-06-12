import type { Lesson } from '../types'

// Calcula recompensas extras com base no tipo da lição.
// Centraliza a regra para que evolução para backend mantenha consistência.

export function calculateLessonReward(lesson: Lesson, perfect = false): number {
  const base = lesson.xp
  const perfectBonus = perfect ? 10 : 0
  return base + perfectBonus
}

export function rarityToTone(rarity: 'comum' | 'rara' | 'epica' | 'lendaria'): {
  bg: string
  text: string
  ring: string
  label: string
} {
  switch (rarity) {
    case 'lendaria':
      return { bg: 'bg-gradient-sun', text: 'text-white', ring: 'ring-sun-500/40', label: 'Lendária' }
    case 'epica':
      return { bg: 'bg-gradient-night', text: 'text-white', ring: 'ring-midnight-500/40', label: 'Épica' }
    case 'rara':
      return { bg: 'bg-gradient-brand', text: 'text-white', ring: 'ring-brand-500/40', label: 'Rara' }
    case 'comum':
    default:
      return { bg: 'bg-ink-100', text: 'text-ink-700', ring: 'ring-ink-200', label: 'Comum' }
  }
}

export function leagueColor(league: string): string {
  switch (league) {
    case 'maestro':
      return '#10B981'
    case 'palco':
      return '#8B5CF6'
    case 'ouro':
      return '#F59E0B'
    case 'prata':
      return '#94A3B8'
    case 'bronze':
    default:
      return '#B45309'
  }
}
