import { Check, Clock, Lock, Music2, Play } from 'lucide-react'
import type { Song } from '../../types'

interface SongCardProps {
  song: Song
  onPlay: (song: Song) => void
}

const levelLabel = {
  iniciante: 'Iniciante',
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const levelTone = {
  iniciante: 'bg-brand-50 text-brand-700 border border-brand-200',
  basico: 'bg-sky-50 text-sky-700 border border-sky-100',
  intermediario: 'bg-sun-400/30 text-ink-900 border border-sun-500/40',
  avancado: 'bg-rose-50 text-rose-500 border border-rose-100',
}

const albumColors = ['#1CB0F6', '#CE82FF', '#FFC800', '#FF9600', '#58CC02', '#FF4B4B']

export default function SongCard({ song, onPlay }: SongCardProps) {
  const locked = song.status === 'locked'
  const completed = song.status === 'completed'
  const accent = albumColors[song.id.charCodeAt(song.id.length - 1) % albumColors.length]

  return (
    <div
      className="flex items-center gap-3 rounded-3xl border-2 border-ink-200 bg-white p-3"
      style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
    >
      <div
        className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-white"
        style={{
          background: locked ? '#D1D1D1' : accent,
          boxShadow: locked ? '0 3px 0 0 #AFAFAF' : `0 3px 0 0 rgba(0,0,0,0.18)`,
        }}
      >
        {locked ? <Lock className="h-6 w-6" /> : <Music2 className="h-7 w-7" strokeWidth={2} />}
        {completed && (
          <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
            <Check className="h-3 w-3" strokeWidth={3.5} />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-display text-base font-bold ${locked ? 'text-ink-400' : 'text-ink-900'}`}>
          {song.title}
        </p>
        <p className={`truncate text-xs font-semibold ${locked ? 'text-ink-300' : 'text-ink-500'}`}>
          {song.artist}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={`pill ${levelTone[song.level]}`}>{levelLabel[song.level]}</span>
          <span className="pill bg-ink-100 text-ink-600 border border-ink-200">
            <Clock className="h-3 w-3" />
            {song.durationMin} min
          </span>
        </div>
      </div>
      <button
        onClick={() => onPlay(song)}
        disabled={locked}
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform active:scale-95 ${
          locked
            ? 'bg-ink-100 text-ink-400'
            : completed
              ? 'bg-brand-50 text-brand-700 border-2 border-brand-200'
              : 'bg-brand-500 text-white'
        }`}
        style={{
          boxShadow: locked
            ? '0 3px 0 0 #D1D1D1'
            : completed
              ? '0 3px 0 0 #BFEA8B'
              : '0 3px 0 0 #46A302',
        }}
        aria-label="Aprender música"
      >
        {locked ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5" fill="currentColor" />}
      </button>
    </div>
  )
}
