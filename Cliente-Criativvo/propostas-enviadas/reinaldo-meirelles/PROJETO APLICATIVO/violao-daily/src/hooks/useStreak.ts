import { useApp } from '../context/AppContext'

export function useStreak() {
  const { user } = useApp()

  // Helpers de exibição usados em vários cards.
  const fireIntensity =
    user.streak >= 30 ? 'lendaria' : user.streak >= 14 ? 'forte' : user.streak >= 7 ? 'media' : 'inicial'

  return {
    streak: user.streak,
    longestStreak: user.longestStreak,
    fireIntensity,
    label: user.streak === 1 ? '1 dia seguido' : `${user.streak} dias seguidos`,
  }
}
