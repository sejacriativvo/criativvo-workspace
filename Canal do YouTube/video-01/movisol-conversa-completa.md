# Como construímos o Instagram da Movisol do zero com IA
### Referência completa para o vídeo do YouTube

---

## Contexto

Nessa conversa eu e o Matheus construímos do zero toda a estrutura de conteúdo, identidade visual e sistema operacional do Instagram da **Movisol** — empresa de energia solar do pai do Matheus em Ibitinga SP — usando Claude Code como assistente de marketing e design.

Duração: uma única conversa longa.
Resultado: pasta organizada, 7 templates de post, estratégia de conteúdo completa, fluxo de entrega automatizado, base de memória para posts futuros.

---

## PARTE 1 — Organização da pasta

### O que o Matheus pediu
> "Queria organizar a pasta Movisol. Ver o que temos, talvez eu queira apagar coisas para começarmos do zero."

### O que foi feito
Listei tudo o que existia na pasta:
- `assets/` com logos e fotos
- `estrategia/` com 5 arquivos .md de estratégia antiga
- `instagram/posts/` com 4 HTMLs de templates antigos
- `instagram/stories/` vazia

### Decisão
Matheus quis manter apenas as fotos e logos, apagar todo o resto.

---

## PARTE 2 — Estrutura errada ⚠️ PONTO IMPORTANTE

### O que o Matheus percebeu
> "Você viu que a pasta Movisol já começa com assets? Quero uma pasta normal igual aos outros clientes."

### Por que isso importa para o vídeo
**Se o Matheus não tivesse falado isso**, a pasta da Movisol teria ficado diferente dos outros clientes — sem `CLAUDE.md`, sem `briefing.md`, sem `redes-sociais/`, sem `relatorio/`. Isso causaria inconsistência na organização da agência e o Claude não teria contexto automático do cliente ao abrir a pasta.

### Lição para o espectador
> Sempre verifique se o resultado ficou no padrão que você quer. O Claude executa o que foi pedido, mas não assume que você quer o mesmo padrão de outros lugares a menos que você diga.

### O que foi feito
Olhei a estrutura dos outros clientes, copiei os arquivos modelo (`CLAUDE.md` e `briefing.md`) e criei as pastas `redes-sociais/` e `relatorio/`.

---

## PARTE 3 — Preenchendo os dados do cliente

### O que o Matheus pediu
> "O que você tem de informação da Movisol?"

Compartilhei o que tinha salvo na memória de conversas anteriores:
- Empresa de energia solar em Ibitinga SP
- Dono: Marcelo (pai do Matheus)
- Instagram: @movisol.se
- Cor: azul #004CF1, logo branca
- Pilares de conteúdo já definidos antes

### O que ainda faltava — Matheus completou:
- Marcelo posta ele mesmo no Instagram
- Exigente com prazo, tom formal e informal
- Apenas posts (sem tráfego pago)
- Acompanha: seguidores, curtidas e engajamento
- Início: hoje (19/05/2026), sem custo (pai do Matheus)
- **Diferencial:** pós-venda excepcional — resolve problemas que não têm nada a ver com a instalação dele
- Poucos concorrentes locais
- Quer 3 posts/semana + notícias avulsas

### Por que importa para o vídeo
**Se o Matheus não tivesse dito que o Marcelo posta ele mesmo**, toda a estrutura de entrega teria sido diferente. O fluxo de Drive, a pasta de posts, o arquivo de legenda formatada — nada disso teria sido criado. O Claude assumiria que Matheus ou um social media da equipe faria a publicação.

> Detalhe operacional muda tudo. "Quem publica?" é uma pergunta que parece simples mas afeta a entrega inteira.

---

## PARTE 4 — Pesquisa de referências e plano de conteúdo

### Referências encontradas
- **@belenergy_** — 141K seg, maior distribuidora do Brasil, referência de tom educativo
- **@energybrasiloficial** — 19K seg, mais próximo do porte da Movisol
- **@mecansolar** — empresa regional pequena, comunicação local com credibilidade

### Plano de conteúdo definido

**Grade semanal:**
- Segunda: Educação / Dúvidas frequentes
- Quarta: Prova social / Pós-venda / Bastidores
- Sexta: Economia / Dados / ROI

**Notícias avulsas:** sempre que surgir algo relevante no setor

**Banco de pautas criado:** dúvidas frequentes, cases de clientes, dados de economia, mitos do solar, quiz, "Número da semana"

