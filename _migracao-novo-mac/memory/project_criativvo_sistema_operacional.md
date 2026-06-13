---
name: project-criativvo-sistema-operacional
description: Sistema Operacional da Criativvo — stack DEFINIDA: Notion (operação) + Sheets privada (financeiro) + skill /so-criativvo (dashboard). Build própria (criativvo-os) deletada em 2026-05-24; pasta sistema-operacional/ deletada em 2026-05-29.
metadata: 
  node_type: memory
  type: project
  originSessionId: 3a13f141-bd4f-4823-aee6-a1350c2cfc09
---

**Status:** stack DEFINIDA — Notion (operação do time) + Google Sheets privada (financeiro Matheus+Victor) + skill `/so-criativvo` (dashboard semanal). Dono operacional: Alisson.

## Histórico de decisões

**2026-05-24 19:30 — Vision Chief recomendou Notion (BUY).**
Motivos: time pequeno (6), Alisson já organizou Notion, MCP oficial Anthropic, velocidade (1-2 semanas pra rodar vs meses pra build).

**2026-05-24 20:10 — Matheus pediu plataforma própria sem custo.**
CTO Architect endossou build com stack Next.js + Supabase + Vercel free tier. Implementação começou: schema completo, auth, 4 telas read-only.

**2026-05-24 22:00 — Matheus testou criativvo-os e rejeitou.**
Motivos: "não achei muito simples, não dá pra alterar nada, vai ser diferencial mesmo?". Reconheceu que ClickUp/Notion entregam mais rápido e polidos. Pediu pra deletar `criativvo-os/`.

**Lição aprendida (registrar pra futuro):** decisões arquiteturais grandes nunca devem ser revertidas em <1h baseadas em "custo zero". O custo real de build próprio é TEMPO DE DESENVOLVIMENTO ATÉ FICAR USÁVEL, não infraestrutura. Vision Chief deveria ter defendido a recomendação original com mais força ao invés de ceder rápido.

## Status atual da implementação

- ❌ `criativvo-os/` (Next.js + Supabase) **DELETADO** em 2026-05-24
- ❌ `sistema-operacional/` (notion-templates, sops, financeiro/dre) **DELETADA** em 2026-05-29 — já tinha servido de setup do Notion e virou peso morto. Templates/SOPs/financeiro agora vivem direto no Notion + Sheets
- ✅ Skill `/so-criativvo` preservada — gera dashboard a partir das pastas de cliente, memórias e CLAUDE.md

## Comparativo de opções pendentes

| Stack | Custo (6 users) | MCP Anthropic | Curva | Pronto |
|-------|----------------|---------------|-------|--------|
| **Notion** (Vision Chief recomenda) | ~R$ 300/mês | ✅ Oficial | Suave | Hoje |
| **ClickUp** | R$ 210-360/mês | ❌ Só comunitário | Média | Hoje |
| **Trello/Monday/Asana** | Varia | TBD | Varia | Hoje |
| Build própria (revisada se vier a fazer sentido) | R$ 0 infra + tempo dev | ✅ direto | Zero (custom) | Semanas |

**Recomendação Vision Chief atual:** **Notion**. Motivos:
1. Alisson já conhece e organizou
2. MCP oficial Anthropic permite Claude operar dentro via skill `/so-criativvo`
3. Wiki/SOPs forte (Dudu vai documentar processo)
4. ClickUp não traz vantagem que justifique trocar

**Próximo passo:** Matheus escolher stack final. Quando escolher, instalar MCP (se Notion) e configurar com Alisson em 1 sessão.
