---
name: feedback-destaques-organizacao
description: Como organizar arquivos de destaques de Instagram para qualquer cliente — estrutura de pastas e regra do HTML
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fb9c8202-d20a-48ad-b076-d62b5717a06a
---

Destaques de Instagram seguem essa estrutura por cliente:

```
redes-sociais/destaques/
├── capas/                  → JPGs das capas dos destaques (1 por destaque)
├── nome-do-destaque-1/     → JPGs dos stories desse destaque
├── nome-do-destaque-2/     → JPGs dos stories desse destaque
└── ...
```

**Regra do HTML:** depois de renderizar o HTML para JPG, deletar o HTML. Só fica o JPG salvo no projeto.

**Why:** o HTML é só meio de produção, não entregável. Manter HTML salvo confunde a navegação na pasta e duplica arquivos. O cliente só precisa dos JPGs. Se precisar reeditar, recria o HTML do zero (rápido) ou guarda em local temporário.

**How to apply:** pra qualquer cliente, ao criar destaques:
1. Cria HTML → renderiza JPG (Brave headless + sips) → deleta HTML
2. Organiza JPGs em subpastas por destaque, com `capas/` separada
3. Aplica também retroativamente quando reorganizar

Ver também [[feedback_post_entrega_jpg_logo]] (regra mais ampla de entrega em JPG).
