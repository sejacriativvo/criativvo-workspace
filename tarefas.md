# Tarefas — Criativvo

> Use esse arquivo pra registrar pendências, próximos passos e itens em andamento.

---

## Em andamento

### 🚨 URGENTE essa semana (24-30 maio)
- [ ] **Prime Motors:** inauguração 30/05 (6 dias). Verificar site Shopify + posts antecipação + filmagem. Owner: Matheus + Victor
- [ ] **Vermeister:** completar briefing (logo, paleta, contato, acessos Shopify). Owner: Matheus
- [ ] **Dudu:** documentar SOP de edição de vídeo direto na Wiki do Notion. Owner: Dudu, 30-45min

### 🏗️ Sistema Operacional criativvo-os (setup primeira vez)
- [x] Projeto Next.js criado em `criativvo-os/`
- [x] Schema Supabase pronto em `criativvo-os/supabase/migrations/001_initial_schema.sql`
- [x] Build local OK (npm install + npm run build sem erro)
- [ ] Criar projeto Supabase (supabase.com → região SP)
- [ ] Rodar migration no SQL Editor do Supabase
- [ ] Criar os 6 users no Supabase Auth com user_metadata `{nome, role}`
- [ ] Rodar seed de clientes (bloco comentado fim da migration)
- [ ] Preencher `.env.local` com URL + ANON_KEY
- [ ] `npm run dev` e testar local
- [ ] Deploy Vercel + env vars
- [ ] Compartilhar URL com o time + treinar Alisson

---

## MCPs pra instalar

- [ ] Notion — `claude mcp add notion -- npx -y @notionhq/notion-mcp-server`
- [ ] Canva — `claude mcp add canva -- npx -y @canva/canva-mcp-server`

---

## Processos pra mapear depois

- [ ] Agendar posts — criar skill `/legenda-post` que gera legenda + hashtags pro Du agendar no Mlabs
- [x] Integração Google Drive — ao criar conteúdo pra um cliente, subir automaticamente na pasta dele no Drive para o Du acessar e agendar

---

## Backlog

---

## Concluído

- [x] /mapear rodado — 4 skills criadas: proposta-comercial, roteiro-cliente, onboarding-cliente, (relatório pendente)
- [x] meta-ads-ratos instalado globalmente
- [x] Playwright instalado (diagnóstico de site)
- [x] Setup inicial Criativvo — contexto, design guide e estrutura de pastas