**Regra-chave estabelecida:** notícia desvantajosa → sempre com ângulo positivo e solução. Afirmação positiva → sempre com dados reais.

---

## PARTE 5 — Criação dos templates visuais

### Decisões de estilo
**Pergunta:** qual estilo visual e como usar fotos?

**Resposta do Matheus:** azul sólido + moderno, mas com variação — foto em destaque na capa, foto pequena variando posição, às vezes só arte. Feed variado e diferenciado, não todo post igual.

### Templates criados (7 no total)

| Template | Fundo | Uso |
|---|---|---|
| A | Foto + gradiente preto | Capa de carrossel, prova social |
| B | Azul sólido + grade | Dica, educação, CTA forte |
| C | Branco + grade azul | Dúvida, lista, informativo |
| D | Foto topo + preto embaixo | Bastidores, pós-venda, equipe |
| E | Branco + grade + número grande | Dado/estatística |
| F | Azul + grade + número grande | Dado com mais impacto |
| G | Foto + gradiente + número grande | Dado com foto de fundo |

---

## PARTE 6 — Ajustes dos templates ⚠️ PONTOS IMPORTANTES

### 6.1 Logo desproporcional

**Problema identificado pelo Matheus:**
> "A logo está enorme e desproporcional."

**Por que aconteceu:** o arquivo PNG da logo branca tem espaço transparente ao redor. Sem `max-width`, ela esticava horizontalmente.

**Padrão identificado pelo Matheus:**
> "A logo branca está se estendendo muito. A azul está ficando mais legal."

**Por que isso importa para o vídeo:**
O Matheus não só apontou o problema — ele identificou o padrão. Isso acelerou muito a correção. Se tivesse dito apenas "a logo está errada", eu teria corrigido uma por vez sem entender a causa raiz.

> Quando algo está errado em vários lugares, tente identificar o padrão. Diga "percebi que sempre que X acontece, Y fica errado." Isso economiza voltas.

**Solução:** classes separadas `.logo-branca` e `.logo-azul` com `max-width` controlado.

---

### 6.2 Barras decorativas que não funcionam no feed

**Problema:**
- Template C tinha barra azul na lateral esquerda
- Template E tinha linha azul no topo

**Decisão do Matheus:**
> "Quando a gente publicar no feed não vai ficar legal. Tem que ser inteiro branco, inteiro preto ou inteiro de imagem."

**Por que importa para o vídeo:**
Pensamento de longo prazo aplicado ao design. Uma barra decorativa parece legal isolada, mas no feed do Instagram em sequência de posts fica estranha visualmente.

> Sempre pense: "Como isso vai ficar depois de 30 posts?" Não só "Como isso fica agora?"

---

### 6.3 Foto lateral → foto no topo

**Template D tinha:** foto pequena na lateral direita com texto ao lado.

**Matheus pediu:** repensar o posicionamento da foto.

**Resultado:** foto ocupa o topo inteiro do post (50% da altura), texto e CTA ficam na metade inferior com fundo escuro.

---

### 6.4 Efeito de sol → grade quadriculada ⚠️ DECISÃO ESTRATÉGICA

**Situação:** Template B tinha raios de sol saindo de um ponto + círculo no canto superior direito.

**Matheus perguntou:**
> "Esse efeito eu acho que ficou legal, porém a gente tem que pensar a longo prazo. Imagina esse efeito repetidamente várias vezes — acredito que não vai ficar tão legal."

**Por que isso importa para o vídeo:**
Esta foi uma das decisões mais estratégicas da conversa. Um efeito visual bonito em um post isolado pode se tornar cansativo e "marca" o template de um jeito que limita a vida útil do design.

> Antes de aprovar qualquer elemento visual, pergunte: "Se eu ver isso toda semana por 6 meses, ainda vai parecer fresco?" Se a resposta for não, troque por algo mais neutro e versátil.

**Substituição:** grade quadriculada sutil — mesma lógica do Template C, adaptada para o fundo azul. Funciona indefinidamente.

---

### 6.5 Overlay azul → gradiente preto

**Situação:** Template A (foto de fundo) tinha overlay azul escuro cobrindo a foto + raios de sol.

**Matheus questionou:**
> "Será que fica legal isso a longo prazo? Porque também tem um efeito de sol e não dá pra ver tanto a imagem do fundo."

