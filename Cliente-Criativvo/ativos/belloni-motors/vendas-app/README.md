# Belloni Motors — Painel de Vendas

Réplica do sistema interno da GilsonCar, rebrandeada para a Belloni Motors.

## Status
- **Fase 1 — Protótipo (PRONTO):** versão visual navegável, sem backend. Abre direto no navegador.
- **Fase 2 — Sistema real (a fazer):** Next.js + Supabase + Vercel + domínio (igual GilsonCar).

## Protótipo
Arquivo: `prototipo/index.html` — é só dar duplo clique (abre no navegador).

Dados de exemplo, sem login real. Na tela inicial escolhe o perfil:
- **Vendedor** — Estoque, Clientes (CRM kanban), Agenda, Metas. Nunca vê custo/lucro nem relatórios.
- **Admin (Sr. Belloni)** — tudo + Painel, Relatórios de tráfego, custos e margens.
- **Tráfego (Alisson)** — vê SÓ a aba Relatórios (lança investimento + conversas).

### Telas (todas as funções do app da GilsonCar)
- **Painel** (admin): KPIs do mês, funil de clientes, donut do estoque, carros parados.
- **Estoque**: grid com filtros, margem de negociação, desconto máximo; admin vê custo/lucro.
- **Clientes**: CRM kanban estilo Trello (arrasta os cards, "Mover para", WhatsApp), seletor de mês pras colunas Vendeu/Não comprou.
- **Agenda**: calendário mensal com visitas e retornos, detalhe do dia + WhatsApp.
- **Metas**: contador +/- de vendas vs meta do mês, barra de progresso (1 loja).
- **Relatórios**: tráfego pago por mês, "custo pra vender 1 carro", tabela por semana (investido, leads, custo/lead, vendas, conversão, custo/venda, lucro, ROI), gráfico mês a mês, lançamento por papel.
- **Modo privacidade**: olhinho no topo borra dados pessoais/financeiros pra mostrar a tela pra terceiros.

### Identidade
- Corpo claro + header/sidebar **escuro premium** (preto + tricolore italiano), logo branca do Belloni.
- Paleta: vermelho `#CD212A` e verde `#157f4e` (escudo italiano), preto `#0d0f12`.
- 1 loja só (sem seletor de loja).

### O que é demonstração (ajustar na Fase 2)
- Fotos dos carros, clientes, vendas e bancos são dados de exemplo.
- Nomes "Sr. Belloni" (admin), "João Silva" (vendedor) e "Alisson" (tráfego) são placeholders.
- Mensalidade da Criativvo no relatório está como R$ 1.500 (placeholder no código, const `FEE`).
- Fonte do estoque (Shopify / manual / planilha) a definir.

## Fase 2 (quando for subir de verdade)
1. Criar projeto Supabase do Belloni (auth + banco com RLS, proteção de custo/lucro no servidor).
2. Portar o app Next.js (base: `gilsoncar-veiculos/vendas-app/web`), rodar as migrations adaptadas pra 1 loja.
3. Definir a fonte do estoque (Shopify, cadastro manual ou planilha).
4. Deploy na Vercel + domínio próprio.
5. (Opcional) Integração Meta Ads pros relatórios de tráfego.

Assets da marca: `../site/assets/` (logo-belloni.png, escudo-belloni.png, favicon.png, fachada).
