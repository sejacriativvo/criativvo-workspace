# [Nome do Cliente] — Contexto do Projeto

> Copie essa pasta pra cada novo cliente e preencha este arquivo.
> O Claude lê este CLAUDE.md automaticamente quando você trabalha dentro dessa pasta.
> Convenção do nome da pasta: **kebab-case**, sem espaços, sem acentos, sem maiúsculas. Ex: `movisol`, `gilsoncar-veiculos`, `maccari-store`, `feffo-cortinas`.

---

## Sobre o cliente

**Nome:**
**Segmento:**
**Porte:** *(ex: pequena loja, rede com 3 unidades, concessionária multimarca)*
**Cidade / região:**
**Responsável de contato:**
**Canal de comunicação:** *(ex: WhatsApp, email, reunião semanal)*

---

## O que a Criativvo entrega pra esse cliente

*(Liste os serviços ativos — ex: gestão de redes sociais, tráfego pago, site Shopify)*

-

---

## Público-alvo

**Perfil:**
**Localização:**
**Faixa etária:**
**Interesses / comportamento:**
**Tom adequado:**

---

## Objetivo principal do cliente

*(O que ele quer alcançar — em termos de negócio, não de marketing. Ex: "vender mais carros seminovos", "aumentar leads qualificados", "abrir nova unidade em 6 meses")*

---

## Contexto e histórico

*(O que é importante saber pra atender bem esse cliente — dores, expectativas, o que já foi tentado, o que funcionou ou não, diferenciais reais da operação)*

---

## Tom e jeito de lidar

*(Como o cliente se comunica, o que espera do atendimento, formal/informal, exigência de prazo, nível de detalhe esperado)*

---

## Restrições e cuidados

*(Coisas a evitar — temas sensíveis, concorrentes que não podem ser mencionados, limitações de verba, aprovações específicas)*

---

## Resultados e métricas acompanhadas

*(O que esse cliente acompanha como sucesso — leads, alcance, faturamento, CPC, CAC, ROI)*

---

## Pilares de conteúdo

*(Preencher quando o cliente tiver gestão de redes sociais. Tipicamente 4–5 pilares com descrição curta.)*

1.
2.
3.
4.
5.

**Frequência:** *(ex: 3 posts fixos por semana + avulsos)*

---

## Identidade visual

**Cor principal:**
**Cores secundárias:**
**Logo:** *(arquivos em `assets/logo/`)*
**Fonte:** *(títulos / corpo / destaque)*

---

## Arquivos e acessos

- **Briefing completo:** `briefing.md`
- **Relatórios:** `relatorio/`
- **Conteúdo de redes sociais:** `redes-sociais/`
- **Posts publicados/agendados:** `redes-sociais/posts/DD-MM-AAAA/`
- **Estratégia de conteúdo:** `redes-sociais/estrategia-conteudo.md`
- **Histórico de posts:** `redes-sociais/historico-posts.md`
- **Histórico de imagens usadas:** `redes-sociais/historico-imagens.md`
- **Assets:** `assets/`
  - **Logos:** `assets/logo/`
  - **Fotos reais (prova social, bastidor, equipe):** `assets/fotos-posts/`
- **Acessos / credenciais (quando aplicável):** `acessos.md`
- **Site (quando aplicável):** `site/`

---

## Variante: cliente multi-unidade

Se o cliente tem mais de uma unidade/loja (ex: gilsoncar-borborema + gilsoncar-ibitinga):

```
<cliente>/
├── assets/                  ← logos e fotos compartilhadas entre as unidades
├── CLAUDE.md                ← contexto da marca-mãe
├── relatorio/               ← relatório unificado, quando faz sentido
├── <cliente>-<unidade-1>/
│   ├── CLAUDE.md            ← contexto da unidade (gestor local, particularidades)
│   ├── briefing.md
│   ├── relatorio/
│   └── redes-sociais/
└── <cliente>-<unidade-2>/
    └── ...
```
