# Migração para novo Mac

## Passo a passo

### 1. Clonar o workspace
```bash
git clone https://github.com/sejacriativvo/criativvo-workspace.git "CLAUDE CODE"
cd "CLAUDE CODE"
```

### 2. Transferir .claude.json via AirDrop (mais fácil)
No Mac atual, abrir o Finder na pasta home e compartilhar `~/.claude.json` via AirDrop pro novo Mac.
Colocar no mesmo caminho: `~/.claude.json`

Isso já traz TODOS os MCPs configurados, tokens e preferências.

### 3. Rodar o setup
```bash
bash _migracao-novo-mac/setup.sh
```

Isso vai:
- Instalar o Claude Code CLI (`@anthropic-ai/claude-code`)
- Copiar as skills globais pro `~/.claude/skills/`
- Aplicar o `settings.json` (tema dark, modelo sonnet)
- Clonar os sub-repos de cliente (CriativvoUI, edson-veiculos, sites)
- Instalar deps de automacoes/

### 4. Fazer login
```bash
claude login
```

### 5. Se não transferiu o .claude.json
Ver `mcp-setup.md` pra reconfigura cada MCP manualmente.

---

## Repos no GitHub (todos em sejacriativvo)
- `criativvo-workspace` — workspace principal (esse)
- `mazyui-criativvo` — CriativvoUI (painel)
- `edson-veiculos` — site Edson Veículos
- `gi-vareschi` — site Gi Vareschi
- `mariana-medeiros-site` — site Mariana Medeiros
- `carvalho-costa-adv` — site Carvalho Costa Adv
