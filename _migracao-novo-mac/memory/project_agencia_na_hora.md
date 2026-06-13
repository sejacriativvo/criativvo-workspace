---
name: project-agencia-na-hora
description: Empresa nova (separada da Criativvo) que vende implementação digital com IA pra negócio local de qualquer nicho; oferta única site + presença digital
metadata: 
  node_type: memory
  type: project
  originSessionId: 7a0d45af-1410-4b79-a062-637c5161a2d4
---

**Agência na Hora** é uma empresa nova dos sócios **Matheus + Victor + Alisson** (Vagner NÃO faz parte), separada da Criativvo (que continua nichada em veículos). É a ideia do briefing que eles fizeram numa call em maio/2026 (transcrita). A produção é tocada por **Anderson + Luis** (que entraram pra operação; decisão da reunião Victor/Alisson: tirar o Matheus da operação, founder não pode ser gargalo).

**IMPORTANTE (correção):** o plano de R$ 10.000+, instalar o MazyOS na empresa do cliente e a mecânica de devolver verba de tráfego é o modelo do **VAGNER** pros clientes dele, NÃO da Agência na Hora. Não confundir.

**A oferta da Agência na Hora:** uma **oferta única, ~R$ 2.000, pra qualquer nicho** (negócio local). Dentro dela:
1. **Site** profissional (alto nível)
2. **Tráfego automatizado** via MCP (Google Ads) — precisa de BM habilitada; verba de anúncio por conta do cliente
3. **Carrosséis automatizados** com base no design do site
4. **Google Meu Negócio** configurado

**Fluxo de onboarding (skill `/onboarding-agencia`):** venda (Victor) → call no Meet com perguntas sobre o negócio → transcrição (ferramenta Yati) → guia de perguntas em `agencia-na-hora/materiais/perguntas-onboarding-vendedor.md` → joga a transcrição no Claude → monta site + tráfego (MCP) + carrosséis + Google Meu Negócio.

**Papéis:** Victor = comercial (venda + call de descoberta). Produção = Anderson + Luis (site + carrosséis + Google Meu Negócio, via MazyOS). Alisson = tráfego (MCP) + Head de Ops (dono do pipeline). Matheus = dono (estratégia, conteúdo/YouTube, cliente-chave, padrão de qualidade); FORA da operação do dia a dia. Fluxo: Lead → Victor vende+call → Produção monta → Alisson sobe tráfego → entrega → Alisson recorrência/pipeline.

**Recomendação técnica (do Vagner, vale pra nós):** pra site de cliente novo, **começar repositório do zero com MazyOS** (não jogar no workspace gigante, gasta token e fica lento). Skills sempre na raiz, nunca dentro de subpasta.

**Manuais:** 1 PDF por papel em `agencia-na-hora/materiais/` (playbook-victor, playbook-matheus, playbook-alisson, playbook-producao = Anderson+Luis). Design clean, elementos grandes.

**Projeto imediato:** concessionária em SP (struggling), de graça, pra gravar vídeo de YouTube. Entrega: site + Google Meu Negócio + tráfego (vídeo de carro) + carrosséis. Matheus começa na segunda. Posicionamento do canal: "empresa de IA pra negócio local", pegada jovem mas com credibilidade (escritório em Ribeirão emprestado).

Relacionado: [[project-mazyos-migracao]], [[project-criativvo-time]].
