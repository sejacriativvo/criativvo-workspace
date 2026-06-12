// Cards de prática rápida exibidos na tela "Prática".
export interface PracticeCard {
  id: string
  title: string
  category: 'recomendada' | 'acordes' | 'ritmo' | 'troca' | 'metronomo' | 'revisao'
  difficulty: 'fácil' | 'médio' | 'difícil'
  durationMin: number
  xp: number
  iconKey: string
  description: string
}

export const practiceCards: PracticeCard[] = [
  {
    id: 'p-1',
    title: 'Treinar acorde G',
    category: 'recomendada',
    difficulty: 'fácil',
    durationMin: 4,
    xp: 15,
    iconKey: 'chord',
    description: 'Reforce o desenho do acorde mais usado',
  },
  {
    id: 'p-2',
    title: 'Trocar C para G',
    category: 'troca',
    difficulty: 'médio',
    durationMin: 5,
    xp: 20,
    iconKey: 'shuffle',
    description: 'Cole no metrônomo e melhore sua transição',
  },
  {
    id: 'p-3',
    title: 'Praticar ritmo pop',
    category: 'ritmo',
    difficulty: 'médio',
    durationMin: 6,
    xp: 25,
    iconKey: 'rhythm',
    description: 'Down, down-up, up-down-up',
  },
  {
    id: 'p-4',
    title: 'Revisar nome das cordas',
    category: 'revisao',
    difficulty: 'fácil',
    durationMin: 3,
    xp: 10,
    iconKey: 'quiz',
    description: 'Mi, Si, Sol, Ré, Lá, Mi grave',
  },
  {
    id: 'p-5',
    title: 'Treino de 5 minutos',
    category: 'recomendada',
    difficulty: 'fácil',
    durationMin: 5,
    xp: 20,
    iconKey: 'timer',
    description: 'Trilha curta para ativar a mão',
  },
  {
    id: 'p-6',
    title: 'Desafio de metrônomo',
    category: 'metronomo',
    difficulty: 'difícil',
    durationMin: 6,
    xp: 30,
    iconKey: 'metronome',
    description: 'Mantenha o tempo por 60 segundos sem errar',
  },
  {
    id: 'p-7',
    title: 'Troca Em → G — fluência',
    category: 'troca',
    difficulty: 'fácil',
    durationMin: 4,
    xp: 15,
    iconKey: 'shuffle',
    description: 'Treino direto da sua próxima lição',
  },
  {
    id: 'p-8',
    title: 'Acordes difíceis: F com pestana',
    category: 'acordes',
    difficulty: 'difícil',
    durationMin: 7,
    xp: 35,
    iconKey: 'chord',
    description: 'Quebre o medo da pestana com paciência',
  },
]
