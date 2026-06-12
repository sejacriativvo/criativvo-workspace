# Violão Daily

App de aprendizado de violão baseado em hábito diário, progressão visual e gamificação.
Inspirado na lógica de trilhas curtas + gamificação de produtos como Duolingo, mas com identidade visual e linguagem próprias do violão.

> Versão atual: protótipo navegável com 10 telas, dados mockados, sistema de XP / streak / energia / conquistas e mapa de aprendizado animado. Pronto para ser usado em validação de mercado, demo para investidores e testes com beta.

---

## Tecnologias

- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS** (com design system próprio em `tailwind.config.js`)
- **React Router DOM** para navegação entre telas
- **Framer Motion** para microinterações
- **lucide-react** para ícones
- Estado global em **Context API** (preparado para evoluir para backend / banco / autenticação)

---

## Como rodar

Pré-requisito: **Node 18+** e **npm** (ou pnpm / yarn).

```bash
# 1. Entre na pasta do projeto
cd "PROJETO APLICATIVO/violao-daily"

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O app será aberto em `http://localhost:5173`.

Outros scripts úteis:

```bash
npm run build     # Gera o build de produção
npm run preview   # Abre o build localmente
```

---

## Estrutura do projeto

```
violao-daily/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # Entry point
    ├── App.tsx               # Rotas + animação entre telas
    ├── index.css             # Tailwind + utilidades + componentes globais
    ├── types.ts              # Tipos compartilhados (User, Lesson, Song, etc.)
    │
    ├── context/
    │   └── AppContext.tsx    # Estado global (user, lições, missões, conquistas, energia)
    │
    ├── data/                 # Camada de dados mockados (substituir por API depois)
    │   ├── user.ts
    │   ├── units.ts          # 5 unidades temáticas
    │   ├── lessons.ts        # 40 lições (8 por unidade)
    │   ├── songs.ts          # 10 músicas em 8 categorias
    │   ├── achievements.ts   # 12 conquistas (4 raridades)
    │   ├── ranking.ts        # 10 usuários + 5 ligas
    │   ├── missions.ts       # Missões diárias e semanais
    │   ├── practice.ts       # Cards de prática rápida
    │   └── chords.ts         # Diagramas de acordes
    │
    ├── hooks/
    │   ├── useProgress.ts    # Progresso por unidade + lição atual
    │   ├── useStreak.ts      # Sequência diária formatada
    │   └── useXP.ts          # XP, nível e progresso para o próximo
    │
    ├── utils/
    │   ├── progress.ts       # Helpers (formatação de XP, minutos)
    │   └── gamification.ts   # Recompensas, raridades, ligas
    │
    ├── components/
    │   ├── Layout/AppShell.tsx
    │   ├── BottomNavigation/
    │   ├── TopStatsBar/      # Logo + XP + streak + energia + avatar
    │   ├── LearningMap/      # Mapa em trilha + UnitHeader temático
    │   ├── LessonNode/       # Botões circulares com glow / cadeado / check
    │   ├── ProgressCard/
    │   ├── MissionCard/
    │   ├── AchievementBadge/
    │   ├── SongCard/
    │   ├── RankingList/
    │   ├── Metronome/        # Metrônomo visual + áudio (WebAudio opcional)
    │   ├── ChordDiagram/     # Diagrama SVG de acorde
    │   └── Common/           # Logo, Button, Modal, Pill, Badge, ProgressBar, Icon
    │
    └── pages/
        ├── Onboarding/       # 4 passos de personalização inicial
        ├── Home/             # Saudação + missão diária + mapa
        ├── Lesson/           # Renderiza blocos da lição (vídeo, quiz, timer, metrônomo, etc.)
        ├── LessonResult/     # Recompensas, conquista e próxima lição
        ├── Practice/         # Cards de treino rápido + missões
        ├── Songs/            # Biblioteca filtrável por categoria
        ├── Progress/         # Estatísticas, gráficos semanais e por unidade
        ├── Ranking/          # Liga semanal + pódio + lista
        ├── Profile/          # Perfil, conquistas, configurações
        └── Premium/          # Plano mensal/anual + comparativo
```

---

## Decisões de design

### Identidade visual própria
- **Cores principais**: verde esmeralda (`brand`), azul midnight, branco e cinzas suaves; âmbar para recompensas.
- **Tipografia**: Plus Jakarta Sans (display) + Inter (texto).
- **Cada unidade do mapa tem cores próprias** (floresta, pôr do sol, oceano, crepúsculo, palco) — cria sensação real de jornada.
- **Mapa em trilha vertical** com nodes alternados, glow na fase atual, check nas concluídas, cadeado nas bloqueadas.

### Mobile-first com moldura premium no desktop
- No celular, o app ocupa a tela inteira.
- No desktop, o app é centralizado em um shell de 480px com cantos arredondados, simulando uma tela premium.

### Gamificação real, não decorativa
- Concluir uma lição realmente:
  - soma XP no usuário
  - desbloqueia a próxima lição no mapa
  - consome 1 energia (se não Premium)
  - avança missões diárias e semanais
  - pode desbloquear uma conquista
- Energia regenera no tempo real (mockada em 4/5).
- Premium libera energia ilimitada.

---

## Preparado para evoluir

A arquitetura foi pensada para que cada uma das funcionalidades futuras se conecte sem reescrever o app:

| Funcionalidade futura | Onde plugar |
|-----------------------|-------------|
| Login real / autenticação | Substituir `defaultUser` em `data/user.ts` por fetch após login. `AppProvider` carrega o usuário no boot. |
| Banco de dados real | As ações `completeLesson`, `completeOnboarding`, `togglePremium` viram chamadas de API que persistem no backend. |
| Pagamento / assinatura | `togglePremium` em `AppContext` substitui-se por integração com Stripe / RevenueCat. |
| Reconhecimento de áudio / IA | Novo bloco `LessonBlock.type === 'audio_check'` adicionado em `types.ts` e renderizado em `pages/Lesson/Lesson.tsx`. |
| Notificações push | Já existe estrutura de `Notification` no `AppContext`. Basta integrar Web Push / FCM. |
| Ranking real | Substituir `data/ranking.ts` por endpoint paginado e usar `useEffect` para carregar. |
| Comunidade | Criar nova página em `pages/Community/` e registrar no `App.tsx`. |
| Aulas com professores | Adicionar nova categoria de `LessonType` e novo card em `Practice`. |

---

## Conteúdo mockado incluído

- **5 unidades** temáticas com identidades visuais próprias
- **40 lições** distribuídas por dificuldade
- **10 músicas** em 8 categorias (sertanejo, gospel, pop, MPB, rock, infantil, treino, primeira)
- **12 conquistas** em 4 raridades
- **10 usuários** no ranking semanal (incluindo o usuário principal)
- **3 missões diárias** + **4 missões semanais**
- **8 cards de prática** rápida
- **10 diagramas de acordes** em SVG (Em, G, C, D, Am, E, F, A7, Dm, B7)
- **3 notificações** mockadas

---

## Próximos passos sugeridos

1. **Conectar autenticação** (Supabase / Firebase / Auth.js).
2. **Criar backend** para persistência de progresso (Supabase + Postgres é um bom começo).
3. **Adicionar gravação de áudio** com `MediaRecorder` para futura correção via IA.
4. **Integrar pagamentos** com Stripe Checkout ou RevenueCat.
5. **Notificações** com Web Push para lembretes de prática.
6. **Vídeos reais** em vez do placeholder (Mux / Cloudflare Stream).

---

Feito com cuidado para parecer um produto real, não um protótipo.
