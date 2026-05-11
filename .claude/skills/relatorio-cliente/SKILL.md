---
name: relatorio-cliente
description: >
  Gera um relatório mensal completo para clientes da Criativvo em formato de página web.
  Cruza dados do Meta Ads, relatório da Mlabs (Instagram) e métricas manuais do cliente.
  Publica com link compartilhável via Cloudflare Pages.
  Use quando Matheus disser "relatório de [cliente]", "gera o relatório do mês",
  "relatório mensal", "fecha o mês do [cliente]".
---

# /relatorio-cliente — Relatório Mensal Criativvo

## Dependências

- `clientes/[nome-cliente]/CLAUDE.md` — contexto, métricas acompanhadas, tipo de negócio
- `clientes/[nome-cliente]/briefing.md` — serviços contratados
- `marca/design-guide.md` — identidade visual do relatório
- Meta Ads Ratos (`~/.claude/skills/meta-ads-ratos`) — dados de tráfego pago
- Cloudflare Pages (`.env` com `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME`)

---

## Workflow

### Passo 1 — Coletar contexto

Perguntar:

1. "Qual cliente e qual mês/ano?"
2. Ler `clientes/[nome-cliente]/CLAUDE.md` e `briefing.md` automaticamente
3. "Você tem o relatório da Mlabs desse mês? Se sim, me envia o arquivo (CSV, XLSX ou PDF)"
4. Se o cliente for de nicho com venda direta (ex: concessionária, loja): "Quantas vendas o cliente fechou esse mês? Ele informou?"

### Passo 2 — Coletar dados do Meta Ads

Se o cliente tiver conta configurada no `/meta-ads-ratos`, rodar:

- Período: primeiro ao último dia do mês solicitado
- Dados a extrair:
  - Investimento total
  - Impressões e alcance
  - Leads gerados (ou mensagens no WhatsApp, cliques — depende do objetivo)
  - CPL (custo por lead) ou CPC
  - ROAS (se tiver pixel de conversão)
  - Top 3 anúncios do mês por resultado
  - Top 3 piores anúncios (maior custo, menor resultado)
  - Comparativo com mês anterior (% de melhora ou piora)

Se não tiver conta configurada, pular e avisar: "Sem acesso ao Meta Ads desse cliente — preencher dados de tráfego manualmente se tiver."

### Passo 3 — Processar dados da Mlabs (Instagram)

Se o usuário enviou arquivo da Mlabs:

- Extrair: seguidores (total e crescimento), alcance, impressões, engajamento, posts publicados, stories, Reels
- Identificar: posts com melhor e pior desempenho
- Calcular taxa de engajamento: (curtidas + comentários + salvamentos) / alcance

Se não tiver arquivo: deixar seção com placeholder "dados a preencher".

### Passo 4 — Calcular métricas de negócio (quando aplicável)

Para clientes com venda direta (concessionárias, lojas):

- Custo por venda = investimento total / vendas informadas pelo cliente
- ROI = (receita estimada de vendas / investimento em tráfego) × 100

Apresentar esses números com contexto simples — ex: "Para cada R$1 investido em anúncios, o cliente gerou R$X em vendas."

### Passo 5 — Gerar o HTML do relatório

Criar página web completa com design premium seguindo `marca/design-guide.md` (preto, laranja #FF5501, Montserrat). O relatório deve ser:

- Pensado pra o **cliente final ler** — linguagem simples, sem jargão
- **Didático** — cada métrica com uma linha de explicação do que significa
- **Visual** — gráficos de barra e linha usando Chart.js (CDN)
- **Comparativo** — sempre mostrar vs. mês anterior

**Estrutura da página:**

```
1. HEADER
   Logo Criativvo + "Relatório [Mês/Ano] — [Nome do Cliente]"

2. RESUMO EXECUTIVO (destaque visual)
   3-4 números principais em cards grandes:
   - Leads gerados
   - Investimento total
   - Custo por lead
   - [métrica principal do cliente — ex: vendas, visitas ao site]
   Texto de 2-3 linhas: "Em resumo, [o que aconteceu esse mês]."

3. TRÁFEGO PAGO
   - Gráfico de linha: evolução de leads por semana
   - Cards: investimento, leads, CPL, ROAS
   - Explicação simples de cada métrica (tooltip ou parágrafo)
   - Melhores criativos do mês (thumbnail + métricas)
   - O que vai mudar no próximo mês (1-2 ajustes planejados)

4. REDES SOCIAIS (Instagram)
   - Seguidores: total + crescimento no mês
   - Alcance e impressões
   - Taxa de engajamento com contexto ("X% é considerado bom para seu segmento")
   - Posts publicados: melhores e piores
   - Gráfico de barras: engajamento por tipo de conteúdo (Reels vs. carrossel vs. foto)

5. RESULTADO DE NEGÓCIO (se aplicável)
   - Vendas do mês informadas pelo cliente
   - Custo por venda
   - ROI do investimento em tráfego
   - Comparativo com mês anterior

6. ANÁLISE DO MÊS
   ✅ O que funcionou bem (2-3 pontos)
   ⚠️  O que precisamos melhorar (1-2 pontos)
   🎯 Foco do próximo mês (1-2 ações concretas)

7. OPORTUNIDADES (sutil, no final)
   Se identificar oportunidades de upsell (ex: cliente sem site, sem tráfego no Google,
   sem automação de WhatsApp), apresentar como "próximo passo sugerido" — nunca como venda direta.
   Exemplo: "Seu Google Meu Negócio está gerando visibilidade mas sem anúncios ativos no Google.
   Isso pode ser uma oportunidade de capturar mais leads locais."

8. RODAPÉ
   "Relatório gerado pela Criativvo • criativvo.com.br • [data]"
```

**Regras visuais:**
- Fundo: #000000
- Cards com fundo #111111, borda sutil #FF5501 nos destaques
- Números grandes em laranja (#FF5501)
- Texto em branco (#FFFFFF)
- Gráficos: Chart.js com cores da paleta (laranja e cinza)
- Border-radius 12-16px nos cards
- Incluir Chart.js via CDN no `<head>`
- Responsivo — cliente vai ver no celular

### Passo 6 — Salvar e publicar

Salvar em `clientes/[nome-cliente]/relatorio/relatorio-[mes-ano].html`

Perguntar: "Quer que eu publique com um link pra enviar pro cliente?"

Se sim, usar Cloudflare Pages (verificar `.env` — se não tiver configurado, guiar setup).

Após publicar:
> "Relatório publicado. Link: [URL]
> Você pode enviar direto pro cliente ou compartilhar no WhatsApp."

---

## Regras

- Linguagem do relatório: simples, direta, sem jargão de marketing. Escrever como se o cliente nunca tivesse visto um dashboard
- Sempre contextualizar números: não "CPL R$12", mas "Cada lead custou R$12 — abaixo da média do setor para esse nicho"
- Comparativo com mês anterior é obrigatório — o cliente precisa ver evolução
- Oportunidades de upsell: apresentar como benefício pro cliente, nunca como venda forçada
- Se algum dado estiver faltando, deixar o card visível com "Dado não disponível este mês" — não omitir a seção
- Nunca inventar números — se não tiver dado, mostrar o campo vazio com orientação
