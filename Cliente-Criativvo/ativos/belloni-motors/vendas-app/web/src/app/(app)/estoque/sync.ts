'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { runShopifySync } from '@/lib/shopify';

export async function syncShopifyAction() {
  await requireAdmin(); // só admin dispara manualmente
  const result = await runShopifySync();
  if (result.ok) {
    revalidatePath('/estoque');
    revalidatePath('/dashboard');
  }
  return result;
}
