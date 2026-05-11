---
name: onboarding-cliente
description: >
  Faz o diagnóstico completo da presença digital de um novo cliente da Criativvo.
  Analisa site, Instagram, Facebook e Google Meu Negócio. Gera relatório com
  problemas encontrados e lista priorizada do que corrigir.
  Use quando Matheus disser "onboarding de [cliente]", "implementar [cliente]",
  "diagnosticar [cliente]", "analisar presença digital de [cliente]",
  "cliente fechou, vamos implementar".
---

# /onboarding-cliente — Diagnóstico de Presença Digital

## Dependências

- `_contexto/empresa.md` — dados da Criativvo
- `clientes/[nome-cliente]/CLAUDE.md` — contexto do cliente (se já existir)
- Playwright (instalado via `npx playwright install chromium`)

---

## Workflow

### Passo 1 — Criar pasta do cliente (se não existir)

Verificar se existe `clientes/[nome-cliente]/`. Se não existir:

1. Criar a estrutura copiando de `clientes/_modelo-cliente/`
2. Avisar: "Criei a pasta do [cliente]. Preenche o CLAUDE.md e o briefing.md com o que você já sabe sobre ele antes de continuar, ou me passa agora que eu preencho."

### Passo 2 — Coletar links

Perguntar, uma por vez:

1. "Qual o link do site do cliente?" *(se disser que não tem, anotar como oportunidade de venda de Shopify)*
2. "Qual o @ do Instagram?"
3. "Tem Facebook? Qual o link da página?"
4. "O nome da empresa no Google Meu Negócio?" *(pra buscar no Google)*

### Passo 3 — Diagnóstico do site

Se o cliente tiver site, rodar o script de diagnóstico:

```bash
node ".claude/skills/onboarding-cliente/scripts/diagnostico-site.js" "[URL do site]" "clientes/[nome-cliente]"
```

Analisar o resultado JSON e extrair:
- Tempo de carregamento (acima de 3s = problema)
- Links quebrados encontrados
- Botões sem ação
- Problemas de SEO (título, meta description)
- Ler os screenshots gerados (`screenshot-desktop.png` e `screenshot-mobile.png`)

Além do script, fazer WebFetch do site e analisar:
- Informações de contato presentes? (WhatsApp, telefone, endereço)
- Horário de funcionamento visível? (se for estabelecimento físico)
- Copy da homepage: clara? comunica o que o negócio faz?
- CTA principal: existe? está destacado?
- Depoimentos ou prova social?
- Galeria de produtos/serviços atualizada?

**Se não tiver site:**
Registrar como: "OPORTUNIDADE: cliente sem site — apresentar proposta Shopify."

### Passo 4 — Diagnóstico do Instagram

WebFetch do perfil público (`https://www.instagram.com/[handle]/`):

Verificar:
- Bio completa? Diz o que faz, onde fica, como contatar?
- Link na bio presente e funcionando?
- Destaques criados? Têm: Equipe, Localização/Espaço, Produtos/Serviços, Depoimentos?
- Nome de usuário é o nome da marca ou algo confuso?
- Foto de perfil com qualidade e identidade visual?

### Passo 5 — Diagnóstico do Google Meu Negócio

WebSearch: `"[nome da empresa]" Google Meu Negócio site:google.com OR "google.com/maps"`

Verificar:
- Perfil existe e está verificado?
- Categoria do negócio correta?
- Horário de funcionamento atualizado?
- Endereço e telefone corretos?
- Fotos: quantas? Recentes? Boa qualidade?
- Avaliações: nota geral, respostas às avaliações?
- Descrição do negócio preenchida?

### Passo 6 — Diagnóstico do Facebook (se tiver)

WebFetch da página:

Verificar:
- Informações completas (horário, endereço, telefone, site)?
- Última postagem: há quantos dias?
- Foto de capa e perfil com identidade visual?
- CTA do botão da página configurado?

### Passo 7 — Gerar relatório de diagnóstico

Criar o arquivo `clientes/[nome-cliente]/diagnostico-[data].md` com a seguinte estrutura:

```markdown
# Diagnóstico Digital — [Nome do Cliente]
Data: [data]

## Resumo executivo
[2-3 linhas com os problemas mais críticos encontrados]

## Site
**Status:** [Tem / Não tem — oportunidade de venda]
**Carregamento:** [Xs — OK / Lento]
**Problemas encontrados:**
- [lista de issues por gravidade: CRÍTICO / ATENÇÃO / MELHORIA]

## Instagram (@handle)
**Problemas encontrados:**
- [lista]

## Google Meu Negócio
**Status:** [Verificado / Não verificado / Não encontrado]
**Problemas encontrados:**
- [lista]

## Facebook
**Problemas encontrados:**
- [lista]

## Plano de ação — por ordem de prioridade
1. [item mais crítico] — impacto: [alto/médio/baixo]
2. ...

## Oportunidades identificadas
[Serviços adicionais que o cliente claramente precisa mas não contratou ainda]
```

### Passo 8 — Apresentar resumo

Mostrar ao Matheus:
1. Os 3-5 problemas mais críticos encontrados
2. A lista de prioridades
3. Oportunidades de upsell identificadas

Perguntar: "Quer que eu já comece a corrigir algum desses pontos agora?"

---

## Regras

- Ser específico nos problemas — não "Instagram fraco", mas "bio sem endereço e sem link de WhatsApp"
- Sempre separar o que é urgente do que é melhoria
- Registrar oportunidades de upsell (site, fotos profissionais, tráfego) sem forçar
- Tom do relatório: direto, profissional, fácil de mostrar pro cliente como justificativa do trabalho
- Se o cliente não tiver alguma plataforma, registrar como oportunidade, não como falha
