---
name: feedback-movisol-noticia
description: "Movisol — padrão visual para posts de notícia (pill vermelho na capa)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: current
---

Posts de notícia recebem um pill vermelho na capa (slide 1) no lugar do pill genérico.

**CSS:**
```css
.pill-news {
  background: #E8232A;
  color: #fff;
  /* mesma forma dos outros pills do sistema */
}
```

**HTML:** `<span class="pill-news">Notícia</span>`

**Why:** elemento visual fixo que o seguidor aprende a associar com conteúdo novo e relevante. Vermelho = urgência/notícia. Aparece apenas em posts de notícia — nunca em outros contextos.

**How to apply:** sempre que o post for classificado como notícia, substituir o pill da capa por `.pill-news`. Posts de educação, prova social, dado e CTA usam os pills do sistema padrão (glass, solid, outline).
