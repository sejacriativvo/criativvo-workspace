---
name: gilsoncar-sheets
description: "Planilha de dados do GilsonCar Ibitinga — tráfego pago, conversas, vendas, CPL por semana"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 73351276-78cc-4dcd-b71e-dda3987e8cd3
---

Planilha GilsonCar Ibitinga (tráfego pago):
https://docs.google.com/spreadsheets/d/12RtilonmN5_F5-_n5Ds1R-BdB65YNJ55WT6aIFljgRM/edit?gid=0#gid=0

**Estrutura identificada (aba gid=0):**
- Linhas por semana: ex. "01/03 - 08/03", "09/03 - 15/03", etc.
- Colunas: Período, Investimento (R$), Conversas iniciadas, Custo por lead, Carros vendidos, % convertida, Custo por venda, Lucro antes investimento, ROI, Receita por lead
- Linha de TOTAL por mês ao final de cada grupo
- Meses presentes: Março 2026, Abril 2026, Maio 2026 (parcial), mais meses futuros vazios

**Por que:** Fonte de dados para os relatórios mensais GilsonCar no GitHub Pages.

**Como aplicar:** Ao conectar o relatório à planilha, usar o endpoint `gviz/tq?tqx=out:json` para buscar os dados sem autenticação (sheet pública). Parsear as linhas de TOTAL para os KPIs principais e as linhas semanais para o breakdown semanal.
