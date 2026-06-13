---
name: project-mazyos-migracao
description: "Em 2026-05-28 o workspace migrou do kit Ratos (Claude Code OS) pro MazyOS; clientes viraram kebab-case e \"Site na Hora\" virou \"Agência na Hora\""
metadata: 
  node_type: memory
  type: project
  originSessionId: 7a0d45af-1410-4b79-a062-637c5161a2d4
---

Em 2026-05-28 o workspace deixou de ser o kit Ratos "Claude Code OS" e passou a rodar no **MazyOS** (produto do Vagner, amigo do Matheus; repo `github.com/mazzeoia/mazyos`).

**O que mudou:**
- `_contexto/` → `_memoria/` (mesmo conteúdo: empresa/preferencias/estrategia)
- Criadas `marketing/`, `saidas/`, `scripts/` (pastas padrão MazyOS)
- 15 skills MazyOS instaladas em `.claude/skills/` (núcleo, conteúdo/SEO, ads, produção). As skills leem `criativvo/marca/` no lugar de `identidade/`.
- README e CLAUDE.md rebrandeados pra MazyOS (sem "Ratos de IA" / "Claude Code OS")
- Clientes padronizados pra kebab-case: gilsoncar-veiculos, maccari-store, movisol, vr-studio, feffo-cortinas, pd-motors, carvalho-costa-adv, reinaldo-meirelles
- Produto "Site na Hora" renomeado pra **"Agência na Hora"** (pastas `agencia-na-hora/` e `docs/agencia-na-hora/`)
- `ORGANIZACAO.md` criado na raiz (taxonomia do workspace) + `.gitignore`

**Mantido (não veio do MazyOS, é da Criativvo):** `/so-criativvo`, C-Level Squad, `meta-ads-ratos` (nome preservado pra não quebrar), template `proposta-comercial`.

**Backup pré-migração:** `/Users/matheusvareschi/CLAUDE-CODE-backup-2026-05-28-pre-mazyos`.

**Pendências em aberto:**
- `meta-ads-ratos/.env` está vazio (sem token/app), então Meta Ads e a API do Instagram ainda não funcionam
- `/carrossel` do MazyOS usa Playwright, mas a regra da Criativvo é Brave headless + sips (decidir antes do 1º uso)
- O workspace **não é repositório git localmente** (sem `.git` na raiz). Há repos git aninhados em subpastas (ex: site da Mariana). Repo publicado: `sejacriativvo/criativvo-workspace`.

Relacionado: [[feedback-clientes-organizacao]], [[reference-github-pages]].
