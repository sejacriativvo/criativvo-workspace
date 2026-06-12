# Agência na Hora

Empresa de oferta única, separada da operação 360 da Criativvo. Vende um pacote fechado de presença digital pronto pra rodar, pra qualquer nicho, com processo industrializado e entrega rápida.

## Posicionamento

**Promessa:** sua presença digital completa no ar, pronta pra vender, sem você montar nada.

**Pra quem:** negócio pequeno ou médio que precisa aparecer profissional no digital (site + Google + redes + anúncio) e não quer contratar agência tradicional cara nem se virar sozinho com várias ferramentas.

**Diferencial:** uma oferta só, preço fechado, entrega via processo (não depende de gênio criativo a cada cliente). O cliente faz uma call, manda o material, e recebe tudo montado.

## Oferta (única)

Pacote de entrada **~R$ 2.000**, qualquer nicho. Inclui:

- **Site** profissional responsivo, pronto pra usar
- **Google Meu Negócio** configurado/otimizado (endereço, telefone, categorias)
- **Tráfego pago** ativado via automação (Meta/Google) pra trazer lead desde o início
- **Carrosséis** e material de rede social no padrão da marca do cliente

Pacotes maiores (10k+) pra clientes que querem volume e gestão contínua.

> Cada cliente exige design único. Nunca clonar estrutura, fonte ou estética de outro cliente.

## Fluxo de entrega

1. **Venda fechada** (Victor / indicação / YouTube)
2. **Call de descoberta** gravada e transcrita. O vendedor segue o guia em `materiais/perguntas-onboarding-vendedor.md`
3. **Montagem** a partir da transcrição rodando a skill `/onboarding-agencia` (site + GMN + tráfego + carrosséis)
4. **Entrega + 1 rodada de ajuste**

## Time e responsabilidades

Detalhe em `materiais/playbook-*.{html,pdf}`:

- **Matheus** direção, estratégia, conteúdo/YouTube (lead), padrão de qualidade. Não entra na produção.
- **Victor** comercial, fecha as vendas.
- **Alisson** tráfego pago e operação.
- **Produção (Anderson + Luis)** montagem de site, carrossel e entrega do dia a dia.

## Estrutura da pasta

- `marca/` identidade da Agência na Hora. Logo oficial: `marca/logo-branca.png` (símbolo branco, fundo transparente, usar sobre fundo escuro/colorido)
- `materiais/` playbooks por pessoa + guia de perguntas da call de onboarding
- `clientes/` uma pasta por cliente entregue (kebab-case). Entregas atuais: `matheus-fante`, `dr-matheus-henrique`, `thalita-morelli`
- `campanhas/` material de campanha/aquisição
- `vendas/` material comercial

## Marca

Logo: símbolo de blobs em círculo, sempre branco (`marca/logo-branca.png`), sobre fundo escuro ou colorido (nunca sobre branco sem fundo de apoio).

Duas paletas, não confundir:

- **Corporativa (playbooks/docs internos):** laranja `#ff5a1f`, tinta `#15171c`, Inter.
- **Conteúdo / carrossel:** escuro `#071016`, branco `#F4F2EC`, verde limão `#EFFF7A`, azuis `#BFD8F1`/`#004CFF`. Design system completo em `marca/design-system-carrossel.md` + template `marca/template-carrossel.html`. Carrosséis são gerados pela skill `/carrossel-agencia-na-hora` e sempre seguem esse padrão.
