import type { RankingUser } from '../types'

export const ranking: RankingUser[] = [
  { id: 'r-1', name: 'Ana Lívia', avatar: 'AL', weeklyXP: 850, league: 'bronze' },
  { id: 'r-2', name: 'Lucas Reis', avatar: 'LR', weeklyXP: 790, league: 'bronze' },
  { id: 'r-3', name: 'Pedro Hauser', avatar: 'PH', weeklyXP: 700, league: 'bronze' },
  { id: 'r-4', name: 'Você', avatar: 'MV', weeklyXP: 580, league: 'bronze', isCurrent: true },
  { id: 'r-5', name: 'Marina Silva', avatar: 'MS', weeklyXP: 520, league: 'bronze' },
  { id: 'r-6', name: 'Rafael Aguiar', avatar: 'RA', weeklyXP: 460, league: 'bronze' },
  { id: 'r-7', name: 'Carolina Mota', avatar: 'CM', weeklyXP: 410, league: 'bronze' },
  { id: 'r-8', name: 'Diego Rocha', avatar: 'DR', weeklyXP: 360, league: 'bronze' },
  { id: 'r-9', name: 'Helena Cruz', avatar: 'HC', weeklyXP: 320, league: 'bronze' },
  { id: 'r-10', name: 'Bruno Lemos', avatar: 'BL', weeklyXP: 240, league: 'bronze' },
]

export const leagues: { key: RankingUser['league']; label: string; color: string; description: string }[] = [
  { key: 'bronze', label: 'Bronze', color: '#B45309', description: 'Liga de iniciantes apaixonados' },
  { key: 'prata', label: 'Prata', color: '#94A3B8', description: 'Quem já criou o hábito' },
  { key: 'ouro', label: 'Ouro', color: '#F59E0B', description: 'Praticantes consistentes' },
  { key: 'palco', label: 'Palco', color: '#8B5CF6', description: 'Tocando músicas inteiras' },
  { key: 'maestro', label: 'Maestro', color: '#10B981', description: 'A elite da prática diária' },
]
