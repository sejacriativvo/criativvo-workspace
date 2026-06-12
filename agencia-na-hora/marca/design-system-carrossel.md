# Design System de Carrossel — Agência na Hora

Padrão visual obrigatório de todo carrossel da Agência na Hora. Estética: editorial, moderna, premium, estratégica, Instagram-native. Deve parecer carrossel de agência criativa de ponta, art-directed slide a slide, nunca template genérico de Canva.

> Fonte da verdade. Implementação de referência validada: `redes-sociais/posts/presenca-que-vende/carrossel.html` (5 slides art-directed) e `modelos-fundo-solido.html` (modelos de fundo sólido). A skill `/carrossel-agencia-na-hora` gera a partir destas regras.

## Formato

- Slide **1080×1440** (3:4) por padrão; **1080×1350** quando pedido. Cada slide é uma `<section>` `position:relative; overflow:hidden`, tamanho fixo.
- Margem interna generosa: padding 84px. Imagens `object-fit:cover`. `z-index` organizado.

## Paleta (variáveis CSS) — SEM AZUL

```css
:root{
  --escuro:#071016;  --branco:#F4F2EC;  --branco-suave:#EDEAE2;
  --lima:#EFFF7A;     /* verde limão: cor de acento, palavras-chave, stats */
  --cinza:#5b656d;    --cinza-claro:#9aa3a8;
}
```

Não usar azul (foi removido da paleta). Acento é sempre o verde limão. Em fundo escuro o texto é branco; em fundo claro (limão/creme) o texto é escuro. Cores fora da paleta só tons da própria foto.

## Tipografia — 2 fontes que combinam (embutidas em `marca/fonts/`)

- **Display (títulos):** `Bricolage Grotesque` (700/800) — grotesque premium com personalidade. Títulos 74–108px, line-height ~0.98, letter-spacing -2 a -3.5px. Quebras de linha intencionais. Palavra-chave em verde limão (em fundo escuro) ou em caixa escura (em fundo claro).
- **UI/corpo:** `Geist` (400/500/600/700) — sans moderna e limpa. Subtítulos 31–33px, eyebrow/microtexto 700 caixa alta letter-spacing 4px, body em cinza.

Renderizar com as fontes locais (`@font-face`), nunca depender de webfont externa (headless não carrega a tempo).

## Identidade fixa (consistente em TODOS os slides)

- **Header:** logo (símbolo ~56px) + wordmark empilhado no topo esquerdo: "agência" (peso fino) em cima, "na hora™" (peso bold) embaixo, bem juntinho (line-height ~0.9). Logo branca (`marca/logo-branca.png`) em fundo escuro; logo escura (`marca/logo-escura.png`) em fundo claro. **A cor da logo e do wordmark sempre acompanha a cor dos textos do slide** (texto branco → logo e nome brancos).
- **Eyebrow (texto acima da headline):** não deixar miúdo, ~18–19px, letter-spacing 3.5px, caixa alta.
- **Índice de página** topo direito, formato `02 / 05` (número ativo em verde limão no escuro).
- **Rodapé:** `@agencianahora` à esquerda + ícones de coração e salvar à direita.
- Mesma lógica de header, rodapé, espaçamento e ícones em todos os slides. A composição do miolo varia; a identidade não.

## Tipos de slide (escolher o ideal por página)

**Slides de foto (full-bleed)** — abertura, gancho, emocional/contexto:
1. **Hook / capa** foto relevante full-bleed, sujeito posicionado pra deixar zona limpa, headline grande na zona livre, acento limão, overlay/gradiente só atrás do texto.

**Slides sólidos (limão / creme / escuro)** — afirmações, pontos estratégicos, método, CTA:
2. **Statement (limão)** frase de impacto gigante em Archivo Black escuro, divisor curto acima.
3. **Lista estruturada (escuro)** título + lista numerada (01–04) com número em limão, item branco, descrição cinza, linhas divisórias. (Substitui cards de vidro genéricos.)
4. **Ponto estratégico (creme)** tag-badge + título com destaque em caixa escura numa palavra + texto de apoio.
5. **Stat (escuro)** número gigante em limão + texto curto de apoio.
6. **CTA (escuro)** eyebrow limão + título grande + bloco CTA (círculo limão com seta) + handle/ícones.

Sempre variar a composição entre páginas (alternar foto/sólido, posição do texto, cor de fundo) pra criar ritmo. Nunca repetir a mesma composição em todas.

## Direção de arte (regras inegociáveis)

