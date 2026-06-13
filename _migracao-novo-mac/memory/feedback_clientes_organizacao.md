---
name: feedback-clientes-organizacao
description: "Padrão obrigatório da pasta Cliente-Criativvo/ — subpastas por status (ativos, propostas-enviadas, inativos), kebab-case, assets/logo/, estrutura mínima"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9abf3f4d-b4a9-4db5-b60a-5697dc3f4044
---

Toda pasta de cliente fica em `Cliente-Criativvo/<status>/<cliente>/` (na raiz do workspace). Os 3 status possíveis: `ativos/`, `propostas-enviadas/`, `inativos/`. Modelo de referência: `Cliente-Criativvo/_modelo-cliente/`. Regras documentadas em `Cliente-Criativvo/README.md`.

**Em 2026-05-24** a pasta `clientes/` foi renomeada pra `Cliente-Criativvo/` e os clientes organizados por status. Quando o status do cliente mudar (fechou proposta, encerrou contrato), mover a pasta inteira pra outra subpasta — nunca duplicar.

**Why:** Em 2026-05-20 o Matheus pediu pra padronizar a organização dos clientes. Espaços + maiúsculas + acentos em nomes de pasta quebram path relativos em HTMLs publicados no GitHub Pages (case-sensitive em Linux, case-insensitive no macOS) e travam scripts no shell. Assets soltos no root do cliente também quebram quando o post HTML usa path tipo `../../../assets/logo/X.png`.

**How to apply:**

1. **Nome de pasta novo cliente:** sempre kebab-case, sem espaços, sem acentos, sem maiúsculas. Ex: `movisol`, `gilsoncar-veiculos`, `maccari-store`, `feffo-cortinas`, `vr-studio`.

2. **Estrutura mínima copiada do `_modelo-cliente/`:**
   ```
   <cliente>/
   ├── CLAUDE.md
   ├── briefing.md
   ├── assets/{logo,fotos-posts}/
   ├── redes-sociais/
   │   ├── posts/DD-MM-AAAA/
   │   ├── estrategia-conteudo.md
   │   ├── historico-posts.md
   │   ├── historico-imagens.md
   │   └── templates-posts-<cliente>.html
   └── relatorio/
   ```

3. **Logo SEMPRE em `assets/logo/`** — nunca solta no root. Path relativo de post: `../../../assets/logo/X.png`.

4. **Multi-unidade** (ex: GilsonCar Borborema + Ibitinga): pasta-mãe com `assets/` e `CLAUDE.md` compartilhados + subpastas `<cliente>-<unidade>/` com estrutura completa cada.

5. **Cliente novo:** `cp -r _modelo-cliente <kebab-case>` e preencher `CLAUDE.md` + `briefing.md`.

6. **Clientes legados** (Movisol, Maccari Store, GilsonCar Veículos, Fêffo Cortinas, VR STUDIO, PD Motors, Reinaldo Meirelles): ficam no nome atual por enquanto. Migração só sob pedido explícito porque renomear quebra paths em HTMLs já publicados no GitHub Pages.

7. **Status atual (2026-05-24)** — `ativos/`: Fêffo Cortinas, GilsonCar Veículos, Maccari Store, Movisol, PD Motors, VR STUDIO, prime-motors, vermeister. `propostas-enviadas/`: Carvalho Costa Adv, Reinaldo Meirelles. `inativos/`: (vazio).

Relacionado: [[feedback_movisol_logo_path]], [[feedback_movisol_entrega]], [[reference_github_pages]].
