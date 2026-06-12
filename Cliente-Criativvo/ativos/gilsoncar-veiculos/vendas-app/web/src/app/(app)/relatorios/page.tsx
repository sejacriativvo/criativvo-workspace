import { requireReports } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { AdReport, Store } from '@/lib/types';
import { buildSalesMap } from '@/lib/relatorios';
import { RelatoriosView } from './view';

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  const profile = await requireReports();
  const supabase = await createClient();

  // vendidos vem do log de vendas (o +/- das Metas grava lá, datado).
  // lucro é digitado à mão pelo admin no próprio relatório.
  const [{ data: ad }, { data: sales }] = await Promise.all([
    supabase
      .from('ad_reports')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true })
      .order('period_index', { ascending: true }),
    supabase.from('sales').select('store, sold_on'),
  ]);

  const rows = (ad as AdReport[]) ?? [];
  const crm = buildSalesMap(
    (sales as { store: Store | null; sold_on: string | null }[]) ?? [],
  );

  return <RelatoriosView rows={rows} crm={crm} role={profile.role} />;
}
