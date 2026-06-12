# Cliente-Criativvo/ — convenção de organização

Cada subpasta de cliente fica dentro de uma das 3 pastas de status. O modelo de referência é `_modelo-cliente/` na raiz, sempre que um cliente novo entrar, copia a pasta e renomeia.

## Status do cliente (qual subpasta usar)

- `ativos/` — clientes fechados e em operação com a Criativvo
- `propostas-enviadas/` — proposta ou contrato enviado, ainda não fechou
- `inativos/` — saíram da base (encerrou contrato, deixou de pagar, parou de responder)

Quando o status mudar, mover a pasta inteira pra outra subpasta. Não duplicar.

## Regra 1 — Nome de pasta em kebab-case

Sem espaços, sem acentos, sem maiúsculas. Tudo em letra minúscula com `-` no lugar de espaço.

- `movisol` ✅
- `gilsoncar-veiculos` ✅
- `maccari-store` ✅
- `feffo-cortinas` ✅
- `vr-studio` ✅
- `reinaldo-meirelles` ✅
- ~~`Movisol`~~ ❌ (caps)
- ~~`VR STUDIO`~~ ❌ (espaço + caps)
- ~~`Fêffo Cortinas`~~ ❌ (acento + espaço)

**Por quê:** espaços travam shell/scripts (`cd Fêffo\ Cortinas` é horrível). Acentos e maiúsculas dão divergência entre macOS (case-insensitive) e GitHub Pages/Linux (case-sensitive), relatórios publicados quebram.

> Migração concluída em 2026-05-28: todos os clientes legados (GilsonCar Veículos, Maccari Store, Movisol, VR STUDIO, Fêffo Cortinas, PD Motors, Carvalho Costa Adv, Reinaldo Meirelles) foram renomeados pra kebab-case. Os HTMLs publicados em `docs/` não foram afetados (já usavam slug próprio) e os caminhos internos de cada cliente são relativos. Daqui pra frente, todo cliente novo já entra em kebab-case.

## Regra 2 — Estrutura mínima por cliente

```
<cliente>/
├── CLAUDE.md                  ← contexto da conta (briefing executivo)
├── briefing.md                ← briefing detalhado de onboarding
├── assets/
│   ├── logo/                  ← TODA logo entra aqui, nunca solta no root
│   └── fotos-posts/           ← fotos reais (prova social, bastidor, equipe)
├── redes-sociais/
│   ├── posts/
│   │   └── DD-MM-AAAA/        ← uma pasta por data, com slide-XX.jpg + legenda.txt
│   ├── estrategia-conteudo.md
│   ├── historico-posts.md
│   ├── historico-imagens.md
│   └── templates-posts-<cliente>.html
└── relatorio/
    └── relatorio-<mes>-<ano>.html
```

Pastas opcionais (criar só quando aplicável):
- `site/` — quando a Criativvo mantém o site do cliente
- `deploy/` — build estático que sobe pro GitHub Pages ou Vercel
- `acessos.md` — credenciais / logins / pixels / contas Ads
- `propostas/` — propostas comerciais HTML, se relevante

## Regra 3 — Logo SEMPRE em `assets/logo/`

Nunca deixar logo solta no root do cliente. Path relativo de qualquer HTML em `redes-sociais/posts/DD-MM-AAAA/` para a logo:

```
../../../assets/logo/<nome-do-arquivo>.png
```

## Regra 4 — Cliente multi-unidade

Quando o cliente tem mais de uma unidade/loja com gestão separada (ex: GilsonCar Borborema + Ibitinga):

```
<cliente>/
├── CLAUDE.md                  ← contexto da marca-mãe
├── assets/                    ← logo e fotos compartilhadas entre as unidades
├── relatorio/                 ← relatório unificado quando faz sentido
├── <cliente>-<unidade-1>/
│   ├── CLAUDE.md              ← gestor local, particularidades da unidade
│   ├── briefing.md
│   ├── relatorio/
│   └── redes-sociais/
└── <cliente>-<unidade-2>/
    └── (mesma estrutura)
```

## Regra 5 — Clientes que não são de marketing/social

Cliente cujo escopo é só desenvolvimento (app, site sem social, automação), separar em `clientes-dev/` no futuro. Por enquanto eles ficam aqui mesmo mas não precisam respeitar a estrutura completa — basta um `CLAUDE.md` e a pasta do projeto.

## Como criar um cliente novo

```bash
cp -r _modelo-cliente <nome-em-kebab-case>
# Preencher CLAUDE.md e briefing.md
# Colocar logos em assets/logo/
```
