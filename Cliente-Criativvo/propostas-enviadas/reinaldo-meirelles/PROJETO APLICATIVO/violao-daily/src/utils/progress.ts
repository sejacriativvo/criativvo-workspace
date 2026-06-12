// Utilitários puros relacionados a progresso, sem React.
// Mantidos isolados para facilitar testes e reuso futuro.

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(xp % 1000 === 0 ? 0 : 1).replace('.', ',')}k`
  return xp.toString()
}

export function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value))
}
