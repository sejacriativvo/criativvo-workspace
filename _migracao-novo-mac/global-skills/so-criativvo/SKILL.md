---
name: so-criativvo
description: Sistema Operacional da Criativvo. Gera dashboard semanal (snapshot da operacao), checa pipeline de clientes, status financeiro, follow-ups pendentes, e entregas da semana. Tambem cria tarefas-padrao quando entra cliente novo, registra mudanca de status de cliente (ativo/pausa/inativo), e prepara o material da reuniao de segunda + review de sexta com Alisson. Use quando Matheus disser "dashboard da Criativvo", "status da operacao", "como ta a semana", "review de sexta", "preparar reuniao de segunda", "novo cliente entrou", "cliente saiu", "atualizar pipeline", "follow-up", "/so", "/so-criativvo", "/dashboard-criativvo", "/operacao", "/status-semana".
---

# /so-criativvo — Sistema Operacional da Criativvo

Skill que opera o "SO da Criativvo". A operação viva fica no Notion (time) + Google Sheets privada (financeiro Matheus+Victor); esta skill gera o dashboard semanal a partir das pastas de cliente, das memórias e do CLAUDE.md.

## O que essa skill faz

1. **Dashboard semanal** — snapshot da operação (entregas, pipeline, financeiro, alertas)
2. **Pipeline updates** — registra mudanças de status de cliente
3. **Onboarding cliente novo** — cria tarefas-padrão + pasta + memória
4. **Preparação de reuniões** — material pra segunda (alinhamento) e sexta (review Alisson)
5. **Auditoria** — identifica clientes sumidos, propostas paradas, dependências (ex: Dudu como single point)

## Sub-comandos suportados

| Comando | O que faz |
|---------|-----------|
| `/so` ou `/so-criativvo` | Dashboard semanal completo (default) |
| `/so dashboard` | Mesmo que acima |
| `/so cliente-novo [Nome]` | Cria estrutura completa (pasta + memória + tarefas-padrão de onboarding) |
| `/so cliente-status [Nome] [Status]` | Muda status (Lead/Proposta/Ativo/Pausa/Frio/Inativo) e atualiza memória + pasta |
| `/so reuniao-segunda` | Gera pauta + lista de tarefas-da-semana por pessoa |
| `/so review-sexta` | Gera material do review com Alisson (entregas, não-entregas, saúde clientes) |
| `/so pipeline` | Visão só do pipeline (Leads, Propostas, Ativos por valor, Renovações) |
| `/so financeiro` | Lê Sheets financeira (se Matheus colar dados ou der link) e gera análise |
| `/so audit` | Auditoria: clientes sem interação >30d, propostas paradas >14d, single points |

## Dashboard semanal — formato padrão

Quando o usuario rodar `/so` sem sub-comando, gerar dashboard com 6 secoes:

### 📊 Snapshot da semana
- Total tarefas entregues vs planejadas (%)
- Entregas por pessoa (Anderson, Luis, Dudu, Alisson)
- Posts publicados na semana
- Reuniões realizadas

### 👥 Saúde dos clientes
- 8 ativos: status individual (✅ tudo certo / ⚠️ atenção / 🚨 ação urgente)
- Critérios de atenção:
  - Sem entrega há >7 dias
  - Cliente reclamou (registrar em Notes do CRM)
  - Renovação nos próximos 30 dias

### 💼 Pipeline comercial
- Propostas enviadas + dias parado + próximo follow-up
- Leads novos da semana
- Conversão do mês (proposta → ativo)

### 💰 Sinais financeiros (se Matheus colar dados ou autorizar leitura)
- MRR atual
- Cobranças pendentes do mês
- Custo de IA na semana (Anthropic API)
- Runway estimado

### 🚨 Alertas (top 3 prioridades)
- Single points of failure (ex: Dudu sobrecarregado)
- Cliente em risco
- Tarefa atrasada crítica
- Custo fora do padrão

### 🎯 Recomendações pra próxima semana
- 1-3 ações que Matheus deveria tomar
- Sempre concreto, sempre com "owner" claro

## Onde estão os dados

Como ainda não temos integração API com Notion/Sheets, na primeira fase a skill funciona em 3 modos:

