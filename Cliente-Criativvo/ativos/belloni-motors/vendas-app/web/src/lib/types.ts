export type Role = 'admin' | 'vendor' | 'traffic';

export type Store = string; // loja única ('belloni') — mantido para compatibilidade com ad_reports

// Linha do relatório de tráfego (uma por semana em 2026; mensal no histórico).
// Azul (Alisson): investimento, conversas. Verde (Italo): vendidos, lucro.
export type AdReport = {
  id: string;
  store: Store;
  year: number;
  month: number;
  granularity: 'week' | 'month';
  period_index: number;
  period_label: string | null;
  investimento: number | null;
  conversas: number | null;
  vendidos: number | null;
  lucro: number | null;
  updated_at: string;
  updated_by: string | null;
};

export type Profile = {
  id: string;
  role: Role;
  name: string | null;
  initials: string | null;
  active: boolean;
};

export type ClientStatus =
  | 'lead'
  | 'visit'
  | 'negotiating'
  | 'followup'
  | 'sold'
  | 'lost';

export type Level = 'green' | 'yellow' | 'red' | 'pending';

// Linha da VIEW segura — é o que vendedor E admin usam pra listar.
// Repare: NÃO existe "cost" nem "margin" aqui. Por design.
// Carro sem custo cadastrado vem com level 'pending' e max_discount null.
export type Vehicle = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  doors: string | null;
  premium: boolean;
  year: string | null;
  km: string | null;
  cor: string | null;
  cambio: string | null;
  combustivel: string | null;
  price: number;
  opcionais: string[];
  img: string | null;
  photos: string[];
  in_prep: boolean;
  status: 'available' | 'sold';
  source: 'manual' | 'shopify';
  shopify_product_id: string | null;
  created_at: string;
  days_in_stock: number;
  max_discount: number | null;
  level: Level;
};

// Linha da tabela crua — SÓ admin consegue ler (RLS). Inclui custo.
export type CarRow = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  doors: string | null;
  premium: boolean;
  year: string | null;
  km: string | null;
  cor: string | null;
  cambio: string | null;
  combustivel: string | null;
  price: number;
  cost: number | null;
  opcionais: string[];
  img: string | null;
  photos: string[];
  in_prep: boolean;
  status: 'available' | 'sold';
  source: 'manual' | 'shopify';
  shopify_product_id: string | null;
  created_at: string;
  acquired_at: string | null;          // quando a Belloni Motors comprou (base do giro)
  synced_at: string | null;
  sold_at: string | null;
};

export type Client = {
  id: string;
  name: string;
  phone: string | null;
  status: ClientStatus;
  car_id: string | null;
  seller_id: string | null;
  notes: string | null;
  sold_value: number | null;
  discount: number | null;
  payment: string | null;
  store: string | null;          // loja da venda — mantido para compatibilidade
  visit_date: string | null;     // visita agendada para
  visit_time: string | null;
  visited_at: string | null;     // veio à loja em
  contacted_at: string | null;   // conversamos em
  followup_date: string | null;  // retornar em
  lost_reason: string | null;
  closed_at: string | null;      // quando virou vendeu/não comprou
  created_at: string;
};

export type Settings = {
  discount_pct: number;
  green_threshold: number;
  yellow_threshold: number;
  dealership_name: string;
  store_domain: string | null;
  monthly_goal: number;        // meta de vendas mensal
  monthly_sales: number;       // contador de vendas do mês (+/- nas Metas)
  sales_month: string | null;  // 'YYYY-MM' a que a contagem se refere
  manual_sales: number;        // vendas lançadas à mão (antes do CRM)
  manual_revenue: number;
  manual_profit: number;       // lucro dessas vendas (só admin vê)
  manual_month: string | null; // 'YYYY-MM' a que o ajuste se refere
};
