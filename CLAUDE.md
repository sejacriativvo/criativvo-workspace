# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Criativvo — MazyOS

## O que é esse workspace
Workspace operacional da Criativvo — agência 360 de marketing digital e automação com IA. Aqui é onde o Matheus e o time produzem, automatizam e gerenciam entregas para os clientes.

**Estrutura de pastas:**
- `criativvo/` — pasta da própria agência (espelho do que cada cliente tem)
  - `criativvo/marca/` — identidade visual: design-guide.md, fonte AVEstiana-Black.otf, logos
  - `criativvo/conteudo/` — carrosseis, roteiros e posts da própria Criativvo
  - `criativvo/propostas/` — propostas comerciais geradas em HTML
- `Cliente-Criativvo/` — uma pasta por cliente, organizada por status (`ativos/`, `propostas-enviadas/`, `inativos/`)
  - `Cliente-Criativvo/ativos/gilsoncar-veiculos/` — GilsonCar Veículos (concessionária multimarca, Ibitinga/Borborema - SP) — case principal
  - `Cliente-Criativvo/ativos/pd-motors/` — PD Motors (consultoria/intermediação veicular, Ribeirão Preto)
  - `Cliente-Criativvo/ativos/vr-studio/` — VR STUDIO (remoção de tatuagem a laser e micropigmentação, Curvelo - MG)
  - `Cliente-Criativvo/ativos/feffo-cortinas/` — Fêffo Cortinas (cortinas, roupa de cama e home decor, Ibitinga - SP)
  - `Cliente-Criativvo/ativos/maccari-store/` — Maccari Store (eletrônicos, celulares e tecnologia, Ibitinga - SP)
  - `Cliente-Criativvo/ativos/movisol/` — Movisol (energia solar, Ibitinga - SP)
  - `Cliente-Criativvo/ativos/prime-motors/` — Prime Motors (revenda multimarca premium, Penápolis - SP) — inauguração 30/05/2026
  - `Cliente-Criativvo/ativos/vermeister/` — Vermeister
  - `Cliente-Criativvo/ativos/marcio-albrechete/` — Marcio Albrechete (advogado previdenciário INSS, escritório Previdência APA, Ibitinga - SP)
  - `Cliente-Criativvo/ativos/mariana-medeiros/` — Mariana Medeiros (nutricionista esportiva + NutriChef, receitas sem glúten/lactose/açúcar para mulheres)
  - `Cliente-Criativvo/propostas-enviadas/` — proposta enviada, ainda não fechou (Reinaldo Meirelles, Carvalho Costa Adv)
  - `Cliente-Criativvo/inativos/` — saíram da base