**Modo 1: Pergunta + manual** (default, sempre funciona)
A skill pergunta ao Matheus o que precisa saber, gera o relatório baseado nas respostas.
Exemplo: "Me passa: tarefas entregues essa semana por pessoa, e algum cliente que reclamou."

**Modo 2: Lê dos arquivos locais** (sempre que possivel)
- Pasta de clientes em `ORGANIZAÇÃO/Cliente-Criativvo/` (status pela pasta: ativos/, inativos/, propostas-enviadas/)
- Memórias em `~/.claude/projects/-Users-matheusvareschi-CLAUDE-CODE/memory/` (contexto de cada cliente)
- CLAUDE.md (visão geral)

**Modo 3: API Notion + Sheets** (futuro, quando Alisson autorizar token)
- Integration token do Notion (read-only)
- Sheets API com service account
- Quando isso for configurado, atualizar essa SKILL.md com as credenciais (em .env separado)

## Tom de saída

- Direto, sem rodeio, sem travessao
- Numero antes de adjetivo ("8 ativos, 2 em risco" > "alguns clientes preocupam")
- Sempre dar a recomendacao pratica no fim
- Se algo está bom, dizer "ta bom" e seguir. Nao elogiar à toa
- Maximo 1 pagina de output (Matheus le no celular entre cliente e cliente)

## Quando criar tarefa-padrao de onboarding (sub-comando cliente-novo)

Quando Matheus rodar `/so cliente-novo [Nome]`, criar:

1. **Pasta:** `ORGANIZAÇÃO/Cliente-Criativvo/ativos/[nome-kebab-case]/` seguindo `_modelo-cliente/`
2. **Memoria:** `project_[nome].md` em `~/.claude/projects/-Users-matheusvareschi-CLAUDE-CODE/memory/`
3. **Linha no MEMORY.md** com hook do cliente
4. **Lista de tarefas iniciais sugeridas** (pra Matheus copiar pro Notion):
   - [ ] Onboarding completo (skill `/onboarding-cliente`) — Matheus
   - [ ] Adicionar ao CRM com Status: Ativo, valor mensal, contatos — Alisson
   - [ ] Criar pasta no Drive compartilhado do cliente — Alisson
   - [ ] Configurar Mlabs com perfis do cliente — Dudu
   - [ ] Criar campanha Meta Ads inicial (skill `/meta-ads-ratos`) — Alisson
   - [ ] Agendar reuniao de kickoff com cliente — Victor
   - [ ] Primeiros 5 templates de post adaptados pra marca do cliente — Matheus
   - [ ] Atualizar CLAUDE.md adicionando o cliente na lista
5. **Confirma com Matheus** antes de criar (mostra o que vai fazer, ele aprova)

## Quando mudar status de cliente (sub-comando cliente-status)

Sintaxe: `/so cliente-status [Nome] [Status]`

Status validos: `Lead`, `Proposta`, `Ativo`, `Pausa`, `Frio`, `Inativo`

Quando rodar:
1. **Move a pasta** entre `ativos/`, `propostas-enviadas/`, `inativos/`
2. **Atualiza a memoria** do cliente com data e razao da mudanca
3. **Atualiza o MEMORY.md** se necessario
4. **Atualiza o CLAUDE.md** (carteira ativa)
5. **Cria tarefa de follow-up** se aplicavel (ex: Inativo → tarefa de reativacao em 90 dias)
6. **Pergunta ao Matheus**: motivo da mudanca pra registrar como aprendizado

## Auditoria (sub-comando audit)

Roda checagens automaticas:

- **Clientes ativos sem atualizacao na pasta > 30 dias** → flag
- **Propostas-enviadas > 14 dias sem follow-up** → flag
- **Pessoas sem tarefa atribuida na ultima semana** → flag (alguem ocioso?)
- **Dependencia critica**: clientes que só Dudu atende → mostrar pra Matheus pensar em redundancia
- **Margem em risco**: custo de IA na semana / receita estimada (se for > 15%, alerta)

## Memorias relacionadas

- [[project-criativvo-time]] — quem faz o que
- [[project-criativvo-sistema-operacional]] — decisao arquitetural Notion + Sheets
- [[feedback-clientes-organizacao]] — regra de pasta de cliente novo
- [[feedback-escrita-sem-travessao]] — tom de voz
