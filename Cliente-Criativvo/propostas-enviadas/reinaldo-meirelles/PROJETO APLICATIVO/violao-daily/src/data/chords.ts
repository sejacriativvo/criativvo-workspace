// Diagramas simples de acordes para o componente ChordDiagram.
// Cada string é uma corda (Mi grave -> Mi agudo).
// Valor: número da casa (0 = solta, -1 = não tocar).
// fingers: dedo usado em cada corda (1=indicador, 2=médio, 3=anelar, 4=mínimo, 0=solta).

export interface ChordShape {
  name: string
  frets: number[] // 6 cordas
  fingers: number[]
  baseFret?: number
}

export const chordShapes: Record<string, ChordShape> = {
  Em: { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  G: { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
  C: { name: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  D: { name: 'D', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  Am: { name: 'Am', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  E: { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  F: { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  A7: { name: 'A7', frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
  Dm: { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  B7: { name: 'B7', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
}

export const getChord = (name: string): ChordShape => {
  return (
    chordShapes[name] ?? {
      name,
      frets: [0, 0, 0, 0, 0, 0],
      fingers: [0, 0, 0, 0, 0, 0],
    }
  )
}
