import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Client, Vehicle } from '@/lib/types';
import { ClientesView } from './view';

export const dynamic = 'force-dynamic';

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ carId?: string; new?: string }>;
}) {
  await blockTraffic(await requireProfile());
  const { carId, new: isNew } = await searchParams;
  const supabase = await createClient();

  const [{ data: clients }, { data: vehicles }] = await Promise.all([
    supabase.from('clients').select('*').order('created_at', { ascending: false }),
    supabase.from('vehicles_public').select('id, name, price').eq('status', 'available').order('name'),
  ]);

  return (
    <ClientesView
      clients={(clients as Client[]) ?? []}
      vehicles={(vehicles as Pick<Vehicle, 'id' | 'name' | 'price'>[]) ?? []}
      preselectCarId={carId ?? null}
      openNew={isNew === '1'}
    />
  );
}