- `automacoes/` — scripts Node (googleapis + open). `drive.js`/`drive-hook.js` para Google Drive. Instalar deps: `npm install --prefix automacoes`
- `dados/` — arquivos de entrada pra análise (relatórios, planilhas)
- `docs/relatorios/` — relatórios mensais gerados em HTML, publicados via **GitHub Pages** em `https://sejacriativvo.github.io/criativvo-workspace/` (sempre incluir esse link ao publicar)
- `agencia-na-hora/` — produto "Agência na Hora": `campanhas/`, `clientes/` (sites entregues), `lp/`, `templates-site/`, `vendas/`. Cada cliente exige design único — nunca clonar template de outro
- `agentes/c-level-squad/` — conselheiros executivos (Vision/COO/CMO/CTO/CIO/CAIO). Versões ativas instaladas em `~/.claude/skills/`
- `Canal do YouTube/` — material do canal próprio
- `tarefas.md` — lista de pendências e próximos passos
- `templates/skills/` — templates de skills prontos pra personalizar (inclui pastas completas como `carrossel/` e `publicar-instagram/` com SKILL.md + scripts)
- `templates/perfis/` — modelos de CLAUDE.md por tipo de negócio (agência, empresa, freelancer, solopreneur)
- `templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis pra usar em skills
- `Cliente-Criativvo/_modelo-cliente/` — estrutura-padrão para cliente novo (kebab-case, sempre copiar daqui)
- `skills-lock.json` — skills externas instaladas via GitHub (emil-design-eng, higgsfield-*)

## Sobre o negócio
Criativvo é uma agência de marketing digital e automação com IA focada em concessionárias e lojas de veículos. Atua como 360: redes sociais, sites Shopify, branding, tráfego pago e automações em uma única solução. Case principal: Gilson Car — maior faturamento da história da empresa + 2 novas unidades após 2 meses de trabalho.

## O que mais fazemos aqui
- Gestão de redes sociais e estratégias de conteúdo para clientes
- Criação de propostas comerciais em HTML
- Desenvolvimento e atualização de sites Shopify
- Gestão de tráfego pago (Meta Ads, Google Ads)
- Automação de onboarding, publicação de posts, relatórios e follow-ups
- Produção de imagens e vídeos com IA

## Clientes e contexto
Atende clientes externos. Nicho principal: concessionárias e lojas de veículos, com expansão para outros segmentos.

**Time (6 pessoas):**
- **Matheus** — Fundador/CEO. Estratégia, relação com cliente, onboarding de cliente novo, templates de design.
- **Victor** — Sócio/Comercial (Closer). Vendas, propostas, reuniões.
- **Alisson** — Tráfego pago + Head de Operações informal (dono do Notion). Futuro sócio.
- **Anderson + Luis** — Produção de posts (templates + fotos de carros vendidos).
- **Dudu** — Audiovisual completo (captação Ibitinga + edição de todos os clientes + posta na Mlabs).

**Carteira ativa (10):** GilsonCar Veículos (case principal), PD Motors, VR STUDIO, Fêffo Cortinas, Maccari Store, Movisol, Prime Motors (inauguração 30/05/2026), Vermeister, Marcio Albrechete (advogado previdenciário), Mariana Medeiros (nutricionista esportiva + NutriChef).

**Propostas enviadas (2, quentes):** Carvalho Costa Adv, Reinaldo Meirelles.

## Sistema Operacional da Criativvo
**Stack confirmada:** Notion (operação do time inteiro) + Google Sheets privada (financeiro Matheus+Victor) + skill `/so-criativvo` (dashboard semanal). Dono operacional: Alisson (Head de Ops).

- Tentativa anterior de build própria (`criativvo-os/` Next.js + Supabase) foi deletada em 2026-05-24 (simples demais)
- Pasta `sistema-operacional/` (templates do Notion, SOPs, DRE) foi deletada em 2026-05-29: já tinha cumprido o papel de setup do Notion e virou peso morto. Operação viva está no Notion + Sheets
- Templates do Notion, SOPs e financeiro agora vivem direto no Notion (importados) e na Sheets privada
- Dashboards semanais são gerados por `/so-criativvo` a partir das pastas de cliente, memórias e CLAUDE.md (não salvam em pasta fixa; output fica na conversa ou em `saidas/` se pedido)

## Tom de voz
Direto, objetivo, humano e persuasivo. Focado em resultados e ROI. Sem travessão (—), sem adjetivos em excesso, sem textos genéricos, sem "cara de IA". Linguagem clara, fundamentada e com aplicação prática.

## Ferramentas conectadas
Shopify, Mlabs, Notion, Canva, Instagram, Facebook. MCPs instalados: *(atualizar conforme instalação)*

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `criativvo/marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Skills do MazyOS

Skills do MazyOS instaladas em `.claude/skills/` (núcleo, conteúdo/SEO, ads e produção):

**Núcleo:**
- `/instalar` — setup inicial do sistema (roda uma vez só; já feito aqui)
- `/abrir` — carrega contexto do negócio no começo de sessão
- `/salvar` — commit + push pro GitHub
- `/atualizar` — varre o projeto e atualiza `_memoria/*`
- `/novo-projeto` — cria pasta de projeto com CLAUDE.md dedicado
- `/mapear-rotinas` — descobre o que se repete e transforma em skill

**Conteúdo e SEO:**
- `/carrossel` — carrosséis 1080×1350 com a identidade da marca
- `/publicar-tema` — tema → artigo de blog + carrossel + 3 legendas
- `/seo` — fluxo completo de SEO em 8 passos
- `/responder-avaliacoes` — respostas humanas pras reviews do Google
- `/aprovar-post` — publica blog + Instagram + Facebook num comando

