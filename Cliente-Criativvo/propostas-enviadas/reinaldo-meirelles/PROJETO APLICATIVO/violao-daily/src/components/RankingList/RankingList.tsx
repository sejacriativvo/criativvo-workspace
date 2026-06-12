import { Crown, Medal } from 'lucide-react'
import type { RankingUser } from '../../types'

interface RankingListProps {
  users: RankingUser[]
}

const placeColor: Record<number, string> = {
  1: 'bg-sun-500 text-white',
  2: 'bg-ink-300 text-white',
  3: 'bg-sun-600 text-white',
}

export default function RankingList({ users }: RankingListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {users.map((u, idx) => {
        const place = idx + 1
        const isTop = place <= 3
        return (
          <li
            key={u.id}
            className={`flex items-center gap-3 rounded-3xl border-2 p-3 ${
              u.isCurrent ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-white'
            }`}
            style={{ boxShadow: u.isCurrent ? '0 3px 0 0 #46A302' : '0 3px 0 0 #E5E5E5' }}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                isTop ? placeColor[place] : 'bg-ink-100 text-ink-700'
              }`}
            >
              {place === 1 ? <Crown className="h-4 w-4" fill="currentColor" /> : place}
            </span>
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold text-white"
              style={{
                background: u.isCurrent ? '#58CC02' : '#3A4A6E',
                boxShadow: u.isCurrent ? '0 3px 0 0 #46A302' : '0 3px 0 0 #2E3A57',
              }}
            >
              {u.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-display text-base font-bold ${
                  u.isCurrent ? 'text-brand-700' : 'text-ink-900'
                }`}
              >
                {u.name}
              </p>
              <p className="text-xs font-bold text-ink-500">XP semanal</p>
            </div>
            <span className="font-display text-lg font-bold text-ink-900">{u.weeklyXP}</span>
          </li>
        )
      })}
    </ul>
  )
}

void Medal
