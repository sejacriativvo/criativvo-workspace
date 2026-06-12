# Fêffo Cortinas — Loja Oficial Mercado Livre

Estudo da página, ordem de subida, organização de pastas e briefing de foto por peça.

**Âncora de comunicação:** fabricação própria + envio em 1 dia útil. Posicionamento premium, sem desconto.
**Paleta:** `#653E27` marrom escuro · `#86634A` marrom médio · `#E0B291` marrom claro (detalhe) · `#A7A8AD` cinza · `#FFFFFF` branco.
**Tom:** clean, elegante, feminino, editorial de decoração.

---

## Ordem de subida na loja (de cima pra baixo)

A página do ML empilha os componentes na ordem que você adiciona. Esta é a ordem do funil (marca → desejo → navegação → conversão):

| # | Componente no ML | Produzimos arte? | Pasta |
|---|---|---|---|
| 1 | **Cabeçalho** (header da loja) | Sim | `01-cabecalho/` |
| 2 | **Banner principal** (hero) | Sim | `02-banner-principal/` |
| 3 | **Galeria de categorias** | Sim | `03-galeria-categorias/` |
| 4 | **Banner secundário** (3 faixas de diferencial) | Sim | `04-banners-secundarios/` |
| 5 | **Etiquetas do produto** (ambiente comprável) | Sim | `05-etiquetas-produto/` |
| 6 | **Carrossel "Mais vendidos"** | Não, puxa do anúncio | — |
| 7 | **Galeria "Produtos recomendados"** | Não, puxa do anúncio | — |
| 8 | **Clips** (opcional, fase 2) | Vídeo do Dudu | — |

As peças 1 a 5 são as que a gente desenha. As 6 e 7 só precisam que os anúncios certos estejam marcados como destaque dentro do ML.

---

## Especificações confirmadas

Todas as medidas do ML têm versão **desktop** (larga) e **mobile** (própria). Importante: no banner principal a proporção muda muito entre desktop e mobile, então cada foto precisa render nas duas composições.

| Peça | Opção | Desktop | Mobile | Uso recomendado |
|---|---|---|---|---|
| Cabeçalho | única | 1920×100 | 720×160 | sempre |
| Banner principal | **Grande** ✅ | 1920×640 | 600×800 | **hero** (mais impacto) |
| Banner principal | Pequeno | 1920×480 | 600×450 | alternativa mais baixa |
| Banner secundário | **Grande** ✅ | 1500×375 | 600×340 | **3 faixas de diferencial** |
| Banner secundário | Pequeno | 1500×250 | 600×200 | tarja fina (frete/garantia) |
| Etiquetas | única | 1200×800 | — | ambiente comprável |
| Galeria categorias | a confirmar | ~800×800 | — | 6 tiles |

**Minha recomendação:** hero no **Grande** (1920×640 / 600×800) e os 3 diferenciais no secundário **Grande** (1500×375 / 600×340). O pequeno fica de reserva pra uma tarja fina extra de frete/garantia se quiser.

**Atenção à proporção do hero:** desktop 1920×640 é faixa larga (3:1), mobile 600×800 é retrato (3:4). São enquadramentos diferentes da mesma cena, ver briefing abaixo.

**Falta só confirmar:** o tile da galeria de categorias (px na tela).

---

## Briefing de foto por peça

Regra geral: **fundo de luz natural, lateral suave, estilo editorial. Nada de flash duro.** Sempre mandar na maior resolução possível (peso final precisa caber em 10 MB, mas mande o original que eu comprimo).

### 1. Cabeçalho — `01-cabecalho/`
Tela desktop 1920×100 (faixa fina) + mobile 720×160.
- **Não precisa de foto de produto.** É faixa de marca: fundo marrom `#653E27`, logo Fêffo + tagline "Seu ambiente + aconchegante" + 3 selos (Fabricação própria · Sob medida · Envio em 1 dia útil).
- **Único item que preciso de você:** o arquivo do **logo Fêffo** em PNG fundo transparente (versão clara, pra ler no marrom). Sobe em `_logo/`.
- Opcional: 1 close de textura de tecido (linho/voil) bem suave pra usar como detalhe no canto direito. Se mandar, vem horizontal e clarinha.

