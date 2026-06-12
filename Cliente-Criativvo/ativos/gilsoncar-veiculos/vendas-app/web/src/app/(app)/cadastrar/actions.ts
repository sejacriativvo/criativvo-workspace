'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Salva a margem de negociação (desconto R$) e, opcionalmente, o custo.
// Carros vêm da Shopify — aqui o admin só define esses dois valores.
export async function saveMargin(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') || '');
  if (!id) return { error: 'Carro não identificado.' };

  const num = (k: string) => {
    const v = String(formData.get(k) || '').trim();
    return v === '' ? null : Number(v);
  };

  const discount = num('negotiation_discount');
  const cost = num('cost');
  const acquired = String(formData.get('acquired_at') || '').trim() || null;

  if (discount == null) {
    return { error: 'Defina a margem de negociação (desconto máximo em R$).' };
  }

  // RLS garante: só admin edita.
  const { error } = await supabase
    .from('cars')
    .update({ negotiation_discount: discount, cost, acquired_at: acquired })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/estoque');
  revalidatePath('/dashboard');
  redirect(`/estoque/${id}`);
}
