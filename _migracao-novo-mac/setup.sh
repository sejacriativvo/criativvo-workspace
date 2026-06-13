#!/bin/bash
# Setup Claude Code no novo Mac
# Rodar DEPOIS de clonar o criativvo-workspace
# Uso: bash _migracao-novo-mac/setup.sh

set -e

WORKSPACE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
SCRIPT_DIR="$WORKSPACE_DIR/_migracao-novo-mac"

echo "=== Setup Claude Code - Criativvo ==="
echo "Workspace: $WORKSPACE_DIR"
echo ""

# 1. Instalar Claude Code CLI
echo "[1/5] Instalando Claude Code CLI..."
if ! command -v claude &> /dev/null; then
  npm install -g @anthropic-ai/claude-code
  echo "Claude instalado."
else
  echo "Claude já instalado: $(claude --version 2>/dev/null || echo '?')"
fi

# 2. Copiar skills globais
echo ""
echo "[2/5] Copiando skills globais para ~/.claude/skills/..."
mkdir -p ~/.claude/skills
cp -r "$SCRIPT_DIR/global-skills/"* ~/.claude/skills/
echo "Skills copiadas:"
ls ~/.claude/skills/

# 3. Copiar settings globais
echo ""
echo "[3/5] Aplicando settings (tema dark, modelo sonnet)..."
mkdir -p ~/.claude
cp "$SCRIPT_DIR/settings-global.json" ~/.claude/settings.json
echo "Settings aplicados."

# 4. Clonar sub-repos dentro da pasta
echo ""
echo "[4/5] Clonando sub-repos de cliente..."
cd "$WORKSPACE_DIR"

declare -A SUBREPOS=(
  ["CriativvoUI"]="https://github.com/sejacriativvo/mazyui-criativvo.git"
  ["edson-veiculos"]="https://github.com/sejacriativvo/edson-veiculos.git"
  ["Cliente-Criativvo/ativos/gi-vareschi/midia-kit-site"]="https://github.com/sejacriativvo/gi-vareschi.git"
  ["Cliente-Criativvo/ativos/mariana-medeiros/site"]="https://github.com/sejacriativvo/mariana-medeiros-site.git"
  ["Cliente-Criativvo/propostas-enviadas/carvalho-costa-adv/site"]="https://github.com/sejacriativvo/carvalho-costa-adv.git"
)

for path in "${!SUBREPOS[@]}"; do
  url="${SUBREPOS[$path]}"
  if [ ! -d "$path" ]; then
    echo "  Clonando $path..."
    mkdir -p "$(dirname "$path")"
    git clone "$url" "$path"
  else
    echo "  $path já existe, pulando."
  fi
done

# 5. Copiar memória acumulada do Claude
echo ""
echo "[5/6] Restaurando memória do Claude (contexto de clientes, feedbacks, projetos)..."
PROJECT_HASH=$(echo -n "$WORKSPACE_DIR" | tr '/' '-' | sed 's/^-//')
MEMORY_DEST="$HOME/.claude/projects/$PROJECT_HASH/memory"
mkdir -p "$MEMORY_DEST"
cp "$SCRIPT_DIR/memory/"*.md "$MEMORY_DEST/"
echo "Memória restaurada em: $MEMORY_DEST"
echo "Arquivos: $(ls $MEMORY_DEST | wc -l | tr -d ' ')"

# 6. Instalar deps da automação
echo ""
echo "[6/6] Instalando dependências de automacoes/..."
if [ -f "$WORKSPACE_DIR/automacoes/package.json" ]; then
  npm install --prefix "$WORKSPACE_DIR/automacoes"
  echo "Deps instaladas."
fi

echo ""
echo "=== CONCLUÍDO ==="
echo ""
echo "PRÓXIMOS PASSOS MANUAIS (ver mcp-setup.md):"
echo "  1. Fazer login no Claude Code: claude login"
echo "  2. Adicionar MCPs com credenciais via Claude Code"
echo "  3. Configurar gdrive (OAuth)"
