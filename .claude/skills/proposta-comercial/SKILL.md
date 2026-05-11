---
name: proposta-comercial
description: >
  Gera uma proposta comercial profissional em HTML para a Criativvo.
  Aplica a identidade visual da marca (preto, laranja #FF5501, Montserrat, Great Vibes).
  Use quando Matheus mencionar "proposta", "orçamento", "apresentação pro cliente",
  "fechar cliente", "montar proposta" ou pedir documento de venda.
---

# /proposta-comercial — Proposta Criativvo

## Dependências

- `marca/design-guide.md` — cores, fontes, logo
- `_contexto/empresa.md` — dados da Criativvo
- `_contexto/preferencias.md` — tom de voz

---

## Workflow

### Passo 1 — Coletar briefing

Perguntar em conversa natural, uma por vez:

1. "Nome do cliente e empresa?"
2. "Qual é o problema ou necessidade dele?"
3. "Quais serviços você vai propor?" *(ex: redes sociais + tráfego, site Shopify, pacote completo)*
4. "Qual o valor? Pode ser range ou 'a definir'."
5. "Tem prazo ou entregável específico pra fechar?"

Se o usuário já deu as informações de forma livre, extrair o que der e prosseguir sem repetir perguntas.

### Passo 2 — Ler contexto

- `marca/design-guide.md` — aplicar cores (#000000, #FF5501, #FFFFFF) e fontes (Great Vibes + Montserrat)
- `_contexto/empresa.md` — usar dados da Criativvo como prestadora
- `_contexto/preferencias.md` — tom direto, focado em ROI, sem travessão, sem jargão

### Passo 3 — Gerar o HTML

Criar proposta completa com as seguintes seções:

1. **Header** — logo da Criativvo (se existir em `marca/`) ou nome em Great Vibes laranja + data
2. **Destinatário** — "Proposta para [Cliente]"
3. **O problema** — dor real do cliente em 2-3 parágrafos, na perspectiva dele. Para concessionárias e lojas de veículos, conectar com vendas, leads, presença digital fraca frente à concorrência
4. **A solução** — o que a Criativvo entrega e por que resolve. Enfatizar a abordagem 360 (branding + conteúdo + tráfego + automação em uma única solução)
5. **Escopo** — entregáveis claros por serviço contratado
6. **O que NÃO está incluído** — quando relevante, evitar conflito pós-contrato
7. **Prazo e entregáveis**
8. **Investimento** — valor com contexto de ROI. Quando possível, conectar com o resultado esperado ("investimento de R$X pra gerar Y em retorno")
9. **Próximos passos** — CTA claro. Ex: "Assine o contrato e comece em [prazo]"
10. **Sobre a Criativvo** — 3-4 linhas. Mencionar case Gilson Car: maior faturamento da história + 2 novas unidades em 2 meses

**Estilo visual:**
- Fundo: #000000
- Destaque / CTA: #FF5501
- Texto: #FFFFFF
- Cards/seções alternadas: #111111
- Títulos: Montserrat Bold ou ExtraBold
- Palavras-chave em destaque: Great Vibes 400, primeira letra maiúscula
- Border-radius: 12–16px nos cards
- Botão CTA: fundo #FF5501, texto branco, sem borda
- Layout de uma coluna, responsivo
- Valor em destaque visual — nunca escondido
- Importar fontes via Google Fonts no `<head>`

### Passo 4 — Salvar e oferecer publicação

Salvar em `propostas/proposta-[nome-cliente]-[data].html`

Perguntar: "Quer que eu publique essa proposta com um link pra enviar pro cliente? É só chamar `/publicar-site` passando o arquivo."

---

## Regras

- Tom: direto, humano, focado em resultado e ROI. Sem travessão (—). Sem jargão ("soluções inovadoras", "entregamos valor"). Sem cara de IA
- Nunca inventar valor, prazo ou escopo — se não foi fornecido, usar placeholder claro
- A proposta deve soar como veio do Matheus, não de um template
- Para clientes do nicho automotivo, conectar o problema com o mercado de veículos (concorrência, sazonalidade, geração de leads qualificados)
- Sempre incluir o case Gilson Car na seção "Sobre a Criativvo" como prova social
