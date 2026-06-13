---
name: maccari-roleta-feira
description: "Roleta de prêmios + painel da Maccari pra feira de Ibitinga, no ar na Vercel"
metadata: 
  node_type: memory
  type: project
  originSessionId: 802f927a-fe8b-402d-b8d8-b207f461ceb6
---

Campanha de roleta de prêmios da Maccari Store pra feira de Ibitinga: a pessoa escaneia o QR do painel, gira a roleta e ganha na hora.

**Site da roleta no ar:** **https://feira-roleta.vercel.app** (Vercel, conta `marketinggilsoncar-3600` / scope `gilson-car-s-projects` / projeto `feira-roleta` — mesma conta do [[project_gilsoncar_vendas_app]]).

**LINK FIXO (crítico):** o QR aponta pro domínio de produção `feira-roleta.vercel.app`, que **não muda entre deploys**. Toda atualização tem que sair da pasta `feira-roleta/` (vinculada pelo `.vercel/`). Redeploy: `npx vercel@54.9.1 deploy --prod --yes`. Nunca apagar `.vercel/` nem o projeto, senão o QR impresso quebra.

**Arquivos:** `Cliente-Criativvo/ativos/maccari-store/feira-roleta/` (index.html + logo.png + fachada.jpg + AVEstiana-Black.otf + qr-feira.png/svg + LEIA-ME.md). Painel da arte em `maccari-store/painel-feira/` (arte.html → painel-amarelo-v3.jpg, 1,45m × 2,20m).

**Identidade visual (definida pelo Matheus):** fundo amarelo da marca **#E6E540**, preto #141312, vermelho #D20000, logo Maccari em preto (silhueta, `filter:brightness(0)`), Montserrat. Estilo clean/editorial (inspirado nos slides do YouTube dele), tudo grande pra ler de longe no telão. Roleta em vermelho/preto/creme.

**Página da roleta tem:** banner da fachada real, form (1 giro por WhatsApp, trava localStorage), prêmios, código de resgate, botões "ver a loja" (maccaristore.com.br) + "WhatsApp" (5516997123537), e barra fixa da **Criativvo** no rodapé que alterna entre a logo "criativvo" (fonte AVEstiana) e "Fale com a Criativvo" (→ instagram.com/sejacriativvo).

**Prêmios/pesos atuais:** 10% OFF (30) · 5% OFF (26) · brinde próxima compra (16) · combo capinha+película (12) · brinde surpresa (12) · iPhone 17 Pro Max com 10% OFF =R$7.890 (4, raro). Fatias iguais na tela, chance = peso. Editável em `PRIZES` no index.html.

**Pendente:** plugar `LEAD_ENDPOINT` (Google Apps Script) pra capturar os WhatsApps. Confirmar com o Matheus a lista final de prêmios. Fazer variante do painel com a fachada integrada.
