import { useEffect, useRef, useState } from 'react'
import { Minus, Pause, Play, Plus } from 'lucide-react'

interface MetronomeProps {
  initialBpm?: number
  compact?: boolean
}

// Metrônomo com pulsação visual + áudio opcional via WebAudio.
export default function Metronome({ initialBpm = 80 }: MetronomeProps) {
  const [bpm, setBpm] = useState(initialBpm)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(0)
  const audioRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setBeat((b) => (b + 1) % 4)
      tick()
    }, 60000 / bpm)
    return () => clearInterval(interval)
  }, [running, bpm])

  const tick = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = beat === 0 ? 1100 : 880
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // áudio é opcional
    }
  }

  return (
    <div
      className="card-soft mx-auto inline-flex flex-col items-stretch gap-4 p-5"
      style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setBpm((b) => Math.max(40, b - 5))}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-700 transition-transform active:scale-90"
          style={{ boxShadow: '0 3px 0 0 #D1D1D1' }}
          aria-label="Diminuir"
        >
          <Minus className="h-5 w-5" strokeWidth={3} />
        </button>
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-ink-900">{bpm}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">BPM</p>
        </div>
        <button
          onClick={() => setBpm((b) => Math.min(220, b + 5))}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-700 transition-transform active:scale-90"
          style={{ boxShadow: '0 3px 0 0 #D1D1D1' }}
          aria-label="Aumentar"
        >
          <Plus className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>

      {/* 4 bolinhas de batida */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((b) => (
          <span
            key={b}
            className={`h-3.5 w-3.5 rounded-full transition-all ${
              running && b === beat ? 'scale-150 bg-brand-500' : 'bg-ink-200'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setRunning((r) => !r)}
        className={running ? 'btn-3d btn-3d-red' : 'btn-3d btn-3d-green'}
      >
        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {running ? 'Pausar' : 'Iniciar'}
      </button>
    </div>
  )
}