### 2. Banner principal (hero) — `02-banner-principal/`
Versão **Grande**: desktop **1920×640** (3:1, largo) + mobile **600×800** (3:4, retrato).
- **Foto:** ambiente decorado, sala OU quarto, com **cortina blackout** instalada e luz entrando pela lateral. Editorial, sofisticado.
- **São dois enquadramentos da mesma cena** (a proporção muda demais pra sair de um corte só):
  - **Desktop (largo):** a janela com a cortina na **metade DIREITA**. Metade esquerda calma (parede, lateral de sofá), é onde entra "Fabricação própria · Envio em 1 dia útil" + logo. Foto horizontal, mín. 2400px de largura.
  - **Mobile (retrato):** mesma cena na vertical, cortina ocupando o **centro/baixo** do quadro e o **terço de cima com respiro** (parede/teto) pro texto + logo. Foto vertical, mín. 1200×1600px.
- Não deixar produto importante na zona de texto (esquerda no desktop, topo no mobile).

### 3. Galeria de categorias — `03-galeria-categorias/`
6 tiles quadrados, tela de trabalho **800×800** cada (confirmar).
Uma foto por categoria, **mesma pegada de luz e fundo nas 6** pra ficar coeso:
1. Cortina **blackout**
2. Cortina **voil**
3. **Cobreleito**
4. **Jogo de cama**
5. **Edredom** estampado
6. **Almofadas**
- **Onde posicionar:** produto **centralizado**, com margem generosa em volta. Deixar o **terço inferior** mais calmo, porque o ML escreve o nome da categoria embaixo. Não encostar o produto na borda.
- Fundo neutro e claro (parede clara, cama arrumada, sofá). Nada poluído.

### 4. Banners secundários — `04-banners-secundarios/`
3 faixas de diferencial, versão **Grande**: desktop **1500×375** + mobile **600×340** cada:
1. **Fabricação 100% própria** — foto da fábrica/costura: máquina ou mãos costurando. Foco do elemento à **direita**, esquerda limpa pro texto.
2. **Sob medida** — foto de medição (régua/trena na cortina) ou cortina instalada com caimento perfeito. Elemento à **direita**.
3. **Envio em 1 dia útil + 30 dias de garantia** — foto de embalagem/caixa pronta pra envio ou close do acabamento. Elemento à **direita**.
- Em todas: metade esquerda calma = zona de texto.
- Aqui a gente encaixa, com elegância, o aviso "cortinas não acompanham varão" (provavelmente no banner "Sob medida"), pra evitar cancelamento por expectativa errada.

### 5. Etiquetas do produto — `05-etiquetas-produto/`
1 a 2 imagens **1200×800** (3:2 horizontal).
- **Foto:** ambiente lindo e bem decorado com **vários produtos Fêffo na mesma cena** (cortina + cobreleito/jogo de cama + almofadas). Quanto mais produto comprável aparecendo na foto, melhor.
- **Sem regra de zona de texto** — a marcação a gente posiciona livre em cima de cada produto, como no exemplo que você mandou.
- Luz boa, foco nítido, nada cortado. Quarto montado funciona muito bem.

---

## Status dos insumos

- [x] **Logo Fêffo** em PNG transparente (branca + marrom) → `_logo/` ✅
- [x] **Tamanhos** do banner principal e secundário ✅
- [ ] Px do tile da galeria de categorias (confirmar na tela)
- [ ] As **fotos** seguindo os briefings acima → `_fotos-recebidas/`

Com logo + tamanhos eu já fecho o **cabeçalho** (não depende de foto) e a estrutura de todas as peças. As fotos a gente resolve por parte, na ordem da tabela.
