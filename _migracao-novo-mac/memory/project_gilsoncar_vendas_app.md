---
name: project-gilsoncar-vendas-app
description: GilsonCar Vendas — app interno (estoque + CRM + calendário + RELATÓRIOS de tráfego por loja + metas) em produção. URL, logins (inclui Alisson/tráfego), contas, stack, papéis, automações e migrations. Atualizado 2026-06-08.
metadata:
  node_type: memory
  type: project
  originSessionId: bc260164-c1cf-4207-8c59-cd1087833bb6
---

# GilsonCar Vendas — app interno (PUBLICADO)

Concessionária multimarca, **2 lojas: Ibitinga e Borborema**. Contato operacional: **Italo Pereira**. App pro time: estoque com desconto, CRM, calendário, relatórios de tráfego e metas. Virou produção real em 2026-06-06; muito ampliado em 2026-06-08.

## No ar
- **URL:** https://gilsoncar-vendas.vercel.app (PWA instalável). Código: `Cliente-Criativvo/ativos/gilsoncar-veiculos/vendas-app/web/` (Next.js 16).
- **Deploy:** `cd web && npx vercel@54.9.1 --prod --yes` (pinar a versão; `npx vercel` sem pin bateu em 404 de `@vercel/static-build` — `npm cache clean --force` resolveu). Cron + região gru1 em `web/vercel.json`.

## Logins / papéis (role em `profiles`)
- **admin** (Italo): `italoaugustoantunespereira@gmail.com` — vê e edita tudo.
- **vendor** (3 vendedores, login único): `marketing.gilsoncar@gmail.com` / `Gilsoncar01!` — estoque/clientes/agenda/metas. NUNCA vê custo/lucro/ROI.
- **traffic** (Alisson): `allison07rodrigues@gmail.com` / `allison123` — acessa SÓ a aba Relatórios; lança investimento+conversas (azul). Criado via `scripts/create-alisson.mjs`. `blockTraffic()` em `lib/auth.ts` barra o tráfego das outras abas; `requireReports()` libera admin+traffic.

## Contas (propriedade da GilsonCar)
- **Supabase** ref `ubcrprsavvyzhphfldmt`, região SP, chaves novas `sb_publishable_`/`sb_secret_`. **Vercel** time `gilson-car-s-projects`, projeto `gilsoncar-vendas`. Segredos em `web/.env.local` (gitignored) — NÃO duplicar aqui.

## Stack / regras
- Next.js 16 (App Router, Turbopack). **`middleware` virou `proxy`** (`web/src/proxy.ts`). Ler `web/AGENTS.md` antes de codar.
- **Proteção de custo (central):** vendedor lê a VIEW `vehicles_public` (security definer, sem `cost`); tabela `cars` é RLS só-admin. `ad_reports` (relatórios) só admin+traffic (`can_see_reports()`).
- **Formatação BR sempre:** `brl2()` em `lib/relatorios.ts` (vírgula decimal). Sem travessão na copy.
- **Segurança (auditoria 2026-06-08):** auth 100% server-side (sem browser client — `lib/supabase/client.ts` foi REMOVIDO). Cookies de sessão forçados **HttpOnly + Secure(prod) + SameSite=lax** no `server.ts` e `proxy.ts` (XSS não rouba sessão). Nenhum segredo em `NEXT_PUBLIC_` (só URL + anon key, públicas por design). `productionBrowserSourceMaps:false`. **CSP completo** em `next.config.ts` (script/style `'unsafe-inline'` que o Next exige, img `https:` p/ CDN Shopify; se algo quebrar visual, pode ser CSP, 1 diretiva resolve). Rotas /api fail-closed (CRON_SECRET / HMAC timingSafeEqual). Sem CORS permissivo. Dados protegidos por RLS. Nada sensível em localStorage (só `gc:privacy` toggle) / sessionStorage.

## Seções
- **Estoque:** carros vêm SÓ da Shopify (sync do catálogo PÚBLICO `/products.json`, sem token; cron diário ~6h + botão admin). Admin define **desconto R$ por carro** (`cars.negotiation_discount`) e **custo opcional** (`cars.cost`). Carro sem margem = "pending". Detalhe mostra **"Preço mínimo de venda"** (= preço − desconto), não o valor do desconto. Data de aquisição (`cars.acquired_at`) define o giro; **"girar" = +90 dias** (não 30).
- **Clientes:** quadro Kanban com drag fluido (**@dnd-kit**), WhatsApp pré-pronto, datas, **loja da venda** (no "Vendeu"). Carro sai do estoque ao vender (`mark_car_sold`). É o CRM completo — porém POR ENQUANTO o time NÃO usa pra registrar venda (acham trabalhoso); fica pronto pro futuro.
- **Agenda/Calendário:** eventos mostram nome + carro + observações + botão WhatsApp (detalhe do dia, PC e celular).
- **Relatórios (tráfego por loja):** seletor Ibitinga/Borborema/Rede + mês. Headline "custo pra vender 1 carro" (tráfego + mensalidade Criativvo ÷ vendas); no mês corrente mostra a SEMANA atual, no mês fechado o mês todo. **Mensalidade fixa: Ibitinga R$ 4.000, Borborema R$ 750** (const FEE no view). Tabela por semana (estilo planilha) + gráfico de barras combinado (vendas+investimento por mês). Importado da planilha "GilsonCar x Criativvo.xlsx" (mar/abr/mai 2026 semanal + histórico 2025). Lucro = preço de venda − custo (automático do CRM, ou Italo lança manual/Borborema).
- **Metas:** **por loja** (Ibitinga e Borborema), cada uma com **contador manual +1/−1** (vendas do mês, zera ao virar o mês) vs meta. O lançamento manual antigo ("vendas antes do CRM") foi removido.
- **Painel (admin):** KPIs do mês (CRM), funil de clientes (gráfico de funil de verdade), donut de estoque, patrimônio/lucro.
- **Modo privacidade:** olhinho no cabeçalho borra dados pessoais de cliente (nome/telefone/observações) pra mostrar o painel pra terceiros.
- **Pop-up de lembrete (admin):** ao entrar, avisa o que falta preencher (carro sem margem/custo, venda sem loja).

