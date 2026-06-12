import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { FinanceirasView, type Bank } from './view';

export const dynamic = 'force-dynamic';

export default async function FinanceirasPage() {
  const profile = await requireProfile();
  await blockTraffic(profile); // tráfego (Alisson) não vê os acessos dos bancos

  const supabase = await createClient();
  const { data } = await supabase
    .from('bank_credentials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true });

  return <FinanceirasView rows={(data as Bank[]) ?? []} role={profile.role} />;
}
