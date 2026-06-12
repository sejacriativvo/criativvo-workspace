// Investigação read-only: o "Celta Spirit" está no banco? Está na Shopify?
import { readFileSync } from 'node:fs';

const env = {};
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}

const SUPA = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DOMAIN = env.SHOPIFY_STORE_DOMAIN;

// 1) Banco: carros com "celta" no nome
const cols = 'id,name,source,status,shopify_product_id,img,price,created_at,synced_at,sold_at,acquired_at';
const dbRes = await fetch(`${SUPA}/rest/v1/cars?select=${cols}&name=ilike.*celta*`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});
const dbCars = await dbRes.json();
console.log('=== BANCO (cars com "celta") ===');
console.log(JSON.stringify(dbCars, null, 2));

// 2) Shopify: o catálogo público tem algum "celta"?
console.log('\n=== SHOPIFY (catálogo público) ===');
try {
  let total = 0;
  const celtas = [];
  for (let page = 1; page <= 20; page++) {
    const r = await fetch(`https://${DOMAIN}/products.json?limit=250&page=${page}`, {
      headers: { 'User-Agent': 'GilsonCarVendas/1.0' },
    });
    if (!r.ok) { console.log(`  catálogo respondeu ${r.status}`); break; }
    const { products = [] } = await r.json();
    total += products.length;
    for (const p of products) {
      if (/celta/i.test(p.title)) celtas.push({ id: p.id, title: p.title, available: p.variants?.[0]?.available });
    }
    if (products.length < 250) break;
  }
  console.log(`  total de produtos publicados na loja: ${total}`);
  console.log(`  produtos com "celta": ${celtas.length}`);
  console.log(JSON.stringify(celtas, null, 2));
} catch (e) {
  console.log('  erro ao ler Shopify:', e.message);
}
