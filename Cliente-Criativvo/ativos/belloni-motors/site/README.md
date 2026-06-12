# Belloni Motors — Site

Site institucional premium de uma página (HTML/CSS/JS puro, sem dependências). Abre direto no navegador (`index.html`) e pode ser publicado em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Estrutura
- `index.html` — home (com prévia de 8 veículos em destaque)
- `estoque.html` — **catálogo completo** com coleções e filtros dinâmicos
- `veiculo/<ID>.html` — uma **página de detalhe por carro** (17 páginas, URL própria)
- `styles.css` — design system (branco/preto + vermelho `#EC182F` + verde `#006343`)
- `assets/config.js` — **dados da loja num lugar só** (WhatsApp, Instagram, endereço…)
- `script.js` (home) · `assets/veiculo.js` (galeria) · `assets/search.js` (busca do header) · `assets/estoque.js` (catálogo)
- `assets/` — logo, escudo, favicon, fachadas, foto do dono e `assets/carros/<ID>/` com as fotos

## Catálogo / Estoque (`estoque.html`)
Página de todos os veículos com **coleções** (Todos, SUVs, Sedãs, Hatches, Picapes, Premium, Automáticos, Até R$ 60 mil) e **filtros dinâmicos**: categoria, marca, faixa de preço, ano, quilometragem, câmbio e combustível, mais busca por texto, ordenação (menor/maior preço, mais novo, menor km) e chips de filtros ativos. No celular os filtros abrem num painel lateral. Dados em `assets/estoque-data.js` (gerado junto com as fotos). A busca do header (lupa) usa `assets/search-data.js`.

## O que falta preencher (editar só `assets/config.js`)
| Campo | O que é |
|---|---|
| `whatsapp` | Número real, formato `55` + DDD + número (só dígitos) |
| `instagram` | @ do perfil (sem o @) |
| `telefone` | Telefone para exibição |
| `endereco` / `cidade` | Rua e número / Cidade - UF (a fachada mostra o nº 1342) |
| `horario1` / `horario2` | Horário de funcionamento |
| `mapsQuery` | O que buscar no Google Maps (nome + cidade) |

Esse arquivo vale para o site inteiro (home + todas as páginas de carro). Trocando o WhatsApp ali, todos os botões da home e das páginas de cada veículo passam a usar o número certo.

## Estoque (carros) + páginas de detalhe
Os 17 veículos da seção **Estoque** vêm do Mercado Livre da loja (`mercadolivre.com.br/pagina/belloni_motors`). De cada anúncio foi extraído: **todas as fotos**, a **ficha técnica completa**, os **equipamentos/opcionais** e a **descrição**.

- Cada card da home **leva para uma página própria** (`veiculo/<ID>.html`, URL real, boa para Google e para compartilhar), com galeria (setas, miniaturas, lightbox, swipe no celular), preço, ficha técnica, equipamentos, descrição, botões **"Falar com um vendedor"** (WhatsApp já com a mensagem do carro) + "Ver no Mercado Livre", e uma seção "Outros veículos".
- Fotos em `assets/carros/<ID>/NN.webp`. Dados-fonte em `assets/carros/data/cars-full.json`. Para atualizar o estoque, reextraia do ML e gere as páginas de novo.

## Imagens
Geradas a partir dos arquivos originais da pasta Downloads (10/06/2026): logo com fundo removido, foto do dono recortada via `rembg` e fachadas otimizadas para web. As fotos do WhatsApp (baixa qualidade) foram descartadas a pedido.
