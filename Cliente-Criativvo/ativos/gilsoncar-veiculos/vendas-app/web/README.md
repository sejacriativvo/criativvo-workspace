# GilsonCar Vendas — versão real (web)

App de estoque e negociação da GilsonCar. Vendedor vê carros + faixa de desconto
permitida (semáforo verde/amarelo/vermelho). Admin (Sr. Gilson) vê custo, lucro e
margem. **O custo é bloqueado no banco (RLS): o vendedor não consegue vê-lo nem
abrindo o navegador.**

- **Stack:** Next.js 16 + Supabase (banco + login) + Vercel (deploy). PWA instalável.
- Protótipo de referência: `../prototipo/index.html`

---

## Setup — passo a passo (faça uma vez)

### 1. Criar o projeto no Supabase (3 min)
1. Entre em https://supabase.com → **New project**.
2. Dê um nome (`gilsoncar-vendas`), escolha região **South America (São Paulo)**,
   defina uma senha de banco e crie.
3. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public** key
   - **service_role** key (secreta)

### 2. Criar as tabelas e a segurança
1. No Supabase: **SQL Editor → New query**.
2. Cole TODO o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. (Opcional, pra testar) Cole [`supabase/seed.sql`](supabase/seed.sql) → **Run**.
   Isso popula 47 carros e 10 clientes de exemplo.

### 3. Criar o usuário admin (Sr. Gilson)
1. No Supabase: **Authentication → Users → Add user** (e-mail + senha).
2. **SQL Editor**: abra [`supabase/make-admin.sql`](supabase/make-admin.sql),
   troque o e-mail pelo que você acabou de cadastrar → **Run**.
3. Para criar vendedores depois: mesmo caminho (Add user), mas **não** rode o
   make-admin neles — eles já entram como `vendor` automaticamente.

### 4. Rodar no seu computador
```bash
cd web
cp .env.local.example .env.local   # e preencha com as chaves do passo 1
npm install
npm run dev
```
Abra http://localhost:3000 e entre com o e-mail/senha do admin.

### 5. Publicar em produção (Vercel)
1. Suba a pasta `web/` para um repositório no GitHub (org `sejacriativvo`).
2. Em https://vercel.com → **Add New → Project** → importe o repositório.
3. Em **Root Directory**, aponte para a pasta `web` (se subiu o workspace inteiro:
   `Cliente-Criativvo/ativos/gilsoncar-veiculos/vendas-app/web`).
4. Em **Environment Variables**, cole as 3 chaves do `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
5. **Deploy**. Pronto: a Vercel te dá uma URL `https://....vercel.app`.
6. No celular: abra a URL no Chrome/Safari → **Adicionar à Tela de Início**
   (vira ícone de app — é PWA).

> Importante: link de produção **não** vai no GitHub Pages público. É ferramenta
> interna; fica só na Vercel, atrás do login.

---

## Como o app protege o custo (resumo técnico)

- Tabela `cars` tem `cost`. RLS deixa **só admin** ler essa tabela crua.
- O vendedor lê a VIEW `vehicles_public`, que calcula `max_discount` e o semáforo
  a partir do custo, mas **nunca devolve a coluna `cost`**.
- Mesmo chamando a API direto, o vendedor recebe o desconto permitido, não o custo.

Regra do semáforo (configurável em `settings`):
- desconto máximo = 40% da margem, arredondado pra centena
- 🟢 margem ≥ 13% · 🟡 7%–13% · 🔴 < 7%

---

## Fase 2 — Sync com a Shopify (opcional)
Quando o Gilson mandar o token (`read_products`, `read_inventory`), entra um job
que importa o estoque automaticamente e preenche fotos/preços. O custo continua
sendo cadastrado manual pelo admin (a Shopify não tem essa info). Campos já
preparados: `cars.shopify_product_id`, env `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_ADMIN_TOKEN`.

## Telas
- `/login` — entrada por e-mail/senha
- `/estoque` — lista com busca, filtros e semáforo (admin vê custo/lucro no card)
- `/estoque/[id]` — detalhe + card grande de negociação
- `/cadastrar` — cadastro/edição de carro (admin)
- `/clientes` — funil de negociação (lead → visita → negociando → vendeu/perdeu)
- `/dashboard` — KPIs de estoque e vendas (admin)
