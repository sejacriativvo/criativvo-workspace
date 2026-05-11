---
name: roteiro-cliente
description: >
  Gera 6 roteiros de Reels para um cliente da Criativvo com base em pesquisa de
  concorrentes, tendências do nicho e dados reais de performance do Meta Ads.
  Use quando Matheus pedir "roteiros para [cliente]", "cria conteúdo pra [cliente]",
  "preciso de roteiros", "gera roteiros do [cliente]".
---

# /roteiro-cliente — Roteiros de Reels com Pesquisa + Dados de Tráfego

## Dependências

- `_contexto/preferencias.md` — tom de voz
- `clientes/[nome-cliente]/CLAUDE.md` — contexto específico do cliente
- `clientes/[nome-cliente]/briefing.md` — nicho, produtos, público
- Meta Ads Ratos (`~/.claude/skills/meta-ads-ratos`) — dados de performance

---

## Workflow

### Passo 1 — Coletar contexto do cliente

Perguntar:

1. "Qual cliente?" — verificar se existe `clientes/[nome-cliente]/CLAUDE.md` e `briefing.md`. Se existir, ler antes de continuar.
2. "Quais produtos ou temas focar nesses roteiros?"
3. "Tem acesso à conta de Meta Ads desse cliente configurada no `/meta-ads-ratos`?"

Se o cliente ainda não tem pasta, avisar: "Esse cliente ainda não tem pasta configurada. Quer que eu crie agora com o modelo padrão?"

### Passo 2 — Pesquisa de concorrentes e tendências

Usar WebSearch para pesquisar:

- `"[nicho do cliente] reels viral 2025"`
- `"[nicho do cliente] conteúdo que vende instagram"`
- `"melhores criativos [nicho] facebook ads"`
- `"[produto principal] tendências marketing digital"`

Sintetizar em 3-5 insights acionáveis:
- Formatos que aparecem com frequência (duração, estrutura, gancho)
- Temas que geram engajamento no nicho
- Padrões de copy nos anúncios encontrados

### Passo 3 — Analisar performance do Meta Ads (se disponível)

Se o cliente tiver conta configurada no `/meta-ads-ratos`, rodar:

1. Buscar os **5 melhores anúncios** dos últimos 30 dias (por CTR, ROAS ou custo por resultado)
2. Buscar os **5 piores anúncios** do mesmo período
3. Identificar padrões:
   - Nos melhores: formato de vídeo, duração, gancho, tema, CTA
   - Nos piores: o que evitar (tema, abordagem, formato)

Se não tiver conta configurada, pular este passo e avisar: "Sem dados de tráfego, vou trabalhar só com a pesquisa de concorrentes. Quando quiser integrar o Meta Ads, é só rodar `/meta-ads-ratos setup`."

### Passo 4 — Gerar os 6 roteiros

Com base nos insights da pesquisa + dados de tráfego, criar 6 roteiros de Reels seguindo esta distribuição:

- **2 roteiros baseados nos criativos vencedores** — mesmo formato e estrutura dos melhores anúncios, com variação de tema ou produto
- **2 roteiros de tendência do nicho** — formatos que estão funcionando nos concorrentes, adaptados pro cliente
- **1 roteiro de variante de teste** — abordagem diferente das anteriores, pra validar nova estratégia
- **1 roteiro educativo/autoridade** — conteúdo que posiciona o cliente como referência no nicho

**Estrutura de cada roteiro:**

```
ROTEIRO [N] — [Tema/Estratégia]
Base: [vencedor de ads / tendência / teste / autoridade]

[0-3s] GANCHO VISUAL:
[texto falado + indicação de visual]

[4-15s] PROBLEMA / PROMESSA:
[texto falado]

[16-45s] DESENVOLVIMENTO:
[texto falado, linha a linha]

[46-60s] CTA:
[texto falado + CTA visual]

OBSERVAÇÕES:
- Tom: [como gravar]
- Visual sugerido: [o que mostrar na tela]
- Por que vai funcionar: [uma linha com a lógica por trás]
```

### Passo 5 — O que evitar

Ao final dos roteiros, incluir uma seção curta:

```
## O QUE EVITAR (baseado nos anúncios ruins)
- [insight 1 do que não funcionou]
- [insight 2]
- [insight 3]
```

### Passo 6 — Salvar

Salvar em `clientes/[nome-cliente]/redes-sociais/roteiros-[mes-ano].md`

Perguntar: "Quer que eu já crie o carrossel ou post de algum desses roteiros?"

---

## Regras

- Tom segue `_contexto/preferencias.md` — direto, sem jargão, sem cara de IA
- Os roteiros devem soar como o cliente fala, não como conteúdo genérico de marketing
- Nicho automotivo: linguagem de resultado (leads, visitas, vendas), não de engajamento vazio
- Para nichos de produto (ex: cortinas, enxoval), focar em transformação visual e desejo de compra
- Nunca inventar dados de performance — se não tiver acesso ao Meta Ads, deixar claro
- Sempre incluir a lógica por trás de cada roteiro (por que vai funcionar)
