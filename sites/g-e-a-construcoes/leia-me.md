# G e A Construções — site (Linho & Argila)

Landing page única pra construtora de alto padrão. Tudo num arquivo: `index.html` (sem build, sem dependência local).

## Como abrir
Dois cliques em `index.html`, ou no terminal:
```
open "index.html"
```

## Direção de design
Estética editorial clara, inspirada em portfólios premiados de arquitetura (Awwwards): fundo claro quente, tipografia serifada grande, imagens dominando a página. **Scroll 100% nativo** (sem smooth scroll de biblioteca, que travava a rolagem na versão anterior).

## O que tem dentro
- **Hero** com título em 3 linhas reveladas + imagem grande com parallax sutil
- **Stats** com contadores (17 anos / 94 obras / 240 mil m² / 100% no prazo)
- **Serviços** em lista editorial com imagem flutuante seguindo o mouse (desktop)
- **Obras** em grid assimétrico (5 projetos) com zoom e parallax nas fotos
- **Método** em 5 etapas com coluna sticky (seção escura)
- **Diferenciais** em 6 cards que invertem pra escuro no hover
- **Depoimento**, **FAQ** acordeão (6 perguntas reais do nicho) e **contato** com formulário que abre o WhatsApp com a mensagem pronta
- Header que esconde ao descer e volta ao subir, menu mobile fullscreen, botão flutuante de WhatsApp, barra de progresso
- Responsivo (375/768/1024/1440), respeita `prefers-reduced-motion`

## Stack (via CDN, precisa de internet na 1ª carga)
- GSAP + ScrollTrigger (só parallax leve, transform-only)
- IntersectionObserver nativo pros reveals (leve, sem lib)
- Google Fonts: Fraunces (títulos, variável com optical sizing) + Inter (texto/UI)
- Fotos: Unsplash (links diretos, todos testados retornando 200)

## O que trocar antes de publicar
- **WhatsApp**: buscar por `5500000000000` (aparece 3x: link do contato, botão flutuante e envio do formulário)
- **Contato**: e-mail, endereço, CNPJ e CREA são placeholders. Buscar por `geaconstrucoes`, `00.000.000`, `CREA-SP`
- **Projetos**: nomes/locais/m² são fictícios. Trocar textos e as `src` das imagens pelas obras reais
- **Números**: atributo `data-count` na seção `.stats`
- **Depoimento**: trocar pelo de um cliente real

## Paleta (Verdemar & Sálvia)
Fundo `#EDF1ED` (linho esverdeado) · fundo 2 `#E1E8E3` · tinta `#16211C` (grafite verde) · cinza esverdeado `#4F5C55` · acento verde petróleo `#2A6B5B` (claro) / verde água `#7DC9B4` (sobre fundo escuro) · escuro `#13211C`.
O acento muda de tom conforme o fundo: petróleo profundo nas seções claras, verde água brilhante nas escuras (método, contato, rodapé), via re-escopo da variável dentro de `.dark`.

## Créditos das fotos
Imagens do Unsplash (uso livre). Ao publicar comercialmente, conferir a licença de cada autor ou substituir pelas fotos das obras reais.
