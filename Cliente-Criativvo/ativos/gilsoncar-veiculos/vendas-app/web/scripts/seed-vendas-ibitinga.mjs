// Registra 4 vendas na 1ª semana de Junho/2026 em Ibitinga (lançamento inicial).
// O relatório conta automático (vendidos). Lead/investimento ficam pro Alisson;
// valor/carro o time completa depois. Uso: node scripts/seed-vendas-ibitinga.mjs
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

const CLOSED = '2026-06-03T15:00:00.000Z'; // 1ª semana de junho (01-08)

// Evita duplicar se rodar de novo.
const { count } = await supa
  .from('clients')
  .select('id', { count: 'exact', head: true })
  .eq('store', 'ibitinga')
  .eq('status', 'sold')
  .gte('closed_at', '2026-06-01')
  .lte('closed_at', '2026-06-08T23:59:59');

if ((count ?? 0) >= 4) {
  console.log('Já existem', count, 'vendas em Ibitinga na 1ª semana de junho. Nada a fazer.');
  process.exit(0);
}

const rows = Array.from({ length: 4 }, (_, i) => ({
  name: `Venda Ibitinga ${i + 1}`,
  status: 'sold',
  store: 'ibitinga',
  closed_at: CLOSED,
  notes: 'Lançamento inicial — completar cliente/carro/valor.',
}));

const { error } = await supa.from('clients').insert(rows);
if (error) {
  console.error('Erro:', error.message);
  process.exit(1);
}
console.log('✅ 4 vendas registradas em Ibitinga (1ª semana de junho).');
