# MCPs para configurar no novo Mac

Rodar esses comandos no Claude Code do novo Mac após o setup.sh.

## Via Claude Code (Menu > MCPs ou comandos diretos)

### 1. Higgsfield (projeto — sem credencial)
```
/mcp add higgsfield --type http --url https://mcp.higgsfield.ai/mcp
```

### 2. Playwright (projeto — sem credencial)
```
/mcp add playwright --command "npx @playwright/mcp@latest"
```

### 3. Magnific (global — API key)
Pegar a key no Magnific dashboard.
```
/mcp add magnific --type http --url https://api.magnific.com/mcp --header "x-magnific-api-key: SUA_KEY"
```

### 4. Shopify Maccari (projeto)
Credenciais estão em: Shopify Partner Dashboard > App > Maccari Store
- Domain: `0ju4im-ta.myshopify.com`
- API Version: `2026-04`

### 5. Shopify Vermeister (global)
Credenciais estão em: Shopify Partner Dashboard > App > Vermeister
- Domain: `vermeister.myshopify.com`
- API Version: `2025-04`

### 6. Google Drive (projeto)
Requer reautenticação OAuth no novo Mac.
- Credencial atual em: `~/.config/criativvo/gdrive-credentials.json`
- Se transferir via AirDrop: copiar esse arquivo pro mesmo caminho no novo Mac

---

## Atalho: copiar .claude.json via AirDrop

O jeito mais rápido é copiar o arquivo `~/.claude.json` do Mac atual pro novo Mac via AirDrop.
Ele contém TODAS as configurações de MCP já prontas, incluindo os tokens.

**No Mac atual:**
```bash
# Abrir a pasta no Finder pra compartilhar via AirDrop
open -R ~/.claude.json
```

**No novo Mac:** colocar em `~/.claude.json` (mesma localização).

Depois disso, só rodar `setup.sh` e fazer login com `claude login`.
