---
name: feedback-post-entrega-jpg-logo
description: Todo post de cliente precisa ser entregue em JPG com a logo aparecendo. Nunca entregar só o HTML.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 65f4d373-98ae-4883-8256-13c04fad4fc6
---

Ao montar qualquer post de cliente (Movisol, Criativvo, etc.), a entrega final precisa ser:

1. **Converter o HTML em JPG sempre.** O cliente nunca abre HTML, ele posta JPG. Nunca terminar a tarefa antregando só o `.html`.
2. **Verificar visualmente o JPG antes de entregar.** Sempre fazer Read da imagem gerada pra conferir que a logo aparece, os textos não vazaram e o layout está íntegro.
3. **URL-encodar paths de imagens com caracteres especiais.** Nomes de arquivo com `+` ou espaço quebram no `src` do HTML (o `+` vira espaço em URL). Usar `%2B` para `+` e `%20` para espaço. Exemplo: `LOGO%20%2B%20ESCRITA%20LOGO%20BRANCA.png`.

**Why:** O cliente Matheus apontou que entreguei o post da Movisol sem JPG e com a logo quebrada (path com `+` não-encoded). Disse explicitamente "não cometa mais esse erro, lembre disso sempre".

**How to apply:** Em qualquer entrega de post:
- Renderizar o HTML para PNG via Brave/Chrome headless (`--screenshot`, `--window-size=1080,1350`)
- Converter PNG para JPG via `sips -s format jpeg -s formatOptions 95`
- Apagar o PNG intermediário
- Fazer Read do JPG final pra verificar visualmente
- Se a logo ou qualquer asset não aparecer, URL-encodar o path no HTML e renderizar de novo

Comando Brave funciona neste mac (Chrome não está instalado):
`"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless --disable-gpu --hide-scrollbars --no-sandbox --window-size=1080,1350 --screenshot="post.png" "file://$PWD/post.html"`

Relacionado: [[feedback-movisol-entrega]] (fluxo de pastas e arquivos), [[feedback-movisol-logo-path]] (caminho relativo das logos).
