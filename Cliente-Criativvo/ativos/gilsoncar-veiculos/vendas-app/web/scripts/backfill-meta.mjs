// Backfill histórico da Meta no ad_reports (SÓ campos azuis: investimento + conversas).
// NÃO toca em vendidos/lucro (verdes) — o upsert só envia as colunas azuis.
// - Ibitinga: meses de 2025-01 a 2026-02 (granularidade mensal).
// - Borborema: tapa a semana 25-31/05/2026 que faltava (semanal, preserva lucro/vendidos).
// Março–Maio/2026 semanais (validados) e Junho+ (sync vivo) NÃO são tocados.
// Uso:  META_TOKEN="<token>" node scripts/backfill-meta.mjs --dry   (preview)
//       META_TOKEN="<token>" node scripts/backfill-meta.mjs         (grava)
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TOKEN = process.env.META_TOKEN;
if (!TOKEN) {
  console.error('Faltou META_TOKEN. Rode: META_TOKEN="..." node scripts/backfill-meta.mjs');
  process.exit(1);
}
const DRY = process.argv.includes('--dry');
const API = 'https://graph.facebook.com/v21.0';
const ACC = { ibitinga: '188981184611167', borborema: '1061480447038301' };

function convFrom(actions) {
  let c = 0;
  for (const a of actions || []) {
    if (a.action_type === 'onsite_conversion.messaging_conversation_started_7d') c += Number(a.value) || 0;
  }
  return c;
}
async function fetchJson(url) {
  const res = await fetch(url);
  const j = await res.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}
const tr = (since, until) => encodeURIComponent(JSON.stringify({ since, until }));

// ───────── 1) Ibitinga — mensal 2025-01 .. 2026-02 ─────────
const mUrl = `${API}/act_${ACC.ibitinga}/insights?level=account&time_increment=monthly&time_range=${tr('2025-01-01', '2026-02-28')}&fields=spend,actions&limit=60&access_token=${TOKEN}`;
const mJson = await fetchJson(mUrl);
const monthly = mJson.data.map((r) => {
  const [y, m] = r.date_start.split('-').map(Number);
  return {
    store: 'ibitinga',
    year: y,
    month: m,
    granularity: 'month',
    period_index: 0,
    period_label: null,
    investimento: Math.round((Number(r.spend) || 0) * 100) / 100,
    conversas: convFrom(r.actions),
    updated_at: new Date().toISOString(),
  };
});
console.log('=== Ibitinga (mensal) ===');
monthly.forEach((r) => console.log(`  ${r.year}-${String(r.month).padStart(2, '0')}  R$ ${r.investimento.toFixed(2)}  conversas ${r.conversas}`));
if (!DRY && monthly.length) {
  const { error } = await supa.from('ad_reports').upsert(monthly, { onConflict: 'store,year,month,granularity,period_index' });
  if (error) throw error;
  console.log(`  -> ${monthly.length} meses gravados.`);
}

// ───────── 2) Borborema — semana 25-31/05/2026 (preserva verdes) ─────────
const wUrl = `${API}/act_${ACC.borborema}/insights?level=account&time_range=${tr('2026-05-25', '2026-05-31')}&fields=spend,actions&access_token=${TOKEN}`;
const wJson = await fetchJson(wUrl);
const wr = wJson.data?.[0];
console.log('=== Borborema (semana 25-31/05/2026) ===');
if (wr) {
  const row = {
    store: 'borborema',
    year: 2026,
    month: 5,
    granularity: 'week',
    period_index: 3,
    period_label: '25/05 - 31/05',
    investimento: Math.round((Number(wr.spend) || 0) * 100) / 100,
    conversas: convFrom(wr.actions),
    updated_at: new Date().toISOString(),
  };
  console.log(`  R$ ${row.investimento.toFixed(2)}  conversas ${row.conversas}`);
  if (!DRY) {
    const { error } = await supa.from('ad_reports').upsert([row], { onConflict: 'store,year,month,granularity,period_index' });
    if (error) throw error;
    console.log('  -> gravado (vendidos/lucro preservados).');
  }
} else {
  console.log('  (sem dados)');
}

console.log(DRY ? '\nDRY RUN — nada foi gravado.' : '\nBackfill concluído.');
