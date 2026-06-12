import type { User, Notification } from '../types'

export const defaultUser: User = {
  id: 'user-1',
  name: 'Matheus',
  avatar: 'MV',
  level: 'iniciante',
  goal: 'Tocar minha primeira música',
  dailyMinutes: 10,
  xp: 1250,
  streak: 7,
  longestStreak: 12,
  energy: 4,
  maxEnergy: 5,
  isPremium: false,
  league: 'bronze',
  joinedAt: '2026-04-08',
}

export const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'Sua sequência de 7 dias está ativa',
    description: 'Mantenha o ritmo, mais 1 lição hoje garante o dia.',
    iconKey: 'flame',
    read: false,
    createdAt: 'agora',
    tone: 'success',
  },
  {
    id: 'n-2',
    title: 'Faltam 10 XP para sua missão diária',
    description: 'Mais uma rodada de prática rápida resolve.',
    iconKey: 'sparkle',
    read: false,
    createdAt: 'há 2h',
    tone: 'info',
  },
  {
    id: 'n-3',
    title: 'Nova música desbloqueada',
    description: 'Adoração Suave já está disponível na sua biblioteca.',
    iconKey: 'music',
    read: true,
    createdAt: 'ontem',
    tone: 'info',
  },
]
