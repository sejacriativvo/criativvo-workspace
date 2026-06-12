import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Achievement, Lesson, Mission, Notification, User } from '../types'
import { defaultUser, initialNotifications } from '../data/user'
import { lessons as initialLessons } from '../data/lessons'
import { dailyMissions as initialDaily, weeklyMissions as initialWeekly } from '../data/missions'
import { achievements as initialAchievements } from '../data/achievements'

interface CompleteLessonResult {
  xpGained: number
  newStreak: number
  nextLessonId?: string
  achievement?: Achievement
}

interface AppContextValue {
  user: User
  setUser: (user: User) => void
  hasOnboarded: boolean
  setHasOnboarded: (v: boolean) => void
  completeOnboarding: (partial: Partial<User>) => void
  lessons: Lesson[]
  dailyMissions: Mission[]
  weeklyMissions: Mission[]
  achievements: Achievement[]
  completeLesson: (lessonId: string) => CompleteLessonResult
  notifications: Notification[]
  markNotificationsRead: () => void
  consumeEnergy: () => boolean
  togglePremium: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const ONBOARDING_KEY = 'tocae_onboarded'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  })
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [dailyMissions, setDailyMissions] = useState<Mission[]>(initialDaily)
  const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>(initialWeekly)
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const completeOnboarding = useCallback((partial: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...partial }))
    setHasOnboarded(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true')
    }
  }, [])

  const togglePremium = useCallback(() => {
    setUser((prev) => ({ ...prev, isPremium: !prev.isPremium }))
  }, [])

  // Marca a lição como concluída, libera a próxima e soma XP no usuário.
  // Mantém o estado em memória — em uma evolução para backend essa função
  // se torna a chamada de API que persiste o progresso.
  const completeLesson = useCallback(
    (lessonId: string): CompleteLessonResult => {
      let xpGained = 0
      let nextLessonId: string | undefined
      let achievement: Achievement | undefined
      const newStreak = user.streak

      setLessons((prev) => {
        const next = [...prev]
        const idx = next.findIndex((l) => l.id === lessonId)
        if (idx === -1) return prev

        const lesson = next[idx]
        if (lesson.status === 'completed') {
          xpGained = 0
          return prev
        }

        xpGained = lesson.xp
        next[idx] = { ...lesson, status: 'completed', isCurrent: false, isLocked: false }

        for (let i = idx + 1; i < next.length; i++) {
          if (next[i].status === 'locked' || next[i].status === 'available') {
            next[i] = { ...next[i], status: 'current', isCurrent: true, isLocked: false }
            nextLessonId = next[i].id
            break
          }
        }
        return next
      })

      setUser((prev) => ({
        ...prev,
        xp: prev.xp + xpGained,
        energy: prev.isPremium ? prev.energy : Math.max(0, prev.energy - 1),
      }))

      // Atualiza missões diárias e semanais alinhadas a "concluir lição".
      setDailyMissions((prev) =>
        prev.map((m) =>
          m.id === 'mis-1' ? { ...m, current: Math.min(m.target, m.current + 1) } : m,
        ),
      )
      setWeeklyMissions((prev) =>
        prev.map((m) => {
          if (m.id === 'wkl-1') return { ...m, current: Math.min(m.target, m.current + 1) }
          if (m.id === 'wkl-4') return { ...m, current: Math.min(m.target, m.current + xpGained) }
          return m
        }),
      )

      // Desbloqueia uma conquista pendente para reforçar o senso de recompensa
      setAchievements((prev) => {
        const candidate = prev.find((a) => !a.unlocked)
        if (!candidate) return prev
        achievement = { ...candidate, unlocked: true, unlockedAt: 'agora' }
        return prev.map((a) => (a.id === candidate.id ? achievement! : a))
      })

      return { xpGained, newStreak, nextLessonId, achievement }
    },
    [user.streak],
  )

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const consumeEnergy = useCallback((): boolean => {
    if (user.isPremium) return true
    if (user.energy <= 0) return false
    setUser((prev) => ({ ...prev, energy: Math.max(prev.energy - 1, 0) }))
    return true
  }, [user.energy, user.isPremium])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      setUser,
      hasOnboarded,
      setHasOnboarded,
      completeOnboarding,
      lessons,
      dailyMissions,
      weeklyMissions,
      achievements,
      completeLesson,
      notifications,
      markNotificationsRead,
      consumeEnergy,
      togglePremium,
    }),
    [
      user,
      hasOnboarded,
      completeOnboarding,
      lessons,
      dailyMissions,
      weeklyMissions,
      achievements,
      completeLesson,
      notifications,
      markNotificationsRead,
      consumeEnergy,
      togglePremium,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
