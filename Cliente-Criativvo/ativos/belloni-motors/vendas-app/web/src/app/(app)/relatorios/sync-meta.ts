'use server';

import { revalidatePath } from 'next/cache';
import { requireReports } from '@/lib/auth';
import { runMetaSync } from '@/lib/meta';

// Disparo manual do sync da Meta (admin ou tráfego). Atualiza investimento e
// conversas do mês na hora, sem esperar o cron diário.
export async function syncMetaAction() {
  await requireReports();
  const result = await runMetaSync();
  if (result.ok) {
    revalidatePath('/relatorios');
    revalidatePath('/dashboard');
  }
  return result;
}
