---
name: reference-maccari-shopify-mcp
description: "Maccari Store tem Shopify conectado via MCP local shopify-maccari (Dev Dashboard, client credentials). Domínio, scopes e como reconfigurar."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 57af6c94-9e9d-40cc-9fc9-deb0c9c85b42
---

A loja **Maccari Store** está conectada ao Claude via MCP de Admin da Shopify.

- **MCP:** `shopify-maccari` (pacote `shopify-mcp` do GeLi2001, via `npx -y shopify-mcp`), escopo **local** (em `~/.claude.json`, NÃO commitado no `/salvar`).
- **Domínio canônico (API):** `0ju4im-ta.myshopify.com` (também responde `maccaristore.myshopify.com`; domínio público primário é `maccaristore.com.br`).
- **Auth:** app do **Shopify Dev Dashboard** (`dev.shopify.com`) com **client credentials grant**. O servidor troca Client ID + Secret por um `shpat_` de 24h e renova sozinho. Não existe token estático.
- **Client ID:** `6d56670ffe8131ede661f3a9705636c8` (o Client Secret NÃO fica salvo aqui, só no `~/.claude.json` local).
- **Scopes:** amplos de gestão (produtos, pedidos, estoque/transferências, clientes, conteúdo, tema + código do tema, descontos, marketing, metaobjects, traduções, relatórios). De propósito SEM Shopify Payments/financeiro, sem apagar/mesclar dados de cliente, sem `read_all_orders`.

**Contexto importante (mudança 2026):** a Shopify aposentou o token estático `shpat_` do "Develop apps" legado. Agora todo app de loja própria sai do Dev Dashboard e usa client credentials. Só funciona se a loja for da MESMA organização do Dev Dashboard (a Maccari é). Loja de cliente em org separada exigiria OAuth.

**Reconfigurar do zero (se precisar):**
```
claude mcp add shopify-maccari -s local \
  -e SHOPIFY_CLIENT_ID=<id> \
  -e SHOPIFY_CLIENT_SECRET=<secret> \
  -e MYSHOPIFY_DOMAIN=0ju4im-ta.myshopify.com \
  -e SHOPIFY_API_VERSION=2026-04 \
  -- npx -y shopify-mcp
```

Processo replicável pra outros clientes em Shopify (GilsonCar, Vermeister): ver skill [[conectar-shopify]] quando existir.
