---
name: novo-crm
description: >
  Briefing completo para montar um CRM/app interno do zero. Faz perguntas sobre negócio, equipe,
  papéis, módulos, dados sensíveis, integrações e visual — depois gera spec técnico + CLAUDE.md
  dedicado ao projeto. Use quando o usuário disser "novo CRM", "criar sistema interno",
  "montar app pra cliente", "/novo-crm" ou "quero fazer um CRM pra X".
---

# /novo-crm — Briefing e spec para CRM/app interno

Conduz uma entrevista estruturada e transforma as respostas em um spec técnico completo pronto para começar o desenvolvimento.

## Referência de base

O CRM-modelo é o **GilsonCar Vendas** (gilsoncar-vendas.vercel.app):
- Stack: Next.js + Supabase + Vercel (PWA, R$0/mês de infra no início)
- Papéis: admin / vendedor / tráfego
- Módulos: estoque, CRM/clientes, kanban de funil, metas por loja, relatórios, calendário, financeiro oculto
- Controle de margem: vendedor vê só a faixa de desconto, nunca o custo real

Usar esse modelo como base e adaptar conforme o briefing do novo cliente.

---

## Workflow

### Passo 1 — Apresentação (1 linha)

> "Vou te fazer algumas perguntas sobre o negócio pra montar o spec do CRM. Responde como quiser, pode ser curto."

---

### Passo 2 — Bloco 1: O negócio (perguntar tudo de uma vez)

```
BLOCO 1 — O NEGÓCIO

1. Qual o nome da empresa e o que ela vende/faz?
2. Tem mais de uma unidade, loja ou filial? Se sim, quantas e onde?
3. Qual o problema principal que o CRM vai resolver? (ex: "vendedor não sabe a margem", "leads somem", "não tem controle de estoque")
```

Aguardar resposta antes de continuar.

---

### Passo 3 — Bloco 2: Equipe e logins

```
BLOCO 2 — EQUIPE E LOGINS

4. Quantas pessoas vão usar o sistema? Liste os perfis/cargos (ex: dono, gerente, vendedor, atendente, tráfego).
5. O que cada perfil pode ver e fazer? O que algum perfil NÃO deve ver? (ex: custo de produto, margem em R$, dados financeiros)
6. Vai ter login por funcionário (cada um com senha própria) ou login por papel (todo vendedor usa o mesmo acesso)?
```

Aguardar resposta.

---

### Passo 4 — Bloco 3: Módulos

```
BLOCO 3 — MÓDULOS

Marque quais módulos você precisa (pode marcar todos que fizerem sentido):

[ ] Estoque / catálogo de produtos (listar, buscar, filtrar)
[ ] Cadastro de clientes / leads (CRM básico)
[ ] Funil de vendas (kanban com etapas: novo lead → proposta → fechado)
[ ] Agenda / calendário (visitas, follow-ups, tarefas)
[ ] Metas (por vendedor, por loja, por período)
[ ] Relatórios (resumo de vendas, tráfego pago, conversão)
[ ] Financeiro / margem (visível só pro admin)
[ ] Cadastro de novas entradas (o admin cadastra o produto/item manualmente)
[ ] Outro: ___

7. Algum módulo tem regra especial? (ex: "vendedor só vê os clientes dele", "meta some depois que bate")
```

Aguardar resposta.

---

### Passo 5 — Bloco 4: Dados e integrações

```
BLOCO 4 — DADOS E INTEGRAÇÕES

8. O estoque/catálogo já existe em algum lugar? (Shopify, planilha, sistema próprio, nenhum)
9. Os leads chegam de algum lugar específico? (formulário de site, WhatsApp, tráfego pago, indicação)
10. Tem alguma ferramenta que precisa conectar? (Shopify, Google Sheets, WhatsApp, Meta Ads, outro)
11. O sistema precisa rodar no celular? (como app instalável no iPhone/Android)
```

Aguardar resposta.

---

### Passo 6 — Bloco 5: Visual e deploy

```
BLOCO 5 — VISUAL E DEPLOY

12. Tem logo e paleta de cores da empresa? (ou eu uso a identidade que já temos no projeto)
13. Quer domínio próprio (ex: crm.empresa.com.br) ou pode ser no padrão Vercel (empresa.vercel.app)?
14. Tem prazo? Quando precisa estar funcionando?
15. Alguma coisa que você viu em outro sistema que quer replicar ou evitar?
```

Aguardar resposta.

---

