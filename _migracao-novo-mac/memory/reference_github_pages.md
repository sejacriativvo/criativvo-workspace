---
name: github-pages-url-e-estrutura-de-publica-o
description: URL base do GitHub Pages + regra crítica de que tudo publicado precisa estar dentro de docs/
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9ffd890c-fc2e-4be6-b7cb-97d064f6d6b8
---

# GitHub Pages do workspace

**URL base:** `https://sejacriativvo.github.io/criativvo-workspace/`

**Repo:** `sejacriativvo/criativvo-workspace` (pasta local: `CLAUDE CODE/`)

## REGRA CRÍTICA: tudo publicado precisa estar em `docs/`

O GitHub Pages está configurado pra servir **a partir de `docs/`**, não da raiz. Arquivos fora de `docs/` no repo retornam 404.

**Estrutura típica:**
```
docs/
├── relatorios/[cliente]/[arquivo].html       ← relatórios mensais
├── agencia-na-hora/clientes/[cliente]/index.html ← sites Agência na Hora
├── marcio-albrechete/site/index.html         ← site institucional (Marcio APA Previdenciário)
└── [novo-cliente]/site/index.html            ← futuros sites
```

## Quando criar um site / página pra publicar

Pra qualquer site/página HTML que precise URL pública:

1. **Salvar o source no path do cliente** em `Cliente-Criativvo/ativos/[cliente]/site/` (canônico, fonte de verdade)
2. **Copiar pra `docs/[cliente]/site/`** junto com os assets que ele referencia (fotos, logos, etc)
3. Manter os paths relativos do HTML compatíveis (ex: `../assets/fotos-posts/...` requer que `assets/` esteja um nível acima do `site/` na cópia em `docs/`)
4. Commit + push pra `main`
5. URL: `https://sejacriativvo.github.io/criativvo-workspace/[cliente]/site/`

## Exemplos atuais

- **Relatórios GilsonCar:** `https://sejacriativvo.github.io/criativvo-workspace/relatorios/gilsoncar-borborema/relatorio-abril-2026.html`
- **Marcio Albrechete (A·P·A Previdenciário):** `https://sejacriativvo.github.io/criativvo-workspace/marcio-albrechete/site/`
- **Agência na Hora (Matheus Fante, Dr. Matheus Henrique, Thalita Morelli):** `https://sejacriativvo.github.io/criativvo-workspace/agencia-na-hora/clientes/[slug]/`

## How to apply

Sempre que gerar/atualizar um relatório, site ou página pública e fizer push:
1. Confirma que o arquivo está em `docs/`
2. Inclui o link publicado na resposta pra o user enviar ao cliente
3. Avisar que GitHub Pages pode levar 30-90s pra atualizar o cache após push

**Cuidado com paths**: caminhos relativos no HTML (`../assets/`, `./logo.png`) precisam continuar válidos na nova localização em `docs/`. Senão precisa duplicar os assets também.
