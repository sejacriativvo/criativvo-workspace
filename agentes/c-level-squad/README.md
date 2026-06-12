# C-Level Squad (G4 Business)

Time de 6 conselheiros executivos virtuais baixados da G4 Business. Cada agente representa um C-Level com frameworks reais (OKR, STP, Vision-Mission-Strategy cascade, scaling readiness, etc).

## Status: instalado como skills globais

Os arquivos `.md` nesta pasta sao os **originais** (referencia). A versao operacional foi convertida em skills Claude Code globais em `~/.claude/skills/`:

| Agente | Skill (slug) | Quando ativar |
|--------|--------------|---------------|
| 👔 Vision Chief | `vision-chief` | Estrategia CEO, visao, fundraising, cultura, M&A, board, pivot |
| ⚙️ COO Orchestrator | `coo-orchestrator` | Operacao, escala, OKR, KPI, processo, gargalo, organograma |
| 📣 CMO Architect | `cmo-architect` | Posicionamento, branding, GTM, funil, CAC/LTV, conteudo |
| 🔧 CTO Architect | `cto-architect` | Stack, arquitetura, build vs buy, divida tecnica, ADR |
| 🖥️ CIO Engineer | `cio-engineer` | LGPD, compliance, vendor SaaS, governanca, integracao |
| 🤖 CAIO Architect | `caio-architect` | Estrategia IA, automacao, LLM, RAG, agentes, ROI de IA |

## Como invocar

**Auto-deteccao:** Cada skill tem `description` rica com palavras-chave. Quando voce mencionar termos do tipo "estrategia da Criativvo", "tenho gargalo na operacao", "posicionamento de marca", "build vs buy", "vamos automatizar isso com IA" etc., a skill correspondente e sugerida automaticamente.

**Invocacao direta:** Tambem aceita slash commands `/vision-chief`, `/coo-orchestrator`, `/cmo-architect`, `/cto-architect`, `/cio-engineer`, `/caio-architect`.

## Fluxo recomendado

1. **Comeca pelo Vision Chief** (Tier 0) quando o desafio for amplo ou voce nao sabe qual conselheiro chamar. Ele diagnostica e roteia.
2. **Vai direto no especialista** quando souber o dominio (ex: "tenho um problema de processo" → COO).
3. **Combine multiplos** em decisoes cross-funcionais (ex: lancar app SaaS interno = Vision + CTO + CAIO).

## Adaptacao Criativvo

Cada skill ja foi calibrada pro contexto da Criativvo na secao final do SKILL.md:
- Agencia pequena (1-5 pessoas), nao corporate
- Nicho automotivo + expansao
- Tom direto, sem travessao, sem cara de IA
- Frameworks aplicados a realidade de agencia, nao Fortune 500

## Manutencao

- **Editar a skill ativa:** `~/.claude/skills/<slug>/SKILL.md`
- **Editar a referencia/original:** este diretorio (`ORGANIZACAO/agentes/c-level-squad/`)
- Originais e skills estao desacopladas, entao mudancas em um nao propagam pro outro

## Fonte

Agentes baixados da G4 Business. Estilo "BMad agent" (YAML completo dentro do markdown). Documentos originais preservados aqui pra referencia/historico.
