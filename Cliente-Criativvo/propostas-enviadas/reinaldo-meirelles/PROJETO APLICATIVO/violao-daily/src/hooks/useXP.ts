import { useApp } from '../context/AppContext'

const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 1750, 2750, 4000, 5500]

export function useXP() {
  const { user } = useApp()

  // Determina nível e progresso até o próximo nível com base no XP total.
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (user.xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? user.xp + 500
  const into = user.xp - currentThreshold
  const span = nextThreshold - currentThreshold
  const progress = span === 0 ? 100 : Math.min(100, Math.round((into / span) * 100))

  return {
    xp: user.xp,
    level,
    nextLevelXP: nextThreshold,
    progressToNext: progress,
    xpUntilNext: Math.max(0, nextThreshold - user.xp),
  }
}
