// Gera supabase/seed.sql a partir dos arrays do protótipo (cars + clients).
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync(new URL('./prototipo/index.html', import.meta.url), 'utf8');
const lines = html.split('\n');

// Extrai o texto entre marcadores de linha (1-based) e avalia o array literal.
function grab(startMarker, endLine) {
  const startIdx = lines.findIndex((l) => l.trim().startsWith(startMarker));
  const slice = lines.slice(startIdx, endLine).join('\n');
  const arrText = slice.slice(slice.indexOf('['), slice.lastIndexOf(']') + 1);
  // eslint-disable-next-line no-eval
  return eval('(' + arrText + ')');
}

const cars = grab('const cars =', 1188);
const clients = grab('let clients =', 1202);

const IMG_BASE = 'https://gilsoncarveiculos.com.br/cdn/shop/files/';
const IMG_PREP =
  'https://gilsoncarveiculos.com.br/cdn/shop/files/veiculoempreparacao_b76415da-f21a-4b30-ad6a-15d055ec419f.jpg';

const q = (v) =>
  v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) =>
  `array[${(a || []).map((x) => q(x)).join(',')}]::text[]`;

// Mapa id-do-protótipo -> uuid determinístico, pra ligar clients.car_id.
const carUuid = (id) =>
  `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`;

let out = `-- =====================================================================
-- SEED de exemplo (estoque + clientes do protótipo) — para testar o app.
-- Rode DEPOIS de schema.sql. Apaga e recria os dados de exemplo.
-- Em produção real, troque pelo cadastro manual / sync da Shopify.
-- =====================================================================
delete from public.clients;
delete from public.cars;

-- ---------- CARROS ----------
insert into public.cars (id,name,year,km,cor,cambio,combustivel,price,cost,opcionais,img,in_prep,created_at) values\n`;

const now = 'now()';
const carRows = cars.map((c) => {
  const inPrep = !c.img || c.inPrep ? true : false;
  const img = inPrep ? IMG_PREP : IMG_BASE + c.img;
  // created_at recua "days" dias pra simular tempo no estoque
  const created = `${now} - interval '${c.days || 0} days'`;
  return `('${carUuid(c.id)}',${q(c.name)},${q(c.year)},${q(c.km)},${q(c.cor)},${q(c.cambio)},${q(c.combustivel)},${c.price},${c.cost},${arr(c.opcionais)},${q(img)},${inPrep},${created})`;
});
out += carRows.join(',\n') + ';\n\n';

// ---------- CLIENTES ----------
out += `-- ---------- CLIENTES (CRM) ----------
insert into public.clients (name,phone,status,car_id,notes,sold_value,discount,payment,visit_date,visit_time,followup_date,lost_reason) values\n`;
const clientRows = clients.map((cl) => {
  const carRef = cl.carId ? `'${carUuid(cl.carId)}'` : 'null';
  return `(${q(cl.name)},${q(cl.phone)},${q(cl.status)},${carRef},${q(cl.notes)},${cl.soldValue ?? 'null'},${cl.discount ?? 'null'},${q(cl.payment)},${q(cl.visitDate)},${q(cl.visitTime)},${q(cl.followupDate)},${q(cl.lostReason)})`;
});
out += clientRows.join(',\n') + ';\n';

writeFileSync(new URL('./web/supabase/seed.sql', import.meta.url), out);
console.log(`OK: ${cars.length} carros, ${clients.length} clientes -> web/supabase/seed.sql`);
