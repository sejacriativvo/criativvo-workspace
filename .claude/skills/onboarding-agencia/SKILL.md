---
name: onboarding-agencia
description: >
  Onboarding de cliente novo da Agência na Hora. Conduz da venda fechada até a entrega:
  organiza a call de descoberta (com guia de perguntas pro vendedor), consome a transcrição
  e gera a oferta única (site + tráfego automatizado via MCP + carrosséis + Google Meu Negócio).
  Use quando fechar venda da Agência na Hora, ou quando o usuário disser "onboarding",
  "entrar cliente novo da agência na hora", "novo cliente agência na hora", "/onboarding-agencia".
---

# /onboarding-agencia — Onboarding da Agência na Hora

Transforma uma venda fechada em entrega, sem improviso. Essa skill é o trilho do processo: da call de descoberta até tudo no ar.

## A oferta (uma só, qualquer nicho)

A Agência na Hora (sócios Matheus + Victor + Alisson) vende **uma oferta única, ~R$ 2.000**, pra negócio local de qualquer nicho. Dentro dela:

1. **Site** profissional (alto nível)
2. **Tráfego automatizado** via MCP (Google Ads) — precisa de BM habilitada; a verba de anúncio é por conta do cliente
3. **Carrosséis automatizados** com base no design do site
4. **Google Meu Negócio** configurado

> Não confundir com o modelo do Vagner/MazyOS (pacotes de 10k+, instalar MazyOS na empresa do cliente, devolver verba de tráfego). Isso é o negócio dele, não o da Agência na Hora.

## Fase 1 — Call de descoberta

A venda fecha, e o closer faz uma call (Meet) com o cliente. Objetivo: extrair tudo que o sistema precisa pra montar a entrega.

- Conduzir a call pelo **guia de perguntas**: `agencia-na-hora/materiais/perguntas-onboarding-vendedor.md` (versão pra imprimir: `.html` na mesma pasta).
- **Gravar e transcrever** a call (ferramenta de transcrição, ex: Yati/Fathom). A transcrição é o insumo principal.
- Se o cliente não puder fazer call, aceitar áudio contando sobre o negócio. Call é sempre melhor.

## Fase 2 — Receber a transcrição

- Pedir a transcrição da call (colar no chat ou salvar em `dados/`).
- Ler e extrair: nome do negócio, nicho, o que vende, público-alvo, diferencial, endereço, redes sociais atuais, tom de voz, fotos/material disponível.
- Se faltar algo crítico (ex: endereço pro Google Meu Negócio), listar o que precisa pedir antes de seguir.

## Fase 3 — Criar o espaço do cliente

- **Projeto grande (com site):** começar **repositório do zero com o MazyOS** pra esse cliente, fora desse workspace. Motivo: site é pesado e segurar tudo numa pasta só gasta token e deixa o Claude lento. (Recomendação do Vagner/MazyOS.)
- **Entrega leve (só conteúdo/carrossel):** pasta dentro de `agencia-na-hora/clientes/<cliente-em-kebab-case>/`.
- Preencher o contexto do cliente (CLAUDE.md / `_memoria`) com o que saiu da transcrição.

## Fase 4 — Gerar a entrega (os 4 itens da oferta)

**1. Site** (Produção: Anderson + Luis)
- Interface simples pro cliente **adicionar e remover item quando vende** (produto, carro, serviço).
- Página de cada item com infos + botão de falar no WhatsApp.
- Endereço e dados de contato. Design único por cliente, nunca clonar de outro. Segue o padrão de design definido pelo Matheus.

**2. Tráfego automatizado via MCP** (Alisson)
- Configurar Google Ads via MCP (precisa de BM habilitada). A verba de anúncio é por conta do cliente.
- Dois tipos de criativo: **institucional** (sobre a empresa) e **de produto específico** (performa melhor, priorizar).
- Roteiro de vídeo: vários takes só do produto, sem o cliente falar, a edição incrementa + legenda. Lead cai no WhatsApp.

**3. Carrosséis automatizados** (Produção: Anderson + Luis)
- Template baseado no **design do site** (coerência visual).
- Capa: nome do item + marca + specs principais. Slides seguintes: fotos do item (puxar do site).
- Pegar referência de capa no Instagram atual do cliente.

**4. Google Meu Negócio** (Produção: Anderson + Luis)
- Corrigir/configurar endereço (erro de endereço antigo é o ganho mais rápido).
- Otimizar perfil, fotos (dá pra gerar versão profissional com IA tipo Nano Banana), categorias, horário.

**Papéis:** Victor = comercial (venda + call). Produção (Anderson + Luis) = site + carrosséis + Google Meu Negócio, via MazyOS. Alisson = tráfego (MCP) + Head de Ops (dono do pipeline). Matheus = dono: estratégia, conteúdo/YouTube, cliente-chave e padrão de qualidade. Matheus NÃO entra na operação do dia a dia.

## Fase 5 — Entrega e handoff

- Mostrar tudo pro cliente. Ensinar a usar o site (adicionar/remover item).
- Registrar o que foi entregue no contexto do cliente.
- Site publicado: incluir o link. Se for caso de YouTube/voucher, separar os steaks de bastidor.

## Regras

- Design único por cliente, sempre. Nunca clonar estrutura/estética de outro.
- Tom de voz e copy seguem o nicho do cliente (extraído da call), não o da Criativvo.
- Sem travessão na copy entregue.
- Não prometer resultado de tráfego em número fechado. Falar em estrutura e estimativa.
