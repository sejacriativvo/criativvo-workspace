---
name: feedback-movisol-entrega
description: "Movisol — fluxo de entrega de posts (quem publica, onde salvar, como organizar)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd55d135-dc23-4cbd-8bbe-8be8f9ad3020
---

Quem publica os posts é o Marcelo (dono, pai do Matheus). Ele acessa pelo Google Drive.

**A cada post criado, salvar nos dois lugares:**

Local:
`Cliente-Criativvo/ativos/movisol/redes-sociais/posts/DD-MM-AAAA/`
- `slide-01.jpg`, `slide-02.jpg`... — JPEGs prontos para publicar
- `legenda.txt` — legenda + hashtags prontos para copiar
- HTML e imagens temporárias são apagados após a conversão. Não salvar HTML na pasta final.

Google Drive (sincroniza automaticamente):
`~/Library/CloudStorage/GoogleDrive-matheusvareschicontato@gmail.com/Meu Drive/Clientes/Movisol/Posts Movisol/DD-MM-AAAA/`
- Mesmos arquivos: `slide-XX.jpg` + `legenda.txt`

**Regra de alteração:** apagar pasta antiga e recriar com os arquivos corrigidos. Nunca manter versões antigas.

**Nomenclatura:** pasta nomeada pela data do post (ex: 19-05-2026). Registrar no historico-posts.md após cada entrega.

**Conversão HTML → JPEG:** Brave Browser headless (`--screenshot`) gera PNG, depois `sips -s format jpeg` converte para JPEG.

Marcelo posta direto do Drive sem revisão prévia do Matheus. Se houver alteração, o Matheus avisa depois.

**Why:** Marcelo precisa acessar o conteúdo de forma simples e autônoma, sem depender do Matheus para publicar.

**How to apply:** nunca entregar um post sem criar as pastas e os arquivos nos dois destinos.
