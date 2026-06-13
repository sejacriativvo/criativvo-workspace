---
name: conectar-shopify
description: Conecta uma loja Shopify ao Claude via MCP de Admin (gestão de produtos, pedidos, estoque, clientes, conteúdo e tema). Conduz da criação do app no Shopify Dev Dashboard até o MCP no ar com renovação automática de token. Use quando o usuário disser "conectar Shopify", "MCP da Shopify", "ligar a loja X no Claude", "plugar Shopify", "acesso à loja Shopify", ou "/conectar-shopify".
---

# Conectar Shopify (Admin MCP)

Conecta uma loja Shopify ao Claude para gerenciar a loja (produtos, pedidos, estoque, clientes, conteúdo, tema + código, descontos, marketing). Usa o servidor MCP `shopify-mcp` com **client credentials grant** (renova o token de 24h sozinho).

## Contexto importante (mudou em 2026)
- A Shopify **aposentou o token estático `shpat_`** do "Develop apps" legado (jan/2026). Todo app de loja própria agora sai do **Shopify Dev Dashboard** (`dev.shopify.com`).
- **`npm init @shopify/app@latest` NÃO é o MCP.** Aquilo cria um app de desenvolvimento do zero. Ignorar.
- **Painel de Partners / app OAuth** (campos App URL, Redirect URLs, App proxy, POS, "Use legacy install flow") é o caminho errado/complicado. Não é por aí.
- O método aqui (client credentials) **só funciona se a loja for da MESMA organização do Dev Dashboard** (loja própria). Loja de cliente em organização separada, onde você é só colaborador/staff, exige OAuth completo (ver "Fallback OAuth" no fim).

## Pré-requisitos
- Node 18+ (`node -v`).
- `claude` CLI disponível.
- Acesso de admin à loja para criar app no Dev Dashboard e instalar na loja.

## Passo a passo

### 1. Descobrir o domínio canônico da loja
No admin da loja: **Settings → Domains**. A loja tem UM domínio `.myshopify.com` permanente (geralmente um handle aleatório tipo `0ju4im-ta.myshopify.com`). **É esse que vale pra API**, mesmo que exista um `.myshopify.com` vaidoso ou domínio `.com.br` primário. Se houver dois `.myshopify.com`, testar o aleatório primeiro (passo 6).

### 2. Criar o app no Dev Dashboard
Ir em `dev.shopify.com` → criar app → nome (ex: `Criativvo MCP`).

### 3. Configurar os scopes (campo "required"; deixar "optional" VAZIO)
Scope opcional não vem garantido no token; só o required vem. Colar a lista abaixo no campo de scopes required.

**Lista recomendada (controle de loja amplo, SEM abrir o cofre financeiro):**
```
read_products,write_products,read_product_listings,write_product_listings,read_product_feeds,write_product_feeds,read_orders,write_orders,read_order_edits,write_order_edits,read_returns,write_returns,read_draft_orders,write_draft_orders,read_customers,write_customers,read_inventory,write_inventory,read_inventory_transfers,write_inventory_transfers,read_inventory_shipments,write_inventory_shipments,read_locations,write_locations,read_fulfillments,write_fulfillments,read_merchant_managed_fulfillment_orders,write_merchant_managed_fulfillment_orders,read_assigned_fulfillment_orders,write_assigned_fulfillment_orders,read_third_party_fulfillment_orders,write_third_party_fulfillment_orders,read_shipping,write_shipping,read_content,write_content,read_files,write_files,read_themes,write_themes,write_theme_code,read_online_store_navigation,write_online_store_navigation,read_online_store_pages,write_online_store_pages,read_legal_policies,write_legal_policies,read_discounts,write_discounts,read_price_rules,write_price_rules,read_discovery,write_discovery,read_marketing_events,write_marketing_events,read_metaobjects,write_metaobjects,read_metaobject_definitions,write_metaobject_definitions,read_translations,write_translations,read_locales,write_locales,read_markets,write_markets,read_publications,write_publications,read_channels,write_channels,read_script_tags,write_script_tags,read_packing_slip_templates,write_packing_slip_templates,read_analytics,read_reports,write_reports
```

