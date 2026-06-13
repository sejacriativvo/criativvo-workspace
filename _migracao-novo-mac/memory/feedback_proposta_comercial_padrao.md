---
name: feedback_proposta_comercial_padrao
description: "Padrão visual fixo das propostas comerciais Criativvo, 11 páginas A4 alternando branco/laranja, com PIX selecionável e ancoragem De/Por"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fee3bd17-fbc2-4c1d-a7d8-7b15298fadff
---

Toda proposta comercial da Criativvo segue este padrão fixo, validado em 2026-05-20 na proposta para Carvalho Costa Adv.

**Template de referência:** `criativvo/propostas/_template-proposta-padrao.html`

**Skill que executa:** `proposta-comercial` (em `.claude/skills/proposta-comercial/SKILL.md`)

## Estrutura fixa
- 11 páginas A4 (210mm × 297mm cada), com `page-break-after: always` e `overflow: hidden` para garantir que conteúdo nunca quebre entre páginas
- Alternância: Capa (branco) → Stat (laranja) → Solução (branco) → Escopo 01 (branco) → Escopo 02 (laranja) → Escopo 03 (branco) → Diferenciais (laranja) → Âncora (branco) → Detalhamento (branco) → Fechar+PIX (laranja) → Sobre+Footer (branco)
- Sempre 4 páginas laranja no total para criar ritmo visual
- Ancoragem De/Por em cada serviço e no total geral
- Card PIX selecionável (CNPJ 59931598000185, monospace, user-select all)

## Regras invioláveis
- Logo sempre "criativvo" minúsculo em AVEstiana Black, letter-spacing fechado
- Sem travessão "—", sempre vírgula
- Nunca mencionar "9 países" ou variações
- Sempre incluir case Gilson Car como prova social (página 11)
- PIX 59931598000185 (CNPJ) sempre na página 10
- WhatsApp 5516993396988 nos botões
- Stats da página 11: +15M vendas, 30d entrega, 2x Gilson Car
- Validade: 15 dias a partir da data

## Geração de PDF
Brave headless converte HTML em PDF respeitando A4:
```
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless --disable-gpu --no-sandbox --print-to-pdf="..." --no-pdf-header-footer --virtual-time-budget=15000 "file://..."
```

**Why:** Padrão aprovado pelo Matheus depois de várias iterações. Mudar a estrutura sem permissão explícita é retrabalho garantido. Variar só conteúdo (cliente, stat de mercado, valores, descrições de serviço).

**How to apply:** Quando Matheus pedir "proposta", "orçamento" ou similar, partir do template, adaptar conteúdo, gerar PDF, abrir para revisão. Salvar em `criativvo/propostas/` e copiar para `clientes/[Cliente]/`.

Relacionado: [[feedback_criativvo_logo_font]] (regras da logo), [[feedback_escrita_sem_travessao]] (regra do travessão)
