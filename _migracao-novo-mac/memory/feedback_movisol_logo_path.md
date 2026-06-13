---
name: feedback-movisol-logo-path
description: "Movisol — logos ficam em assets/logo/, não direto em assets/"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 92d6b294-ec2d-4693-bcd1-9f646ce7a547
---

Os arquivos de logo da Movisol ficam em `assets/logo/`, não na raiz de `assets/`.

Arquivos disponíveis:
- `assets/logo/LOGO + ESCRITA LOGO BRANCA.png` — logo completa branca (slides escuros/azuis)
- `assets/logo/ICONE DA LOGO BRANCA.png` — ícone branco (rodapé dos slides escuros)
- `assets/logo/ICONE + ESCRITA LOGO AZUL.png` — logo completa azul (slides brancos/claros)

Caminho relativo correto para posts em `redes-sociais/posts/DD-MM-AAAA/`:
`../../../assets/logo/NOME-DO-ARQUIVO.png`

**Why:** Logo apareceu corrompida/invisível no primeiro post porque o HTML foi gerado com `../../../assets/NOME.png` (sem o subfolder `logo/`), que não existe — o Puppeteer renderiza o `<img>` quebrado.

**How to apply:** Sempre que gerar HTML de post da Movisol, verificar que todos os `src` de logo incluem `/logo/` no caminho antes de exportar os JPGs.
