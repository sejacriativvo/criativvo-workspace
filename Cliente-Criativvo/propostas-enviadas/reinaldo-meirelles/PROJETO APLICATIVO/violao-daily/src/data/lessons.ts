import type { Lesson, LessonStatus } from '../types'

// 40 lições mockadas distribuídas em 5 unidades.
// O progresso inicial deixa o usuário na unidade 2, lição "Troca entre Em e G".

const buildStatus = (completedThrough: number, totalConcluded: number, index: number): LessonStatus => {
  if (index < totalConcluded) return 'completed'
  if (index === totalConcluded) return 'current'
  if (index <= completedThrough) return 'available'
  return 'locked'
}

interface RawLesson {
  unitId: string
  title: string
  description: string
  type: Lesson['type']
  xp: number
  durationMin: number
  iconKey?: string
}

const raw: RawLesson[] = [
  // Unidade 1 — Primeiros passos
  { unitId: 'unit-1', title: 'Conhecendo o violão', description: 'Anatomia, postura e como ele soa', type: 'theory', xp: 15, durationMin: 4, iconKey: 'book' },
  { unitId: 'unit-1', title: 'Nome das cordas', description: 'Mi, Si, Sol, Ré, Lá, Mi grave', type: 'quiz', xp: 15, durationMin: 3, iconKey: 'quiz' },
  { unitId: 'unit-1', title: 'Como segurar o violão', description: 'Postura natural e relaxada', type: 'theory', xp: 10, durationMin: 3, iconKey: 'hand' },
  { unitId: 'unit-1', title: 'Primeira batida', description: 'Mão direita solta e leve', type: 'rhythm', xp: 20, durationMin: 5, iconKey: 'rhythm' },
  { unitId: 'unit-1', title: 'Primeiro acorde: Em', description: 'O acorde mais fácil pra começar', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-1', title: 'Primeiro acorde: G', description: 'Apoie bem os dedos', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-1', title: 'Troca entre Em e G', description: 'Devagar, sem pressa', type: 'practice_timer', xp: 25, durationMin: 6, iconKey: 'timer' },
  { unitId: 'unit-1', title: 'Sua primeira sequência', description: 'Desafio para fechar a unidade', type: 'challenge', xp: 40, durationMin: 6, iconKey: 'trophy' },

  // Unidade 2 — Acordes básicos
  { unitId: 'unit-2', title: 'Acorde C', description: 'Forma clássica em três cordas', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-2', title: 'Acorde D', description: 'Triângulo perfeito de dedos', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-2', title: 'Acorde Am', description: 'Som triste e cheio de cor', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-2', title: 'Acorde E', description: 'O irmão maior do Em', type: 'chord', xp: 20, durationMin: 5, iconKey: 'chord' },
  { unitId: 'unit-2', title: 'Troca C para G', description: 'Fluxo ascendente', type: 'practice_timer', xp: 25, durationMin: 6, iconKey: 'timer' },
  { unitId: 'unit-2', title: 'Troca D para Em', description: 'Memória dos dedos', type: 'practice_timer', xp: 25, durationMin: 6, iconKey: 'timer' },
  { unitId: 'unit-2', title: 'Treino de memória', description: 'Reconheça acordes pelo desenho', type: 'quiz', xp: 30, durationMin: 5, iconKey: 'brain' },
  { unitId: 'unit-2', title: 'Desafio dos 4 acordes', description: 'Toque a base mais usada do mundo', type: 'challenge', xp: 50, durationMin: 8, iconKey: 'trophy' },

  // Unidade 3 — Ritmos
  { unitId: 'unit-3', title: 'Batida para baixo', description: 'Pulso firme e estável', type: 'rhythm', xp: 20, durationMin: 5, iconKey: 'rhythm' },
  { unitId: 'unit-3', title: 'Batida para cima', description: 'Toque leve nas cordas finas', type: 'rhythm', xp: 20, durationMin: 5, iconKey: 'rhythm' },
  { unitId: 'unit-3', title: 'Ritmo pop básico', description: 'Down, down-up, up-down-up', type: 'rhythm', xp: 30, durationMin: 6, iconKey: 'rhythm' },
  { unitId: 'unit-3', title: 'Ritmo sertanejo básico', description: 'Aquele balanço inconfundível', type: 'rhythm', xp: 30, durationMin: 6, iconKey: 'rhythm' },
  { unitId: 'unit-3', title: 'Ritmo com pausa', description: 'O silêncio também faz parte', type: 'rhythm', xp: 25, durationMin: 5, iconKey: 'rhythm' },
  { unitId: 'unit-3', title: 'Treino com metrônomo', description: 'Cole no tempo, sem correr', type: 'practice_timer', xp: 30, durationMin: 6, iconKey: 'metronome' },
  { unitId: 'unit-3', title: 'Ritmo de música real', description: 'Aplique o que você aprendeu', type: 'song', xp: 35, durationMin: 7, iconKey: 'song' },
  { unitId: 'unit-3', title: 'Desafio de ritmo', description: 'Mantenha 60 segundos sem parar', type: 'challenge', xp: 50, durationMin: 8, iconKey: 'trophy' },

  // Unidade 4 — Primeiras músicas
  { unitId: 'unit-4', title: 'Música com 2 acordes', description: 'Comece pequeno, comece bem', type: 'song', xp: 40, durationMin: 8, iconKey: 'song' },
  { unitId: 'unit-4', title: 'Música com 3 acordes', description: 'O clássico universal', type: 'song', xp: 40, durationMin: 8, iconKey: 'song' },
  { unitId: 'unit-4', title: 'Música com 4 acordes', description: 'A base de mil sucessos', type: 'song', xp: 45, durationMin: 9, iconKey: 'song' },
  { unitId: 'unit-4', title: 'Tocar junto com guia', description: 'Acompanhe a referência', type: 'practice_timer', xp: 30, durationMin: 7, iconKey: 'play' },
  { unitId: 'unit-4', title: 'Tocar sem pausa', description: 'Mantenha o fluxo da música', type: 'practice_timer', xp: 30, durationMin: 6, iconKey: 'play' },
  { unitId: 'unit-4', title: 'Tocar com metrônomo', description: 'Crie groove e segurança', type: 'practice_timer', xp: 35, durationMin: 7, iconKey: 'metronome' },
  { unitId: 'unit-4', title: 'Gravar sua execução', description: 'Ouvir é o melhor professor', type: 'practice_timer', xp: 35, durationMin: 6, iconKey: 'mic' },
  { unitId: 'unit-4', title: 'Primeira música completa', description: 'Você merece esse marco', type: 'challenge', xp: 70, durationMin: 10, iconKey: 'trophy' },

  // Unidade 5 — Evolução
  { unitId: 'unit-5', title: 'Trocas rápidas', description: 'Reduza atrito no shape', type: 'practice_timer', xp: 35, durationMin: 6, iconKey: 'timer' },
  { unitId: 'unit-5', title: 'Dedilhado básico', description: 'Polegar, indicador, médio, anelar', type: 'theory', xp: 35, durationMin: 7, iconKey: 'hand' },
  { unitId: 'unit-5', title: 'Pestana — introdução', description: 'Sem medo, com paciência', type: 'theory', xp: 40, durationMin: 8, iconKey: 'book' },
  { unitId: 'unit-5', title: 'Campo harmônico básico', description: 'Acordes que combinam', type: 'theory', xp: 40, durationMin: 8, iconKey: 'book' },
  { unitId: 'unit-5', title: 'Ritmos avançados', description: 'Ghost notes e síncope', type: 'rhythm', xp: 45, durationMin: 8, iconKey: 'rhythm' },
  { unitId: 'unit-5', title: 'Repertório semanal', description: 'Toque suas músicas favoritas', type: 'song', xp: 50, durationMin: 10, iconKey: 'song' },
  { unitId: 'unit-5', title: 'Desafio de performance', description: 'Toque do início ao fim sem parar', type: 'challenge', xp: 80, durationMin: 12, iconKey: 'trophy' },
  { unitId: 'unit-5', title: 'Certificado de evolução', description: 'Você completou o ciclo iniciante', type: 'review', xp: 100, durationMin: 5, iconKey: 'crown' },
]

// Usuário atual está na lição "Troca entre Em e G" (índice 6 da lista, 7ª lição).
// Ele já concluiu as 6 primeiras lições e ainda tem 2 disponíveis em "Acordes básicos" como bônus.
const TOTAL_CONCLUDED = 6
const COMPLETED_THROUGH = 9 // libera além da atual algumas lições para sensação de exploração

export const lessons: Lesson[] = raw.map((l, index) => {
  const status = buildStatus(COMPLETED_THROUGH, TOTAL_CONCLUDED, index)
  return {
    id: `lesson-${index + 1}`,
    unitId: l.unitId,
    title: l.title,
    description: l.description,
    type: l.type,
    xp: l.xp,
    durationMin: l.durationMin,
    status,
    isCurrent: status === 'current',
    isLocked: status === 'locked',
    iconKey: l.iconKey,
    blocks: buildBlocksFor(l.type, l.title),
  }
})

function buildBlocksFor(type: Lesson['type'], title: string): Lesson['blocks'] {
  switch (type) {
    case 'theory':
      return [
        {
          type: 'explanation',
          title: 'Vamos começar',
          text: `Hoje você vai entender ${title.toLowerCase()}. Tome um instante para se conectar com o instrumento antes de tocar.`,
        },
        { type: 'video', videoLabel: 'Vídeo: explicação visual' },
        {
          type: 'checklist',
          items: ['Assisti à explicação', 'Pratiquei a postura', 'Anotei o que aprendi'],
        },
      ]
    case 'chord': {
      const chord = title.includes('Em') ? 'Em' : title.includes('G') ? 'G' : title.split(' ').pop() ?? 'C'
      return [
        {
          type: 'explanation',
          text: `Vamos aprender o acorde de ${chord}. Posicione cada dedo com calma e teste o som corda por corda.`,
        },
        { type: 'chord', chord },
        { type: 'video', videoLabel: `Vídeo: posicionamento do acorde ${chord}` },
        {
          type: 'practice',
          title: 'Toque o acorde 5 vezes',
          text: 'Solte os dedos entre cada repetição. Reposicione com leveza.',
        },
        {
          type: 'checklist',
          items: ['Posicionei os dedos', 'Toquei o acorde limpo', 'Repeti 5 vezes'],
        },
      ]
    }
    case 'rhythm':
      return [
        { type: 'explanation', text: `Vamos treinar o ritmo: ${title}. Mantenha o pulso interno antes de tocar.` },
        { type: 'metronome', bpm: 80 },
        { type: 'practice', title: 'Toque por 30 segundos', text: 'Sem mudar o tempo. Cole no clique do metrônomo.' },
        { type: 'checklist', items: ['Senti o pulso', 'Mantive o tempo', 'Soltei a mão direita'] },
      ]
    case 'practice_timer':
      return [
        { type: 'explanation', text: `Bora praticar: ${title}.` },
        { type: 'timer', durationSec: 30, title: 'Treino cronometrado' },
        { type: 'checklist', items: ['Comecei devagar', 'Aumentei a velocidade', 'Concluí o tempo'] },
      ]
    case 'quiz':
      return [
        { type: 'explanation', text: 'Responda rapidamente para fixar o que você aprendeu.' },
        {
          type: 'quiz',
          title: 'Qual é o nome da primeira corda do violão?',
          options: ['Mi', 'Lá', 'Ré', 'Sol'],
          correctIndex: 0,
        },
        {
          type: 'quiz',
          title: 'Qual acorde costuma ser o mais fácil para começar?',
          options: ['F', 'Em', 'B7', 'C#m'],
          correctIndex: 1,
        },
        { type: 'checklist', items: ['Acertei o quiz', 'Revisei o conteúdo'] },
      ]
    case 'song':
      return [
        { type: 'explanation', text: `Vamos tocar trechos da música. Lembre-se: ouvir é parte do estudo.` },
        { type: 'video', videoLabel: 'Vídeo: assista a referência' },
        { type: 'metronome', bpm: 90 },
        { type: 'practice', title: 'Toque o trecho 3 vezes', text: 'Pare se errar e recomece com calma.' },
        { type: 'checklist', items: ['Assisti à referência', 'Toquei o trecho', 'Repeti 3 vezes'] },
      ]
    case 'challenge':
      return [
        { type: 'explanation', text: `Desafio: ${title}. Tudo que você aprendeu vai aparecer aqui.` },
        { type: 'metronome', bpm: 95 },
        { type: 'timer', durationSec: 60, title: 'Performance contínua' },
        { type: 'checklist', items: ['Aqueci as mãos', 'Mantive o ritmo', 'Concluí sem parar'] },
      ]
    case 'review':
      return [
        { type: 'explanation', text: 'Revisão final. Vamos consolidar tudo que você aprendeu.' },
        { type: 'checklist', items: ['Revisei acordes', 'Revisei ritmos', 'Revisei trocas', 'Concluí a unidade'] },
      ]
    default:
      return []
  }
}

export const findLesson = (id: string): Lesson | undefined => lessons.find((l) => l.id === id)

export const lessonsByUnit = (unitId: string): Lesson[] => lessons.filter((l) => l.unitId === unitId)