## Integração Meta Ads (em setup, 2026-06-08)
Objetivo: investimento+conversas do Relatório virem automáticos da API de Marketing da Meta, sem o Alisson digitar. NÃO é MCP (MCP conecta no Claude, não no app); é integração server igual a da Shopify.
- **Código (no ar, inerte até ter credenciais):** `lib/meta.ts` (`runMetaSync`: puxa `spend`+ações `messaging_conversation_started` por dia via `act_<id>/insights`, agrega nas 4 semanas com `weekIndexForDay`, upsert SÓ nos campos azuis investimento/conversas, service-role, só meses "vivos" ≥ jun/2026). Rota cron `/api/sync-meta` (Bearer CRON_SECRET, fail-closed) + cron diário 12h UTC em `vercel.json`. Botão "Sincronizar Meta" no topo de Relatórios (`meta-sync-button.tsx` + `sync-meta.ts`, `requireReports`).
- **Env vars (Vercel):** `META_AD_ACCOUNT_<LOJA>` + token. Suporta **token por loja** (`META_ACCESS_TOKEN_IBITINGA`/`_BORBOREMA`) com fallback no `META_ACCESS_TOKEN` único. Opcionais: `META_APP_SECRET` (appsecret_proof), `META_API_VERSION` (default v21.0).
- **BORBOREMA LIGADO (2026-06-08):** `META_AD_ACCOUNT_BORBOREMA=1061480447038301` (conta "GilsonCar Borborema", BRL) + `META_ACCESS_TOKEN_BORBOREMA` setados em Production. App `GilsonCar Vendas Integracao` criado em developers.facebook.com no portfólio **gilsoncarborborema** (sem caso de uso → adicionado caso de uso de Anúncios/Marketing API p/ liberar `ads_read`). System user com a conta (Ver desempenho) + o app (Gerenciar app). Token "Nunca" expira, só `ads_read`. Validado via API: jun/2026 semana 1 (1-8) = R$329,09 e 71 conversas. **Conversa = `messaging_conversation_started_7d`** (alternativa próxima: `total_messaging_connection`=74; confirmar c/ Alisson qual ele usava).
- **IBITINGA LIGADO (2026-06-08):** `META_AD_ACCOUNT_IBITINGA=188981184611167` (BRL, conta real com os anúncios) + `META_ACCESS_TOKEN_IBITINGA` (mesmo token do Borborema, o system user `gilsoncarvendas` enxerga as 2). A conta de Ibitinga era **solta (pessoal)**; foi **reivindicada** ("Adicionar uma conta de anúncio existente") pro portfólio gilsoncarborborema e atribuída ao system user (Ver desempenho). Validado: jun/2026 semana 1 = R$816,18 e 181 conversas. **PEGADINHA resolvida:** na 1ª tentativa criou-se por engano uma conta VAZIA em USD cujo NOME é "188981184611167" mas ID real **28325365227051894** (foi desativada; não pode ser removida do portfólio, ignorar). Sempre conferir pelo ID + moeda BRL.
- **Pós-ligar:** Meta vira fonte da verdade dos campos azuis (digitação manual do Alisson é sobrescrita no próximo sync).
- **Métrica de conversa CONFIRMADA:** `messaging_conversation_started_7d` (comparado com maio que o Alisson já fechou: Ibitinga Meta 660/R$2947 vs planilha 655/R$2946 — bate). NÃO é `total_messaging_connection`.
- **Backfill histórico feito (2026-06-08)** via `scripts/backfill-meta.mjs` (token por env `META_TOKEN`, grava SÓ azuis, preserva verdes): Ibitinga mensal 2025-01→2026-02 (jan-set/2025 conversas=0, não rodavam campanha de mensagem); Borborema só existe desde fev/2026 (conta nova). Tapada a semana 25-31/05 do Borborema (R$280,09/74 conv, lucro 6800 preservado). Mar–Mai/2026 semanais validados ficaram intactos.

## Operação
- **Migrations:** EU não rodo DDL. Escrevo `.sql` em `web/supabase/`, `pbcopy`, Italo cola no SQL Editor → Run. Já vão até a **migration-14** (01 pending custo · 02 sync · 03 margem/carro · 04 datas · 05 mark_car_sold · 06 closed_at · 07 monthly_goal · 08 ajuste vendas · 09 lucro manual · 10 data aquisição · 11 relatórios+papel traffic+import · 12 loja na venda · 13 meta por loja · 14 contador vendas manual por loja).
- **Scripts** (`web/scripts/`): `create-alisson.mjs`, `seed-vendas-ibitinga.mjs`. Rodar com `node scripts/x.mjs` (lê `.env.local`).
- **CUIDADO:** já sobrescrevi dado vivo do Italo em teste 2x (settings). NUNCA dar UPDATE em registro de produção em diagnóstico.
- **Stale build:** depois de cada deploy, avisar o time pra recarregar o app (PWA cacheia; ações antigas dão erro "página não carregou").

## Why
Protótipo HTML não protegia custo (estava no JS). Versão real protege no banco (RLS). Infra na conta da GilsonCar pra handover limpo.

[[reference-gilsoncar-sheets]] [[project-gilsoncar-assets]] [[project-criativvo-time]]
