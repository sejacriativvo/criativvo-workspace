# Organização do workspace — Criativvo no MazyOS

Mapa de onde cada coisa mora e por quê. Use isso pra decidir onde salvar um arquivo novo. Regra de ouro: **se você não sabe onde vai, provavelmente é em `dados/` (entrada) ou `saidas/` (saída pontual). Trabalho de cliente sempre em `Cliente-Criativvo/`.**

## As 4 camadas do workspace

O workspace tem 4 tipos de coisa. Saber em qual camada um arquivo está resolve 90% das dúvidas de organização.

### 1. Sistema (o MazyOS em si — quase nunca mexer na mão)
- `_memoria/` — o cérebro da Criativvo: `empresa.md`, `preferencias.md`, `estrategia.md`. Lido antes de cada resposta.
- `.claude/skills/` — as 15 skills do MazyOS + skills próprias.
- `CLAUDE.md` — regras de operação do workspace.
- `templates/` — modelos reutilizáveis (perfis, skills, marca, catálogo de ferramentas).
- `scripts/` — utilitários que as skills chamam (render, postagem, etc).
- `automacoes/` — scripts Node já existentes (Google Drive).

### 2. Criativvo (a própria agência — o que é NOSSO)
- `criativvo/marca/` — identidade visual da Criativvo (design-guide, fonte, logo).
- `criativvo/conteudo/` — posts, carrosséis e calendário da própria Criativvo.
- `criativvo/propostas/` — propostas comerciais geradas (HTML + assets).
- `Canal do YouTube/` — material do canal próprio.
- `agentes/c-level-squad/` — fonte dos conselheiros executivos (cópias ativas em `~/.claude/skills/`).
- `agencia-na-hora/` — o **produto** "Agência na Hora" da Criativvo (campanhas, criativos, LP, clientes do produto).

### 3. Clientes (o que é DELES — trabalho entregue)
- `Cliente-Criativvo/ativos/<cliente>/` — clientes em operação.
- `Cliente-Criativvo/propostas-enviadas/<cliente>/` — proposta enviada, não fechou.
- `Cliente-Criativvo/inativos/<cliente>/` — saíram da base.
- `Cliente-Criativvo/_modelo-cliente/` — template pra cliente novo.
- Regras completas de pasta de cliente: ver `Cliente-Criativvo/README.md`.

### 4. Entrada e saída (fluxo)
- `dados/` — drop zone: arquivo que você quer que eu leia uma vez (CSV, planilha, PDF, print).
- `marketing/` — produção de marketing das skills (conteúdo, SEO, campanhas).
- `saidas/` — outputs pontuais (análises, rascunhos de email) que não são de cliente nem marketing.
- `docs/` — **raiz do site publicado** (GitHub Pages: `https://sejacriativvo.github.io/criativvo-workspace/`). Tudo aqui vira URL pública. Ver aviso abaixo.

## Onde salvar (tabela de decisão)

| O que é | Onde vai |
|---|---|
| Post/carrossel de um cliente | `Cliente-Criativvo/ativos/<cliente>/redes-sociais/posts/DD-MM-AAAA/` |
| Post da própria Criativvo | `criativvo/conteudo/` |
| Relatório mensal de cliente (pra publicar) | `docs/relatorios/<cliente-slug>/` |
| Proposta comercial | `criativvo/propostas/` |
| Site de cliente que a gente mantém | `Cliente-Criativvo/ativos/<cliente>/site/` |
| Arquivo pra eu analisar uma vez | `dados/` |
| Análise/email gerado, uso pontual | `saidas/` |
| Cliente do produto Agência na Hora | `agencia-na-hora/clientes/<cliente>/` |

## Regras de nomenclatura

- **Pasta de cliente:** sempre kebab-case, sem espaço/acento/maiúscula (`gilsoncar-veiculos`, não `GilsonCar Veículos`). Detalhe e porquê em `Cliente-Criativvo/README.md`.
- **Arquivos com data:** `DD-MM-AAAA` em pasta de post; `<mes>-<ano>` em relatório (`relatorio-abril-2026.html`).
- **Logo:** sempre em `assets/logo/`, nunca solta na raiz do cliente.
- **A marca em texto** continua com a grafia oficial (ex: "GilsonCar Veículos"). Kebab-case vale só pro **nome da pasta**.

## Aviso importante sobre `docs/`

`docs/` é a raiz do GitHub Pages. **Cada arquivo aqui é uma URL pública viva.** Mover ou renomear pasta dentro de `docs/` quebra o link já compartilhado com cliente. Por isso `docs/` tem uma organização própria (por tipo e por slug) e não segue a mesma estrutura de `Cliente-Criativvo/`. Se for reorganizar `docs/`, fazer com redirecionamento, nunca só mover.

---

_Última atualização: 2026-05-28 (migração Ratos → MazyOS + padronização kebab-case dos clientes)._
