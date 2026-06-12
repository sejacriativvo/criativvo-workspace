import Link from 'next/link';
import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Client, Settings, Store } from '@/lib/types';
import { GoalForm } from './goal-form';
import { StoreGoalCard } from './store-goal-card';

export const dynamic = 'force-dynamic';

export default async function MetasPage() {
  const profile = await requireProfile();
  await blockTraffic(profile);
  const isAdmin = profile.role === 'admin';
  const supabase = await createClient();

  const now = new Date();
  // Mês corrente no fuso de SP (bate com o que o log grava na action).
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const [yy, mm] = today.split('-');
  const first = `${yy}-${mm}-01`;
  const lastDay = new Date(Number(yy), Number(mm), 0).getDate();
  const last = `${yy}-${mm}-${String(lastDay).padStart(2, '0')}`;

  const [{ data: s }, { data: cl }, { data: salesRows }] = await Promise.all([
    supabase
      .from('settings')
      .select('goal_ibitinga, goal_borborema')
      .eq('id', 1)
      .single(),
    supabase.from('clients').select('status'),
    supabase.from('sales').select('store').gte('sold_on', first).lte('sold_on', last),
  ]);

  const settings = (s as Settings) ?? null;
  const goalIbi = settings?.goal_ibitinga ?? 0;
  const goalBor = settings?.goal_borborema ?? 0;
  // Vendas do mês = contagem no log (fonte única; o mesmo número do Painel/Relatório).
  const sales = (salesRows as { store: Store }[]) ?? [];
  const vIbi = sales.filter((r) => r.store === 'ibitinga').length;
  const vBor = sales.filter((r) => r.store === 'borborema').length;

  const clients = (cl as Client[]) ?? [];
  const followup = clients.filter((c) => c.status === 'followup').length;
  const negotiating = clients.filter((c) => c.status === 'negotiating').length;

  const mesNome = now.toLocaleDateString('pt-BR', { month: 'long' });

  const cards: { store: Store; vendas: number; goal: number }[] = [
    { store: 'ibitinga', vendas: vIbi, goal: goalIbi },
    { store: 'borborema', vendas: vBor, goal: goalBor },
  ];

  const dicas: string[] = [];
  if (followup > 0) dicas.push(`Ligue de volta pros ${followup} cliente(s) que pediram retorno.`);
  if (negotiating > 0) dicas.push(`Dê um empurrão nos ${negotiating} cliente(s) em negociação (mande WhatsApp).`);
  if (dicas.length === 0) dicas.push('Cadastre novos clientes e agende visitas pra encher o funil.');

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-neutral-900">Metas</h1>
        <span className="text-sm text-neutral-500 capitalize">{mesNome}</span>
      </div>
      <p className="text-sm text-neutral-500 mb-4">
        Registre cada venda no <b>+</b> da loja. Zera sozinho quando vira o mês.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c) => (
          <StoreGoalCard key={c.store} store={c.store} initial={c.vendas} goal={c.goal} isAdmin={isAdmin} />
        ))}
      </div>

      {isAdmin && (
        <div className="mt-3 bg-white rounded-2xl border border-neutral-200 p-4">
          <GoalForm ibitinga={goalIbi} borborema={goalBor} />
        </div>
      )}

      <h2 className="text-sm font-semibold text-neutral-700 mt-6 mb-2">O que fazer agora</h2>
      <div className="space-y-2">
        {dicas.map((d, i) => (
          <Link
            key={i}
            href="/clientes"
            className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-3 hover:bg-neutral-50"
          >
            <span className="h-8 w-8 grid place-items-center rounded-full bg-neutral-100 text-neutral-900 font-bold shrink-0">›</span>
            <span className="text-sm text-neutral-700">{d}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
