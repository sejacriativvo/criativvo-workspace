import { getChord } from '../../data/chords'

interface ChordDiagramProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

// Diagrama de acorde grande, lúdico, com bolinhas verdes nos dedos.
export default function ChordDiagram({ name, size = 'md' }: ChordDiagramProps) {
  const chord = getChord(name)
  const dims = size === 'sm' ? 140 : size === 'lg' ? 240 : 180
  const padding = 22
  const stringCount = 6
  const fretCount = 4
  const innerW = dims - padding * 2
  const innerH = dims - padding * 2 - 18
  const stringSpacing = innerW / (stringCount - 1)
  const fretSpacing = innerH / fretCount

  return (
    <div
      className="inline-flex flex-col items-center gap-2 rounded-3xl border-2 border-ink-200 bg-white p-5"
      style={{ boxShadow: '0 4px 0 0 #E5E5E5' }}
    >
      <p className="font-display text-3xl font-bold text-ink-900">{chord.name}</p>
      <svg viewBox={`0 0 ${dims} ${dims}`} width={dims} height={dims} className="block">
        {/* Pestana superior (cevilha) bem grossa */}
        <rect x={padding - 2} y={padding - 6} width={innerW + 4} height={8} rx={3} fill="#3C3C3C" />

        {/* Trastes */}
        {Array.from({ length: fretCount }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={padding}
            y1={padding + (i + 1) * fretSpacing}
            x2={padding + innerW}
            y2={padding + (i + 1) * fretSpacing}
            stroke="#D1D1D1"
            strokeWidth={2}
          />
        ))}

        {/* Cordas */}
        {Array.from({ length: stringCount }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={padding + i * stringSpacing}
            y1={padding}
            x2={padding + i * stringSpacing}
            y2={padding + innerH}
            stroke="#AFAFAF"
            strokeWidth={i < 3 ? 2.4 : 1.6}
          />
        ))}

        {/* Marcadores */}
        {chord.frets.map((fret, idx) => {
          const x = padding + idx * stringSpacing
          if (fret === -1) {
            return (
              <text
                key={`x-${idx}`}
                x={x}
                y={padding - 12}
                textAnchor="middle"
                fontSize={14}
                fill="#AFAFAF"
                fontWeight={800}
              >
                ✕
              </text>
            )
          }
          if (fret === 0) {
            return (
              <circle
                key={`o-${idx}`}
                cx={x}
                cy={padding - 14}
                r={6}
                fill="white"
                stroke="#AFAFAF"
                strokeWidth={2}
              />
            )
          }
          const cy = padding + (fret - 0.5) * fretSpacing
          return (
            <g key={`d-${idx}`}>
              {/* Sombra abaixo do dedo (3D) */}
              <circle cx={x} cy={cy + 2} r={13} fill="#46A302" />
              <circle cx={x} cy={cy} r={13} fill="#58CC02" />
              <text
                x={x}
                y={cy + 4}
                textAnchor="middle"
                fontSize={13}
                fill="white"
                fontWeight={800}
                fontFamily="Fredoka"
              >
                {chord.fingers[idx] || ''}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
