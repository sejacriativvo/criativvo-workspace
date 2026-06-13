---
name: project-marcio-apa-design-system
description: Sistema visual completo aprovado para A·P·A Previdenciário (Marcio Albrechete) - usar como base em TODOS os entregáveis futuros desse cliente
metadata: 
  node_type: memory
  type: project
  originSessionId: 9ffd890c-fc2e-4be6-b7cb-97d064f6d6b8
---

# A·P·A Previdenciário, sistema visual aprovado (2026-05-25, v6)

Identidade visual completa do Marcio Albrechete, **aprovada pelo Matheus** e usada nos templates de posts (v6) e no site. Sempre que produzir qualquer coisa nova pra esse cliente (posts, stories, capa de destaque, banner, e-mail, proposta, qualquer arte), usar esse sistema como base. Não improvisar paleta ou tipografia.

## Paleta (obrigatória)

**Navy (fundo escuro, autoridade):**
- `#142638` navy-950 (mais escuro, base de fundos escuros)
- `#1B3045` navy-900 (texto sobre claro / textos)
- `#243B54` navy-800 (gradiente médio)
- `#2D465F` navy-700 (gradiente claro)

**Bege (palavras-chave, destaques, linhas):**
- `#CDB28E` beige-500 (mais saturado)
- `#D7C0A0` beige-400 (principal, palavras em destaque)
- `#E5D5BE` beige-300 (claro, fundos bege)

**Off-white (NUNCA branco puro):**
- `#F5F4EF` offwhite (principal claro)
- `#ECE7DE` warm-light (fundo seções claras)
- `#FAFAF7` white-soft (cards e elementos)

**Cinzas azulados (textos secundários):**
- `#6F8190` blue-gray
- `#A9B4BC` blue-gray-light

**NUNCA usar:** preto puro `#000`, branco puro `#FFF`, vermelho, verde forte, amarelo, neon, cores saturadas.

## Tipografia

**Serif (títulos, headlines, palavras institucionais, palavra-chave bege):**
- Cormorant Garamond (principal), Playfair Display, Georgia
- Peso 500 ou 600
- `letter-spacing: -0.04em`, `line-height: 0.88 a 1.00`
- Usar itálico em palavras-chave (sofisticação)

**Sans-serif (corpo, micros, CTAs, legendas):**
- Inter (principal), Helvetica Neue, Arial
- Peso 400 ou 500
- `letter-spacing: -0.02em`, `line-height: 1.15 a 1.55`

**Micro-texto (labels uppercase):**
- Inter, 11-13px (web) ou 22px (posts), peso 500
- `letter-spacing: 0.22-0.32em`, uppercase
- Sempre antecedido por `— ` (travessão + espaço)

## Logo / Marca

**A·P·A Previdenciário** (visual com ponto médio Unicode entre as letras).
- Em texto corrido: "A.P.A Previdenciário"
- Em logo: "A·P·A" Cormorant 600 letter-spacing 0.16em + "PREVIDENCIÁRIO" abaixo em Inter 7-12px letter-spacing 0.38em uppercase
- Arquivos SVG: `Cliente-Criativvo/ativos/marcio-albrechete/assets/logo/a-p-a-previdenciario-{dark,light}.svg`

## Padrões fixos

**Cabeçalho dos posts:** `Direito` (canto esquerdo, serif itálico) · `A·P·A + PREVIDENCIÁRIO` (centro, logo textual) · `Previdenciário` (canto direito, serif itálico).

**CTA dos posts:** "Leia a legenda" (Inter 30px) + ícone circular pequeno com `+` (preto/branco invertido conforme fundo). Posicionado canto inferior direito. Variação: seta `↓` em alguns templates (T2). Nunca botão chamativo, sempre discreto editorial.

**Linha fina decorativa:** 96px × 4px, bege ou navy. Variação "duas cores" (off-white + bege lado a lado) em 220×3px pra cabeçalhos importantes.

**Slide number:** Inter 18px, letter-spacing 0.18em, opacity 0.70, canto inferior esquerdo.

## Templates oficiais (11 variações aprovadas)

Arquivo: [templates-posts-marcio-albrechete.html](Cliente-Criativvo/ativos/marcio-albrechete/redes-sociais/templates-posts-marcio-albrechete.html)

Formato: **1080 × 1350 px** (vertical 4:5, padrão carrossel feed Instagram).

| # | Nome | Uso |
|---|---|---|
| T1 | Estatística | % gigante centralizado (dado de autoridade) |
| T2 | Notícia + escada GIGANTE | Notícia/lei (escada vinda do bottom, headline esquerda 2 estilos, CTA seta ↓) |
| T3 | Prancheta + bloco curvo | Checklist / passo a passo |
| T4 | Conceito forte | Mito vs verdade (sans-serif 138px + arcos concêntricos) |
| T5 | Tipográfico "É direito" | Frase manifesto (palavra-chave 360px bege itálico) |
| T6 | Lupa investigativa | Pergunta sobre processo (lupa 720×720 + INSS de fundo) |
| T7 | Arcos grandes | Capa de série / abertura |
| T8 | Risco + ondas | Alerta (texto centralizado + card + ondas navy) |
| T9 | Card duplo | Apresentação institucional (card frase + card stats 13/+2k/+3k) |
| T10 | Marcio foto fundo | Pergunta retórica com Marcio (foto + bloco off-white) |
| T11 | Imagem temática | Dado/notícia com imagem Unsplash + overlay |

**Como usar:** quando Matheus pedir um post novo, abrir o arquivo, identificar qual template casa com o formato pedido (notícia → T2, dúvida → T6, mito → T4 ou T5, autoridade → T9, etc.), copiar o bloco HTML/CSS do template escolhido e substituir o conteúdo. Ver [[feedback-marcio-apa-padrao-posts]].

## Site institucional

Arquivo: [site/index.html](Cliente-Criativvo/ativos/marcio-albrechete/site/index.html). One-page com seções Hero / Sobre / Atuação / Como funciona / Diferenciais / FAQ / Contato / Footer. Animações via Intersection Observer. Botão WhatsApp flutuante + form que envia via WhatsApp. **Placeholders:** WhatsApp como `55SUBSTITUIR_WHATSAPP` (trocar quando Matheus enviar o número real). Email fictício `contato@apaprevidenciario.com.br`.

## Regras OAB (não negociáveis, ver [[feedback-marketing-juridico-oab]])

Em TODO conteúdo (posts, site, copy de qualquer formato):
- CTAs informativos ("tire dúvida", "saiba mais", "leia a legenda", "fale com o escritório"), NUNCA "agende agora", "contrate", "garanta seu direito"
- Sem promessa de resultado, sem mercantilização, sem preço, sem desconto
- Cases sempre anonimizados
- Cuidado com tom sensacionalista

## Fotos do Marcio disponíveis

Em `Cliente-Criativvo/ativos/marcio-albrechete/assets/fotos-posts/`:
- `foto-1-desktop.png` (horizontal)
- `foto-1-mobile.png` (vertical, usado no site seção Sobre)
- `foto-1-sem-fundo.png` (recortada)
- `foto-2.png` (com fundo)
- `foto-2-sem-fundo.png` (recortada, usada no Hero do site e T10)
