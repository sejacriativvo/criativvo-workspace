---
name: project-criativvoui-painel
description: "CriativvoUI (ex-MazyUI) — painel local da Criativvo, como atualizar, backup e gerar cópia pra cliente"
metadata: 
  node_type: memory
  type: project
  originSessionId: 53526257-b0c9-483a-b3a6-1c9d672c2f3a
---

CriativvoUI é o painel local da Criativvo (pasta `CriativvoUI/` no workspace, antes `MazyUI/`). Roda em localhost:7777 (servidor Node + UI modular ESM/lit-html) e usa o Claude Code como motor. É um fork do MazyUI (Diogo Sabec), por sua vez fork do MazyOS.

**Fatos operacionais importantes:**
- **Rename:** pasta e atalhos viraram "CriativvoUI", mas os nomes INTERNOS dos arquivos (`mazyui-server.mjs`, pasta `mazyui-ui/`) foram mantidos de propósito — renomear quebra imports e o sync. Não renomear esses.
- **Customizações da Criativvo** (tema "setup"/Duolingo, laranja #FF5501, status do servidor, confirmações, rota de delete com lixeira, etc.) vivem em `local-ui.css`, `local-ui.js`, `local-routes.mjs` — a camada protegida que sobrevive ao update. Bugs de sistema corrigidos estão documentados em `criativvo-patches/SISTEMA.md`.
- **Atualizar do Diogo:** o repo `DiogoSabec/sabec-os` é PRIVADO e inacessível, então `/atualizar-sistema` não roda. Usar a skill própria `/atualizar-do-diogo`, que puxa do mirror PÚBLICO `github.com/DiogoSabec/MazyUI` preservando local-* e reaplicando os patches.
- **Backup:** remote `backup` → `github.com/sejacriativvo/mazyui-criativvo` (privado, do Matheus). Comando: skill `/backup` (NUNCA `/salvar`, que aponta pro repo do Diogo). `origin` é o repo do Diogo (não tem push).
- **Cliente novo:** skill `/novo-cliente` gera uma cópia LIMPA na hora (não manter pasta zerada parada, que envelhece). Modelo: painel com marca Criativvo, conteúdo com marca do cliente, conta Claude do próprio cliente, onboarding obrigatório.

**Kit de design + onboarding (painel "Estilo dos posts", em `local-ui.js`):**
- O cliente monta um "Kit": **3 a 5 estilos** de slide (12 arquétipos: Editorial, Foto, Sólido, Notícia, Vidro, Número gigante, Revista, Dado, Citação, Tech/terminal, Antes e depois, Gradiente), **paleta** de cores de fundo (parseada do Núcleo do design-guide) e **ritmo do feed** (xadrez/aleatorio/diagonal). Salvo na Receita visual do `identidade/design-guide.md` (`<!-- receita: estilos=...; paleta=...; ritmo=...; configurado=sim -->`).
- **Rodízio:** o `/carrossel` roda entre os estilos E roda a cor de fundo a cada post, nunca repetindo o vizinho, seguindo o ritmo (feed não fica repetitivo).
- **Wizard guiado** (overlay, 5 passos) auto-abre na 1ª vez (quando não há bloco de receita) e tem botão "Refazer onboarding". Fontes mostram texto real (não "Aa") + prévia do par título+corpo junto.
- **Fase 2 (feita):** painel "Atualizar negócio" (em `local-ui.js`, sidebar) com 5 perguntas guiadas + 2 modos ("atualizar o que mudou" incremental / "refazer do zero"). Ao enviar, faz handoff pro chat (preenche `#chat-input` + dispara `#chat-send-btn`) com um prompt que manda a IA mesclar nas memórias `_memoria/empresa|preferencias|estrategia.md` e dizer o que mudou. Os painéis de SISTEMA Negócio/Tom/Estratégia (raw view/edit de `_memoria/*`) continuam existindo.
- **Fase 3 (feita):** aprendizado automático da memória, modo "salva e avisa com desfazer". O motor (instruído no CLAUDE.md da CriativvoUI, zona durável após o último `---`) atualiza `_memoria/*.md` durante o chat e roda `_memoria/.historico/registrar.mjs <arquivo> "<resumo>"`, que faz backup + grava `log.jsonl`. O painel mostra um aviso no canto (banner com Desfazer, via polling de `/api/memoria/historico`) e um feed "Aprendizado recente" no painel Atualizar negócio. Rotas `/api/memoria/historico` e `/api/memoria/desfazer` em `local-routes.mjs` (desfazer restaura o backup). Runtime do histórico (baks/mirror/log) é gitignorado; só `registrar.mjs` vai pro git.

Memória do negócio (empresa/preferencias/estrategia) e identidade já foram preenchidas com os dados reais da Criativvo. Relacionado: [[project_criativvo_sistema_operacional]].
