import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import SongCard from '../../components/SongCard/SongCard'
import Modal from '../../components/Common/Modal'
import Button from '../../components/Common/Button'
import { songCategories, songs } from '../../data/songs'
import type { Song } from '../../types'

export default function Songs() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Song['category'] | 'todas'>('todas')
  const [lockedAlert, setLockedAlert] = useState<Song | null>(null)

  const filtered = useMemo(
    () => (activeCategory === 'todas' ? songs : songs.filter((s) => s.category === activeCategory)),
    [activeCategory],
  )

  const handleSong = (song: Song) => {
    if (song.status === 'locked') {
      setLockedAlert(song)
      return
    }
    navigate('/practice')
  }

  return (
    <div className="bg-white">
      <TopStatsBar />

      <div className="px-4 pt-3">
        <h1 className="font-display text-3xl font-bold text-ink-900">Músicas</h1>
        <p className="text-sm font-semibold text-ink-500">Tudo que você pode tocar agora</p>

        {/* Filtros de categoria — chips coloridos */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 no-scrollbar">
          <div className="flex gap-2">
            <CategoryChip
              label="Todas"
              active={activeCategory === 'todas'}
              onClick={() => setActiveCategory('todas')}
            />
            {songCategories.map((c) => (
              <CategoryChip
                key={c.key}
                label={c.label}
                active={activeCategory === c.key}
                onClick={() => setActiveCategory(c.key)}
              />
            ))}
          </div>
        </div>

        {/* Lista de músicas */}
        <div className="mt-5 flex flex-col gap-3">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handleSong} />
          ))}
        </div>
      </div>

      <Modal open={!!lockedAlert} onClose={() => setLockedAlert(null)} title="Música bloqueada">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="grid h-20 w-20 place-items-center rounded-3xl bg-ink-100 text-ink-400"
            style={{ boxShadow: '0 4px 0 0 #D1D1D1' }}
          >
            <Lock className="h-9 w-9" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-ink-700">
            Complete mais lições para desbloquear <strong>{lockedAlert?.title}</strong>.
          </p>
          <Button fullWidth onClick={() => setLockedAlert(null)}>
            Continuar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-2xl border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
        active ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 bg-white text-ink-600'
      }`}
      style={
        active
          ? { boxShadow: '0 3px 0 0 #46A302' }
          : { boxShadow: '0 3px 0 0 #E5E5E5' }
      }
    >
      {label}
    </button>
  )
}