**Anúncios pagos:**
- `/anuncio-google` — campanha em CSV pronta pro Google Ads Editor
- `/relatorio-ads` — lê exports de Google + Meta e gera relatório semanal

**Produção:**
- `/analisar-dados` — resumo executivo de arquivo (usar com `dados/`)
- `/email-profissional` — email a partir de contexto livre

### Skills próprias da Criativvo (não vêm do MazyOS, manter)
- `/so-criativvo` — dashboard semanal da operação
- `/meta-ads-ratos` — gestão de Meta Ads com dados reais (instalada globalmente)
- `/proposta-comercial` — proposta HTML a partir de briefing (template em `criativvo/propostas/_template-proposta-padrao.html`)
- C-Level Squad (conselheiros executivos, instalados globalmente): `vision-chief`, `coo-orchestrator`, `cmo-architect`, `cto-architect`, `cio-engineer`, `caio-architect`

---

## Regras operacionais (não esquecer)

**Copy:**
- Nunca usar travessão "—". Substituir por vírgula ou reestruturar a frase
- Tom: direto, objetivo, humano, persuasivo. Sem "cara de IA"

**Entrega de posts:**
- Sempre renderizar HTML → JPG (Brave headless + sips). Nunca entregar HTML cru
- URL-encodar `+` e espaços no `src` das imagens
- Verificar visualmente que a logo aparece no JPG final

**Logo Criativvo:**
- Sempre minúsculo ("criativvo")
- Fonte AVEstiana-Black (`criativvo/marca/AVEstiana-Black.otf`)
- Letter-spacing levemente reduzido

**Agência na Hora:**
- Cada cliente exige design único — nunca clonar estrutura, fonte ou estética de outro cliente
- Logo oficial da marca: `agencia-na-hora/marca/logo-branca.png` (símbolo branco, fundo transparente)
- Carrossel da Agência na Hora segue SEMPRE o design system editorial tech academy (escuro + verde limão), via skill `/carrossel-agencia-na-hora`. Spec em `agencia-na-hora/marca/design-system-carrossel.md`, template em `marca/template-carrossel.html`. Paleta de conteúdo (`#071016`/`#F4F2EC`/`#EFFF7A`/`#004CFF`) é diferente da corporativa (laranja `#ff5a1f`, só docs internos)

**Cliente novo:**
- Copiar `Cliente-Criativvo/_modelo-cliente/`, nome em kebab-case, dentro de `Cliente-Criativvo/ativos/`

**Publicação de relatório/site:**
- Destino padrão é GitHub Pages: `https://sejacriativvo.github.io/criativvo-workspace/`
- Sempre incluir o link na entrega

**Marketing jurídico (Marcio Albrechete e similares):**
- Provimento OAB 205/2021: sem captação ostensiva, sem garantia de resultado, sem mercantilização, cases sempre anonimizados

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (quem são os clientes, como funciona a empresa, serviços, mercado) → adicionar em `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato de resposta, o que evitar, como estruturar textos) → adicionar em `_memoria/preferencias.md`
- **Sobre prioridades e foco atual** (projetos em andamento, metas do momento, prazos importantes, o que é prioridade agora) → adicionar em `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** (onde salvar arquivos, como nomear, fluxos específicos) → adicionar no próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar o que foi salvo mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante no projeto (novo cliente, nova skill, mudança de foco, novo processo, ferramenta instalada, estrutura de pastas alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize os arquivos de memória?"

Se sim, identificar o que precisa atualizar:

- **Novo cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Correção de tom ou estilo** → `_memoria/preferencias.md`
- **Nova pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Mudança visual (cores, fontes, logo)** → `criativvo/marca/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais que não mudam o contexto (ex: escrever um email, criar um post avulso)
- Perguntas simples ou conversas sem ação
- Mudanças que já foram salvas pelo bloco "Aprender com correções"

**Dica:** se o usuário não sabe se algo mudou, rodar `/atualizar` faz uma varredura completa.

---

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
