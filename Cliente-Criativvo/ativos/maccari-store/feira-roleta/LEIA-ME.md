# Roleta da Feira — Maccari Store

Página de roleta de prêmios pra feira de Ibitinga. A pessoa escaneia o QR do painel, preenche nome + WhatsApp, gira e ganha um prêmio na hora.

**No ar em:** https://feira-roleta.vercel.app

## ⚠️ O LINK NUNCA MUDA (o QR impresso está seguro)
O QR aponta pro domínio fixo de produção `feira-roleta.vercel.app`. Esse endereço **não muda quando o site é atualizado**. A cada alteração, o que muda é só o conteúdo; o link continua o mesmo, então o QR já impresso na arte **continua funcionando pra sempre**.

Pra isso continuar verdade, toda atualização tem que ser feita **sempre desta mesma pasta** (que está vinculada ao projeto Vercel `feira-roleta` pela pasta oculta `.vercel/`). Nunca apagar a pasta `.vercel/` nem renomear/excluir o projeto no Vercel.

### Como atualizar o site mantendo o mesmo link/QR
De dentro desta pasta (`feira-roleta/`):
```
npx vercel@54.9.1 deploy --prod --yes
```
A saída mostra `Aliased https://feira-roleta.vercel.app` (o link de sempre). Pronto.

## Prêmios e chances (edita no topo do `<script>` do index.html, em `PRIZES`)
| Prêmio | Peso | Chance aprox. |
|---|---|---|
| 10% de desconto | 30 | ~30% |
| 5% de desconto | 26 | ~26% |
| Brinde na próxima compra | 16 | ~16% |
| Capinha + película grátis (combo) | 12 | ~12% |
| Brinde surpresa | 12 | ~12% |
| iPhone 17 Pro Max (10% OFF, R$ 7.890 + capa e película) | 4 | ~4% |

As fatias têm o mesmo tamanho na tela (o iPhone vermelho chama atenção), mas a chance real é o **peso**. Quanto maior o peso, mais cai. Pra deixar o iPhone mais raro, baixa o peso dele. Brindes físicos (combo, surpresa) com peso menor pra não sangrar num dia cheio.

> O iPhone é honesto: quem cai nele ganha o iPhone com 10% OFF, não o aparelho de graça.

## O que tem na página
- Banner com a foto da fachada (prova de loja física real)
- Form (nome + WhatsApp) que libera **1 giro por número**
- Roleta, prêmio na hora e **código de resgate** pro estande
- Botões pra **ver a loja** (maccaristore.com.br) e **falar no WhatsApp**
- Barra da **Criativvo** no rodapé (mini propaganda interativa, leva pro @sejacriativvo)

## Receber os contatos numa planilha (opcional)
Sem isso a roleta funciona, mas o lead fica só no celular da pessoa. Pra cair numa Google Sheet:
1. Cria uma Sheet com colunas: `data | nome | whatsapp | premio | codigo`
2. Extensões → Apps Script, cola:
```javascript
function doPost(e){
  var d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([d.data, d.nome, d.zap, d.premio, d.codigo]);
  return ContentService.createTextOutput('ok');
}
```
3. Implantar → Nova implantação → App da Web → Executar como: Eu · Acesso: Qualquer pessoa
4. Copia a URL `/exec`, cola em `const LEAD_ENDPOINT = "";` no index.html
5. Redeploy (comando acima). Cada giro cai na planilha.

## Arquivos
- `index.html` — a página
- `logo.png` · `fachada.jpg` · `AVEstiana-Black.otf` (fonte da logo Criativvo)
- `qr-feira.png` / `qr-feira.svg` — QR pro painel (manda o SVG pra gráfica)
