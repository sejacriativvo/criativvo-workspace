---
name: feedback-agencia-na-hora-carrossel
description: "Design system fixo de carrossel da Agência na Hora (editorial premium, art-directed)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 89baeabc-3ac8-466c-96c6-f13b1d4a2c8f
---

Todo carrossel da Agência na Hora segue um design system fixo, editorial premium, art-directed slide a slide (cara de agência criativa de ponta, nunca template genérico). Gerar via skill `/carrossel-agencia-na-hora`.

**Why:** o Matheus definiu e refinou esse padrão em 2026-06-01 e quer todos os carrosséis coesos, premium e estratégicos.

**How to apply:** ler `agencia-na-hora/marca/design-system-carrossel.md` (fonte da verdade) e copiar a implementação validada `redes-sociais/posts/presenca-que-vende/carrossel.html` + `modelos-fundo-solido.html`. Slide 1080×1440 (ou 1350). Paleta SEM AZUL: escuro #071016, branco #F4F2EC, verde limão #EFFF7A (único acento), cinzas. Tipografia (aprovada): **Bricolage Grotesque** títulos (74–108px, palavra-chave em limão) + **Geist** corpo. Fontes locais em `marca/fonts/`, embutidas via @font-face. Identidade fixa em todo slide: header logo+wordmark (logo-branca em fundo escuro, logo-escura em claro) + índice `02 / 06`; rodapé @agencianahora + ícones coração/salvar. Tipos de slide: foto full-bleed, statement sólido (limão/creme/escuro), número gigante (ex. 9/10), lista numerada, CTA com círculo. VARIAR composição e alinhamento por slide (topo/esquerda/direita/base), nunca repetir.

Direção de arte: imagem SEMPRE relevante ao tema (nada de stock genérico); imagem COMPLETA + degradê preto só atrás do texto; sujeito criando zona limpa pro texto; tipografia forte com quebras intencionais; sólido nunca vazio; margens generosas e assimetria. Imagens criativas, coloridas e dinâmicas geradas no **Higgsfield** (`generate_image` modelo `nano_banana_pro`, 3:4, 2k, ~2 créditos). Logo embutida na cena passando `marca/logo-silhueta.png` como referência (`media_upload`+`medias` role image) — ex. vaca malhada com mancha no formato da logo. Texto sempre no layout, nunca na imagem. Renderizar HTML→JPG com `--virtual-time-budget` e cortar com PIL.

Relacionado: [[project-agencia-na-hora-logo]], [[feedback-agencia-na-hora-unico-por-cliente]], [[feedback-escrita-sem-travessao]].
