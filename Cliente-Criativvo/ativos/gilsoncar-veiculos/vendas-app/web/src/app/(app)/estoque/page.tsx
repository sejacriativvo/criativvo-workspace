import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Vehicle, CarRow } from '@/lib/types';
import { EstoqueList } from './list';

export const dynamic = 'force-dynamic';

export default async function EstoquePage() {
  const profile = await requireProfile();
  await blockTraffic(profile);
  const isAdmin = profile.role === 'admin';
  const supabase = await createClient();

  // Todos leem a view segura (sem custo).
  const { data: vehicles } = await supabase
    .from('vehicles_public')
    .select('*')
    .eq('status', 'available')
    .order('days_in_stock', { ascending: true });

  // Só admin: puxa custo da tabela crua (RLS bloqueia vendedor).
  let costMap: Record<string, number | null> = {};
  if (isAdmin) {
    const { data: cars } = await supabase.from('cars').select('id, cost');
    if (cars) costMap = Object.fromEntries((cars as Pick<CarRow, 'id' | 'cost'>[]).map((c) => [c.id, c.cost]));
  }

  return (
    <EstoqueList
      vehicles={(vehicles as Vehicle[]) ?? []}
      isAdmin={isAdmin}
      costMap={costMap}
    />
  );
}
