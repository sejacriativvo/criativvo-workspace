# GilsonCar Vendas — App interno

PWA mobile-first para vendedores consultarem estoque e **faixa de desconto permitida por carro**, sem ver o lucro real. Admin (donos) gerenciam custos e margens.

## Status atual

- ✅ **Protótipo navegável** em [prototipo/index.html](prototipo/index.html) (HTML puro, sem build)
- ⏳ Backend Next.js + Supabase + Shopify API → próxima fase

## Como abrir o protótipo

### No computador
```
open prototipo/index.html
```

### No celular (pra mostrar pro Gilson)
1. Levante um servidor simples na pasta:
   ```
   cd "Cliente-Criativvo/ativos/gilsoncar-veiculos/vendas-app/prototipo"
   python3 -m http.server 8080
   ```
2. Descubra o IP local do seu Mac:
   ```
   ipconfig getifaddr en0
   ```
3. No celular (mesma rede Wi-Fi), abra: `http://SEU_IP:8080`
4. No iPhone: Safari → Compartilhar → "Adicionar à Tela de Início" (vira ícone como app)

## Telas implementadas no protótipo

1. **Login** — escolhe perfil (Vendedor ou Admin) para navegar a demo
2. **Vendedor / Estoque** — lista de 14 carros mockados com badge colorido de margem + valor máximo de desconto, busca e filtros
3. **Vendedor / Detalhe** — card grande de margem com cor (verde/amarelo/vermelho), specs, opcionais, CTAs "Pedir +" e "Fechar venda"
4. **Admin / Dashboard** — KPIs (estoque, margem total), lista de carros com custo, lucro real e limite do vendedor

## Decisões arquiteturais

- **Sync estoque**: Shopify Admin API automática
- **Custo/margem**: dono cadastra manual no painel admin
- **Plataforma**: PWA (instalável, sem app store)
- **Hospedagem**: Vercel (front) + Supabase (banco/auth)
- **Custo recorrente**: R$ 0/mês no início

## Matriz de acesso

| Informação | Admin | Vendedor |
|---|:---:|:---:|
| Preço de venda, fotos, ano | ✅ | ✅ |
| Preço de custo, margem em R$, % lucro | ✅ | ❌ |
| Faixa de desconto (cor) e valor máx. em R$ | ✅ | ✅ |
| Tempo no estoque | ✅ | ✅ |
| Cadastrar carro, definir custo/desconto | ✅ | ❌ |
| Criar/remover vendedores | ✅ | ❌ |

## Lógica do indicador de margem

```
margem_pct = (preço_venda - custo) / preço_venda
desconto_máximo_vendedor = 40% da margem (arredondado p/ centena)

🟢 Verde   → margem ≥ 13%   → "Pode negociar à vontade"
🟡 Amarelo → margem 7%-13%  → "Com cuidado, peça aprovação acima do limite"
🔴 Vermelho → margem < 7%   → "Margem apertada, foque no carro como diferencial"
```

Esses valores são **provisórios para o protótipo**, vão ser configuráveis pelo admin na versão final.

## Credenciais que o Gilson precisa providenciar

Mensagem pronta pra mandar no WhatsApp:

> Gilson, pra integrar o sistema novo com o estoque da Shopify, preciso de 3 coisas:
> 1. URL da loja (algo como `gilsoncar.myshopify.com`)
> 2. Admin API access token (gera em: Apps → Develop apps → Create an app → Configure Admin API scopes [marca `read_products`, `read_inventory`] → Install app → copia o token)
> 3. Quantos vendedores vão usar o sistema

## Próximos passos (pós-validação do protótipo)

| Dia | Entrega |
|---|---|
| 1 | Setup Next.js + Supabase + Vercel + schema do banco |
| 2 | Sync com Shopify Admin API |
| 3 | Painel admin: login + cadastro de custo + faixa de desconto |
| 4 | Painel vendedor: lista + detalhes + indicador colorido |
| 5 | PWA (manifest, ícones, service worker) + ajustes mobile |
| 6 | Testes + deploy em produção |
| 7 | Apresentação pro Gilson |
