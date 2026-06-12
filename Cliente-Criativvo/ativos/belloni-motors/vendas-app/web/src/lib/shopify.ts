// Sync com a Shopify pelo CATÁLOGO PÚBLICO (/products.json) — sem token.
// Puxa os carros publicados na loja e grava aqui como "pendentes de custo".
// NUNCA mexe no custo já cadastrado pelo admin (regra na função do banco).
import { createAdminClient } from './supabase/admin';

type ShopifyVariant = { price: string; available?: boolean };
type ShopifyImage = { src: string };
type ShopifyProduct = {
  id: number;
  title: string;
  body_html: string;
  tags: string[] | string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
};

export type SyncResult = { ok: boolean; synced?: number; removed?: number; error?: string };

export function shopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN);
}

function stripHtml(h: string): string {
  return (h || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SPEC_LABELS = ['Ano', 'Combustível', 'Km', 'Cor', 'Direção', 'Câmbio', 'Portas', 'Final de placa'];

function pickSpec(body: string, label: string): string | null {
  const re = new RegExp(`${label}:\\s*(.*?)\\s*(?:${SPEC_LABELS.join(':|')}:|$)`, 'i');
  const m = body.match(re);
  const v = m ? m[1].trim() : '';
  return v || null;
}

function parseSpecs(p: ShopifyProduct) {
  const body = stripHtml(p.body_html);
  const tags = (Array.isArray(p.tags) ? p.tags : String(p.tags || '').split(','))
    .map((t) => t.trim())
    .filter(Boolean);

  const year = pickSpec(body, 'Ano');
  const combustivel = pickSpec(body, 'Combustível');
  const km = pickSpec(body, 'Km');
  let cor = pickSpec(body, 'Cor');
  if (!cor) cor = tags.find((t) => /branc|pret|prat|cinz|vermelh|azul|verde|marrom|dourad|bege|amarel|laranj|vinho/i.test(t)) ?? null;
  const cambio = tags.find((t) => /autom|manual|cvt/i.test(t)) ?? null;
  const imgSrc = p.images?.[0]?.src ?? '';
  const inPrep = tags.some((t) => /prepara/i.test(t)) || /prepara[cç]/i.test(imgSrc);

  return { year, combustivel, km, cor, cambio, inPrep };
}

async function fetchPublicProducts(): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN!; // ex.: bellonimotors.com.br
  const all: ShopifyProduct[] = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://${domain}/products.json?limit=250&page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BelloniMotorsVendas/1.0' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Catálogo respondeu ${res.status}`);
    const json = (await res.json()) as { products: ShopifyProduct[] };
    const batch = json.products ?? [];
    all.push(...batch);
    if (batch.length < 250) break; // última página
  }
  return all;
}

export async function runShopifySync(): Promise<SyncResult> {
  if (!shopifyConfigured()) {
    return { ok: false, error: 'Loja não configurada (defina SHOPIFY_STORE_DOMAIN).' };
  }

  let products: ShopifyProduct[];
  try {
    products = await fetchPublicProducts();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Falha ao ler o catálogo.' };
  }

  const supabase = createAdminClient();
  let synced = 0;

  for (const p of products) {
    const variant = p.variants?.[0];
    const price = variant ? Math.round(parseFloat(variant.price)) : 0;
    const img = p.images?.[0]?.src ?? null;
    const available = variant?.available !== false;
    const specs = parseSpecs(p);

    // Casa pelo ID único da Shopify: nunca duplica e NUNCA mexe em custo/margem já cadastrados.
    const { error } = await supabase.rpc('upsert_shopify_car', {
      p_shopify_id: String(p.id),
      p_name: p.title,
      p_price: price,
      p_img: img,
      p_year: specs.year,
      p_km: specs.km,
      p_cor: specs.cor,
      p_cambio: specs.cambio,
      p_combustivel: specs.combustivel,
      p_status: available ? 'available' : 'sold',
      p_in_prep: specs.inPrep,
    });
    if (!error) synced++;
  }

  // Carros que SUMIRAM do catálogo = venderam -> tira do estoque (marca vendido).
  // Guard: só roda se o catálogo veio com itens (evita zerar tudo se a loja
  // responder vazio por algum problema).
  let removed = 0;
  if (products.length > 0) {
    const currentIds = new Set(products.map((p) => String(p.id)));
    const { data: dbCars } = await supabase
      .from('cars')
      .select('id, shopify_product_id')
      .eq('source', 'shopify')
      .eq('status', 'available');
    const vanished = (dbCars ?? [])
      .filter((c) => c.shopify_product_id && !currentIds.has(c.shopify_product_id as string))
      .map((c) => c.id);
    if (vanished.length > 0) {
      const { error } = await supabase
        .from('cars')
        .update({ status: 'sold', sold_at: new Date().toISOString() })
        .in('id', vanished);
      if (!error) removed = vanished.length;
    }
  }

  return { ok: true, synced, removed };
}
