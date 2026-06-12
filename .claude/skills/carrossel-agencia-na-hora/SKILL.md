---
name: carrossel-agencia-na-hora
description: >
  Gera carrosséis da Agência na Hora no design system editorial premium (escuro + verde limão, sem azul).
  Cria slides em HTML/CSS puro 1080x1440, art-directed slide a slide, renderiza em JPG e entrega legenda.
  Tipografia Archivo Black (títulos) + Manrope (corpo), logo nos slides, mix de slides de foto e sólidos.
  Use quando o usuário pedir "carrossel da Agência na Hora", "post da agência na hora", ou um carrossel
  no contexto da Agência na Hora. Tema vem do usuário; o sistema visual é sempre o mesmo.
---

# /carrossel-agencia-na-hora

Gera carrossel da **Agência na Hora**. Visual fixo, conteúdo adaptado ao tema. Deve parecer carrossel de agência criativa de ponta, nunca template genérico.

## Fontes da verdade (ler SEMPRE antes de gerar)

- Regras completas: `agencia-na-hora/marca/design-system-carrossel.md`
- Implementação validada: `agencia-na-hora/redes-sociais/posts/presenca-que-vende/carrossel.html` (5 slides art-directed) + `modelos-fundo-solido.html`
- Fontes locais: `agencia-na-hora/marca/fonts/` (archivo-black + manrope). Logo: `marca/logo-branca.png` (fundo escuro) e `marca/logo-escura.png` (fundo claro).

Copiar a estrutura/CSS da implementação validada e trocar só conteúdo. Não inventar estilo novo.

## Resumo do sistema

- Slide 1080×1440 (ou 1080×1350 se pedido). Padding 84px. CSS puro, variáveis, classes reutilizáveis, modos `.dark`/`.lima`/`.cream`.
- Paleta SEM AZUL: escuro #071016, branco #F4F2EC, verde limão #EFFF7A (acento), cinzas. Acento sempre limão.
- Tipografia: **Bricolage Grotesque** (títulos 74–108px, letter-spacing negativo, palavra-chave em limão) + **Geist** (corpo/UI). Fontes locais em `marca/fonts/`.
- Identidade fixa em todos: header com logo + wordmark (topo esq.) + índice `02 / 05` (topo dir.); rodapé com `@agencianahora` + ícones coração/salvar.

## Tipos de slide (escolher por página, variar composição)

- **Foto full-bleed** (hook/abertura/emocional): imagem relevante ao tema, sujeito posicionado deixando zona limpa, headline na área livre, overlay só atrás do texto.
- **Statement limão**: frase de impacto gigante.
- **Lista numerada escura**: 01–04, número em limão (em vez de cards de vidro).
- **Ponto creme**: badge + título com destaque em caixa escura + apoio.
- **Stat escuro**: número gigante limão + apoio.
- **CTA escuro**: eyebrow + título + bloco CTA com círculo limão e seta.

## Direção de arte (não negociar)

1. Imagem SEMPRE relevante ao tema (nunca stock genérico de escritório). 2. Composição estratégica: sujeito cria espaço pro texto; texto nunca sobre rosto/área cheia. 3. Tipografia forte, hierarquia clara, quebras de linha intencionais. 4. Sólido nunca vazio: estrutura com badge/divisor/metadados. 5. Margens generosas, max-width, assimetria editorial. 6. Identidade constante, composição variável. 7. Mix de foto + sólidos pra criar ritmo.

## Processo

1. Definir tema, nº de slides e sequência (alternando foto/sólido pra ritmo).
2. Para cada slide decidir: foto ou sólido? qual imagem? onde o sujeito senta? onde o texto vive sem conflito? Então montar.
3. Imagens: gerar criativas, coloridas e dinâmicas via Higgsfield `generate_image` (`nano_banana_pro`, 3:4, 2k, ~2 créditos). Imagem COMPLETA + degradê só atrás do texto. Embutir a logo na cena: subir `marca/logo-silhueta.png` via `media_upload`/`media_confirm` e passar como `medias` role `image` (ex.: vaca malhada com mancha no formato da logo). Pensar 5–10 conceitos e escolher o mais forte. Texto fica no layout, não na imagem. Baixar pra `posts/<tema>/assets/`.
4. Copy no tom da Criativvo: direto, humano, sem travessão (—).
5. Renderizar HTML→JPG e validar visualmente cada slide.
6. Entregar JPGs + legenda (até 5 hashtags, incluir `#agencianahora`).

## Renderização

```bash
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
"$BRAVE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=9000 --window-size=1080,7200 --screenshot="_full.png" "file://CAMINHO/carrossel.html"
# cortar em faixas de 1440 com PIL e exportar JPG (sips cropOffset não é confiável)
```

Usar `--virtual-time-budget` pra as fontes locais carregarem. Cortar com PIL (`im.crop((0,i*1440,1080,i*1440+1440))`), não com sips.