**Análise feita:**
- Overlay azul deixa todas as fotos com a mesma aparência azulada
- Foto perde impacto — o principal ativo do post some
- O efeito de sol se repete e se torna previsível

**Solução aplicada:** gradiente preto — transparente no topo, quase sólido na base. A foto respira no topo, o texto fica legível embaixo. Cada foto vai parecer diferente.

> Filtros e overlays coloridos uniformizam demais. Para um feed que quer parecer vivo e humano, deixe a foto falar. O gradiente preto resolve o contraste sem destruir a imagem.

---

## PARTE 7 — Regras de conteúdo

### Pergunta de interrogação no headline ⚠️ ERRO CORRIGIDO

**Situação:** Template B tinha o headline "Painel solar funciona em dia nublado." com ponto final.

**Matheus apontou:**
> "No post dois caberia um '?' No final da palavra nublado — isso não precisaria nem estar sendo dito."

**Por que importa para o vídeo:**
Erros básicos de copywriting acontecem. Uma pergunta sem ponto de interrogação perde completamente o efeito retórico que tinha.

> Revise sempre a pontuação dos headlines. Uma pergunta sem '?' não é pergunta — é afirmação.

---

### Fonte sempre obrigatória

**Matheus destacou o rodapé do Template E:**
> "Isso é muito legal e muito importante — sempre que a gente for falar sobre notícias ou alguma informação que você pegar na internet."

**Regra estabelecida:** qualquer dado, estatística, notícia ou regulamentação precisa de citação da fonte no rodapé do post. Ex: `Fonte: ABSOLAR · OPS Energia, maio 2026`

---

### Legenda + hashtags obrigatórios

**Regras definidas:**
- Post único → legenda encorpada com informações importantes + CTA
- Carrossel → legenda curta, introdução ou conclusão + CTA
- Máximo 5 hashtags: sempre #movisol e/ou #ibitinga + trending do nicho pesquisado na data

---

## PARTE 8 — Fluxo operacional completo

### Quem publica
Marcelo — acessa pelo Google Drive.

### Estrutura de entrega de cada post
```
posts/post-01/
  post-01.html  → visual pronto para screenshot/export
  legenda.txt   → legenda formatada + hashtags para copiar
```

Salvo em dois lugares simultaneamente:
- Local: `Cliente-Criativvo/ativos/movisol/redes-sociais/posts/`
- Drive: `Meu Drive/Clientes/Movisol/Posts Movisol/`

### Regra de alteração
Se um post for editado: apagar pasta antiga, recriar com arquivos corrigidos. Nunca manter versões antigas.

---

### Sistema de imagens

**Post de educação/dica/notícia/dado:**
Buscar automaticamente no Pexels ou Unsplash. Relevante ao conteúdo.

**Post de prova social/case/bastidores:**
Matheus sobe foto real na pasta `assets/fotos-posts/` antes da criação.

**Regra anti-repetição:**
Nunca usar a mesma imagem duas vezes. Controle feito pelo arquivo `historico-imagens.md`.
Exceção: citar o mesmo cliente de um post anterior.

---

### Sistema de alternância de templates

Antes de criar cada post, consultar `historico-posts.md` e aplicar:
- Nunca repetir o mesmo template em posts consecutivos
- Nunca 2 fundos escuros seguidos
- Nunca 2 fundos claros seguidos
- Nunca 2 fotos seguidas

---

## Resumo das lições para o espectador

1. **Diga o contexto operacional** — quem vai publicar, como vai publicar, em qual plataforma. Muda tudo.
2. **Pense a longo prazo nos elementos visuais** — um efeito bonito hoje pode ser cansativo em 3 meses.
3. **Identifique padrões, não só sintomas** — "a logo branca estica" é melhor que "a logo está errada".
4. **Verifique o padrão existente** — se você tem outros clientes organizados de um jeito, diga que quer seguir o mesmo padrão.
5. **Pontuação importa** — uma pergunta sem '?' perde o efeito. Revise sempre.
6. **Sempre cite a fonte** — credibilidade é o principal ativo de um post informativo.
7. **Seja específico sobre quem faz o quê** — "quem publica?" parece simples, mas muda a entrega inteira.
8. **Fale tudo que você quer** — o Claude não adivinha. Cada detalhe que você omite é uma decisão que ele vai tomar por você.

---

*Conversa realizada em 18–19/05/2026*
*Conta: @movisol.se | Ibitinga SP*