**NÃO marcar (risco alto / trava o install / inútil pro MCP):**
- Shopify Payments (accounts, payouts, bank accounts, disputes, provider sensitive), customer payment methods, payment mandate/terms/notifications → dados bancários/financeiros.
- Customer Data Erasure, Customer merge → operações destrutivas de LGPD.
- Audit events → logs de segurança.
- `read_all_orders` → exige aprovação manual da Shopify, trava o install (`read_orders` já cobre 60 dias).
- Customer Account API (`customer_*`) e Storefront API (`unauthenticated_*`) → são pra loja headless/cliente final, não pra gerenciar o admin.
- Subscriptions, store credit, gift cards, companies (B2B) → só se a loja usar esses recursos. Adicionar pontualmente depois.

Demais campos: **Use legacy install flow** OFF, **Redirect URLs** vazio, **App URL** deixar o placeholder (`https://example.com`, não é usado), Embed/POS/App proxy OFF.

### 4. Release / Create version
Salvar a versão dos scopes.

### 5. Instalar o app na loja
Dentro do app, opção de **Install** / selecionar a loja. Sem isso o token não sai.

### 6. Pegar credenciais e testar a geração do token
Em **Settings** do app: copiar **Client ID** e **Client Secret** (`shpss_...`).

Testar o client credentials grant (mascara o token na saída):
```bash
CID="<client_id>"; CSEC="<client_secret>"; DOMAIN="<handle>.myshopify.com"
curl -s -m 25 -w $'\n__HTTP__%{http_code}' -X POST "https://$DOMAIN/admin/oauth/access_token" \
  -H "Content-Type: application/json" \
  -d "{\"client_id\":\"$CID\",\"client_secret\":\"$CSEC\",\"grant_type\":\"client_credentials\"}" \
| python3 -c 'import sys,json;d=sys.stdin.read();b,_,c=d.rpartition("__HTTP__");print("HTTP:",c.strip());
try:
 j=json.loads(b)
 if isinstance(j,dict) and "access_token" in j: t=j["access_token"]; j["access_token"]=t[:10]+"...("+str(len(t))+" chars)"
 print(json.dumps(j,indent=2,ensure_ascii=False))
except Exception: print(b[:600])'
```
- **HTTP 200** + `access_token` + `scope` + `expires_in: 86399` → tudo certo (loja na org + app instalado). Seguir.
- **Erro** → app não instalado, scopes não liberados, OU loja não é da sua organização (aí é Fallback OAuth).

### 7. Plugar o MCP (escopo local, fora do repositório)
Nome do MCP por cliente, ex: `shopify-<cliente>`. **Local** mantém o secret só no `~/.claude.json`, nunca commitado.
```bash
claude mcp add shopify-<cliente> -s local \
  -e SHOPIFY_CLIENT_ID=<client_id> \
  -e SHOPIFY_CLIENT_SECRET=<client_secret> \
  -e MYSHOPIFY_DOMAIN=<handle>.myshopify.com \
  -e SHOPIFY_API_VERSION=2026-04 \
  -- npx -y shopify-mcp
claude mcp get shopify-<cliente>
```
Confirmar `Status: ✓ Connected`. As ferramentas só carregam **ao reiniciar a sessão** do Claude Code.

### 8. Segurança
- Secret só em escopo local, nunca em `.mcp.json` do repositório (sobe no git).
- Se o secret passou por chat/log, sugerir **rotacionar** no Dev Dashboard (Settings do app) e atualizar o MCP.
- Scope mínimo necessário > abrir tudo.

### 9. Registrar
Salvar na memória (sem o secret): nome do MCP, domínio canônico, Client ID, método (client credentials), scopes. Atualizar o índice de memória.

## Fallback OAuth (loja de cliente em outra organização)
Se o client credentials der erro de organização, o caminho é instalar o app via OAuth (authorization code): configurar Redirect URL, instalar pela URL de install, capturar o `shpat_` retornado. Nesse caso o token também é gerenciado pelo fluxo OAuth, não pelo client credentials. Avisar o usuário que é um passo a mais e confirmar antes.
