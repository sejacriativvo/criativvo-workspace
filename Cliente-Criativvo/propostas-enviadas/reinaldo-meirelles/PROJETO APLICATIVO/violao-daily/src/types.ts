// Tipos compartilhados em todo o app.
// Mantidos centralizados para facilitar evolução para backend/banco real.

export type LessonType =
  | 'theory'
  | 'chord'
  | 'rhythm'
  | 'quiz'
  | 'practice_timer'
  | 'song'
  | 'challenge'
  | 'review'

export type LessonStatus = 'completed' | 'current' | 'available' | 'locked'

export interface LessonBlock {
  type: 'explanation' | 'chord' | 'video' | 'practice' | 'quiz' | 'timer' | 'metronome' | 'checklist'
  title?: string
  text?: string
  chord?: string
  options?: string[]
  correctIndex?: number
  durationSec?: number
  bpm?: number
  items?: string[]
  videoLabel?: string
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  description: string
  type: LessonType
  xp: number
  durationMin: number
  status: LessonStatus
  isCurrent?: boolean
  isLocked?: boolean
  iconKey?: string
  blocks: LessonBlock[]
}

export interface Unit {
  id: string
  number: number
  title: string
  subtitle: string
  theme: 'forest' | 'sunset' | 'ocean' | 'twilight' | 'stage'
  accentFrom: string
  accentTo: string
  iconKey: string
}

export interface Song {
  id: string
  title: string
  artist: string
  category: 'primeira' | 'sertanejo' | 'gospel' | 'pop' | 'mpb' | 'rock' | 'infantil' | 'treino'
  level: 'iniciante' | 'basico' | 'intermediario' | 'avancado'
  chords: string[]
  durationMin: number
  status: 'locked' | 'available' | 'completed'
  cover?: string
  bpm?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  iconKey: string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'comum' | 'rara' | 'epica' | 'lendaria'
}

export interface RankingUser {
  id: string
  name: string
  avatar: string
  weeklyXP: number
  isCurrent?: boolean
  league: League
}

export type League = 'bronze' | 'prata' | 'ouro' | 'palco' | 'maestro'

export interface Mission {
  id: string
  scope: 'daily' | 'weekly'
  title: string
  description: string
  reward: number
  current: number
  target: number
  iconKey: string
}

export interface User {
  id: string
  name: string
  avatar: string
  level: 'iniciante' | 'basico' | 'intermediario' | 'avancado'
  goal: string
  dailyMinutes: 5 | 10 | 15 | 20
  xp: number
  streak: number
  longestStreak: number
  energy: number
  maxEnergy: number
  isPremium: boolean
  league: League
  joinedAt: string
}

export interface Notification {
  id: string
  title: string
  description: string
  iconKey: string
  read: boolean
  createdAt: string
  tone: 'info' | 'warn' | 'success'
}