### Passo 7 — Gerar spec técnico

Com todas as respostas em mãos, gerar um documento `spec.md` dentro da pasta do cliente com a seguinte estrutura:

```markdown
# CRM [Nome da empresa] — Spec técnico

> Gerado em [data]. Base: briefing coletado via /novo-crm.

## Resumo do sistema

[1 parágrafo descrevendo o que o sistema faz e pra quem]

## Stack recomendada

- **Frontend:** Next.js (App Router) — PWA se mobile for necessário
- **Banco/Auth:** Supabase (Postgres + Auth nativo)
- **Deploy:** Vercel (free tier suficiente pra começar)
- **Custo inicial:** R$ 0/mês

## Módulos a construir

| Módulo | Papéis que acessam | Observações |
|--------|-------------------|-------------|
| [módulo 1] | [papéis] | [regras especiais] |
| ... | ... | ... |

## Papéis e permissões

| Papel | Pode ver | Não pode ver |
|-------|----------|--------------|
| [papel 1] | [lista] | [lista] |
| ... | ... | ... |

## Integrações

| Ferramenta | Como integra | Prioridade |
|-----------|--------------|-----------|
| [integração 1] | [via API / webhook / manual] | [alta/média/baixa] |

## Schema do banco (rascunho)

[Tabelas principais com campos relevantes, baseado nos módulos]

## Fases de desenvolvimento sugeridas

| Fase | Entrega | Estimativa |
|------|---------|-----------|
| 1 | Setup Next.js + Supabase + login + papéis | 1 dia |
| 2 | [módulo principal 1] | X dias |
| 3 | [módulo principal 2] | X dias |
| ... | ... | ... |
| Final | Deploy + testes + entrega pro cliente | 1 dia |

## O que o vendedor/funcionário NÃO vê

[Listar dados sensíveis e como esconder no código]

## Credenciais que o cliente precisa providenciar

[Lista do que pedir pro cliente antes de começar]

## Perguntas em aberto

[O que ficou vago e precisa confirmar antes de codar]
```

---

### Passo 8 — Criar pasta do projeto

Após gerar o spec, criar a estrutura:

```
[pasta do cliente]/crm/
├── spec.md           ← spec gerado
├── CLAUDE.md         ← contexto do projeto pra próximas sessões
└── web/              ← (criar na hora de codar)
```

**Conteúdo do CLAUDE.md do CRM:**

```markdown
# CRM [Nome da empresa]

> Projeto iniciado em [data]. Stack: Next.js + Supabase + Vercel.

## O que é

[Resumo de 2 linhas do sistema]

## Stack

- Next.js (App Router)
- Supabase (banco + auth)
- Vercel (deploy)
- Tailwind CSS

## Papéis

[Tabela de papéis e permissões do spec]

## Módulos ativos

[Lista de módulos confirmados]

## Dados sensíveis (nunca expor pro front sem checar papel)

[Lista do que é oculto por papel]

## Deploy

- URL: [url quando disponível]
- Vercel: projeto [nome] na conta [qual conta]
- Supabase: projeto [nome]

## Como rodar local

```bash
cd web
npm install
npm run dev
```

## Referência

Ver `spec.md` nessa pasta pra contexto completo do briefing.
```

---

### Passo 9 — Resumo final

Responder ao usuário:

```
Spec gerado: [caminho]/crm/spec.md
CLAUDE.md criado: [caminho]/crm/CLAUDE.md

Próximos passos:
1. Confirmar as perguntas em aberto do spec (se houver)
2. Pedir as credenciais listadas no spec
3. Criar a pasta web/ e começar o setup quando quiser

Quer começar agora ou tem algo pra ajustar no spec primeiro?
```

---

## Regras

- Fazer os blocos um de cada vez — nunca jogar todas as 15 perguntas de uma vez
- Se o usuário responder "não sei" ou deixar vago, registrar no spec como "pendente de confirmar" e continuar
- Sempre incluir a seção "Perguntas em aberto" no spec — é onde ficam as dúvidas não resolvidas
- Se o cliente já tem pasta em `Cliente-Criativvo/ativos/`, criar `crm/` dentro dessa pasta existente
- Se não tem, criar em `Cliente-Criativvo/ativos/[kebab-case]/crm/`
- Estimar prazo de desenvolvimento com base nos módulos: módulo simples = 1 dia, módulo com lógica de permissão = 1,5 dias, integração externa = +1 dia
- Nunca prometer "em X dias" sem deixar claro que é estimativa
