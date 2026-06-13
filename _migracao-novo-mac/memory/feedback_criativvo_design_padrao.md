---
name: feedback_criativvo_design_padrao
description: "Nova estética visual padrão da Criativvo — blobs, glass cards, Inter, fundo alternado. Substituiu o estilo anterior (Montserrat bold, pilulas, barras laranja)."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8024fb47-c928-4ff6-8215-5025126bc972
---

A partir de maio/2026, o design padrão de posts da Criativvo é o definido em `criativvo/conteudo/templates-nova-estetica.html`.

**Why:** O usuário aprovou o novo visual e declarou: "a partir de agora esse vai ser o padrao de posts da criativvo".

**How to apply:** Todo novo post ou carrossel da Criativvo deve seguir este sistema:

## Fontes
- **Inter** (Google Fonts) — não mais Montserrat
- Títulos: `font-weight:300` (base) com `<b font-weight:800>` para ênfase
- `letter-spacing:-3px` nos títulos, `line-height:0.93`
- Tamanho dos títulos: 80–110px em 1080×1440px

## Paleta
- `--ink: #050505` (preto)
- `--paper: #F7F7F2` (branco quente)
- `--org: #FF5A1F` (laranja — ligeiramente diferente do #FF5501 antigo)
- `--orl: #FF8A4C` (laranja claro)

## Backgrounds — alternar entre:
1. `#050505` (preto profundo) — o mais usado
2. `#0D0D0B` / `#0A0A08` (cinza escuro)
3. `#F7F7F2` (creme/claro)
4. `#FF5A1F` (laranja inteiro) — para posts de posicionamento/marca

## Estrutura obrigatória por post
1. **Topbar:** `criativvo` + `Marketing, IA & Automação` + linha `flex:1` + círculo arrow `↗`
   - `.tb-dk` em fundos escuros e laranja; `.tb-lt` em fundo claro
2. **Pill label:** pequeno, trackeado, com dot colorido
3. **Headline:** grande, light weight, palavras-chave em `<b>` ou cor laranja
4. **Glass card:** `backdrop-filter:blur(28px)`, `rgba(5,5,5,.5)`, `border-radius:40px`
   - Em fundo claro: `.glass-lt` com `rgba(255,255,255,.72)`
   - Em fundo laranja: `rgba(5,5,5,.28)` manual
5. **CTA button:** laranja com texto branco + círculo branco com seta preta
   - Em fundo laranja: invertido — fundo branco + seta preta

## Efeitos obrigatórios
- `filter:blur(90–120px)` nos blobs de fundo
- `backdrop-filter:blur(28px)` nos glass cards
- SVG decorativo (curva, arco de círculo) em opacidade 0.06–0.14
- Sombra: `box-shadow:0 8px 64px rgba(0,0,0,.35)`

## Relacionado
- [[feedback_criativvo_logo_font]] — AVEstiana continua apenas no logo rodapé
- [[feedback_escrita_sem_travessao]] — nunca usar "—"
