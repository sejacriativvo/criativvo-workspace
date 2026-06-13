---
name: project-belloni-motors
description: "Belloni Motors — CRM/Painel de Vendas (protótipo pronto, sistema real pendente). Concessionária multimarca premium."
metadata: 
  node_type: memory
  type: project
  originSessionId: a9a4785c-2619-42fb-a3a2-3761117e09f7
---

# Belloni Motors — Painel de Vendas

Concessionária multimarca premium. Cliente da Criativvo.

## Status dos projetos
- **Site:** `Cliente-Criativvo/ativos/belloni-motors/site/` — pasta do site
- **CRM/Painel de Vendas:** publicado e no ar

## CRM — No ar
- **URL:** https://belloni-vendas.vercel.app
- **Projeto Vercel:** `belloni-vendas` (projectId: `prj_ztFXqCJeXYa2XQFN9Uphywju792D`)
- **Código:** `Cliente-Criativvo/ativos/belloni-motors/vendas-app/web/`
- **Redeploy:** `cd web && npx vercel@54.9.1 --prod --yes`
- Ao acessar, escolher o perfil: Vendedor, Admin (Sr. Belloni) ou Tráfego (Alisson)

## CRM — Telas do protótipo
- **Painel** (admin): KPIs, funil, donut de estoque, carros parados
- **Estoque**: grid com filtros, margem de negociação, desconto máximo
- **Clientes**: CRM kanban (arrasta cards, WhatsApp), seletor de mês
- **Agenda**: calendário mensal com visitas e retornos
- **Metas**: contador de vendas vs meta (1 loja)
- **Relatórios**: tráfego pago, "custo pra vender 1 carro", tabela por semana, gráfico
- **Modo privacidade**: olhinho borra dados pessoais pra mostrar a terceiros

## Identidade visual
- Header/sidebar escuro premium: preto `#0d0f12` + tricolore italiano
- Vermelho `#CD212A`, verde `#157f4e` (escudo italiano)
- Logo branca do Belloni
- 1 loja (sem seletor de loja, diferente do GilsonCar)

## Assets da marca
`Cliente-Criativvo/ativos/belloni-motors/site/assets/` — logo-belloni.png, escudo-belloni.png, favicon.png, fachada

## Fase 2 (quando for subir de verdade)
1. Criar projeto Supabase do Belloni
2. Portar app Next.js (base: `gilsoncar-veiculos/vendas-app/web`)
3. Definir fonte do estoque (Shopify, manual ou planilha)
4. Deploy na Vercel + domínio
5. (Opcional) integrar Meta Ads nos relatórios

## Placeholders no protótipo (ajustar na Fase 2)
- "Sr. Belloni" (admin), "João Silva" (vendedor), "Alisson" (tráfego)
- Mensalidade da Criativvo: R$ 1.500 (const `FEE` no código)
- Fotos de carros, clientes e vendas são dados de exemplo

[[project_gilsoncar_vendas_app]]