1. **Imagem relevante ao tema.** Nunca stock aleatório nem "pessoa no escritório". A foto representa o assunto exato do slide e reforça a mensagem.
2. **Composição estratégica da foto.** Sujeito à esquerda, direita ou metade inferior, deixando bloco limpo pro texto. Cropar/escalar/deslocar pra criar zona de leitura. Texto nunca sobre rosto, mãos ou área detalhada. Overlay/gradiente sutil só atrás do texto.
3. **Tipografia forte e intencional.** Títulos grandes ocupando espaço com confiança, hierarquia clara, quebras de linha por ritmo, palavra-chave em limão. Nada de texto pequeno perdido em área enorme.
4. **Sólido não é vazio.** Minimal com composição forte: metadados no topo, divisor, badge, número de passo, handle, ícones. Tensão e estrutura visual sempre.
5. **Posicionamento do texto.** Margens generosas, max-width pra linhas elegantes, alinhamento consistente, assimetria editorial. Texto parece colocado por designer, não auto-centralizado.
6. **Consistência.** Mesma lógica de tipografia, espaçamento, header, rodapé e ícones em todo o carrossel. Identidade constante, composição variável.
7. **Mix de slides:** foto full-bleed + sólido minimalista + headline forte + explicação estruturada.

### Não fazer
Imagem irrelevante; texto sobre área cheia; slide vazio/preguiçoso; centralizar tudo por padrão; cara de template Canva; formas decorativas sem função; quebras de linha ruins; foto competindo com a tipografia; azul.

## Imagens de fundo (gerar com IA — Higgsfield)

Nunca usar stock genérico. Gerar imagens criativas, **coloridas e dinâmicas**, via Higgsfield `generate_image` modelo `nano_banana_pro` (3:4, 2k). Custo ~2 créditos/imagem.

- **Imagem completa + degradê só atrás do texto.** A foto aparece inteira (sem corte estranho); o degradê preto/cor entra apenas na zona onde o texto vive, pra legibilidade.
- **Logo embutida na cena.** Subir a logo (`marca/logo-silhueta.png`) via `media_upload`/`media_confirm` e passar como `medias` role `image`. Pedir no prompt pra logo virar elemento físico da cena (ex.: vaca malhada onde uma mancha preta tem o formato da logo). Funciona muito bem no nano_banana_pro.
- **Composição pensada pro texto:** sujeito de um lado, zona limpa do outro pro título. O texto NUNCA sobrepõe o sujeito (rosto/focinho/objeto). Degradê/scrim só local, atrás do texto, nunca na imagem inteira.
- **Mascote oficial: a vaca malhada (Holstein)** com a mancha no formato da logo. Dar elementos humanos pra ela (óculos escuros, camisa jeans, roupa de trabalhador) e cenários variados e coloridos (estúdio de cor chapada, pasto com girassóis, etc.). Usar e abusar da criatividade.

Antes de gerar, pensar 5–10 conceitos e escolher o mais forte por: 1) relação com o tema 2) originalidade 3) impacto visual 4) espaço pro texto 5) potencial de cor. Tipos de conceito: cena literal dirigida; objeto comum transformado; metáfora visual direta; surreal crível; foto aérea com mensagem na paisagem; editorial de moda com cor forte; fundo minimal com 1 objeto forte; ambiente com a marca integrada fisicamente. Pensar como diretor de arte, não gerador de template. Preferir o que faz parar o scroll.

## Variações (nunca repetir a mesma composição)

Alternar entre páginas: alinhamento do texto (topo / esquerda / direita / base), número gigante (ex.: `9/10`, `2x`), fundo só de cor (limão/creme/escuro), imagem full-bleed, lista numerada. Mix obrigatório pra dar ritmo.

## Processo (decidir ANTES de montar cada slide)

1. Foto ou fundo sólido?
2. Qual imagem representa melhor o tema (se foto)?
3. Onde o sujeito senta e onde o texto vive sem conflito?
4. Montar o layout. Otimizar slide a slide, sem reusar a mesma composição.

**Prioridade:** 1) relevância da imagem 2) composição estratégica 3) posicionamento limpo do texto 4) hierarquia forte 5) identidade consistente.

## CSS

CSS puro, variáveis pra cores, classes reutilizáveis (modos `.dark`/`.lima`/`.cream`), comentários marcando onde trocar foto/título/texto/CTA. Renderizar HTML→JPG (Brave headless + `--virtual-time-budget` pra fontes carregarem; cortar com PIL em faixas de 1440). Entregar JPGs + legenda (até 5 hashtags, incluir `#agencianahora`).
