'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Salva o custo do carro (o desconto máximo é calculado automaticamente pelo banco).
export async function saveMargin(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') || '');
  if (!id) return { error: 'Carro não identificado.' };

  const num = (k: string) => {
    const v = String(formData.get(k) || '').trim();
    return v === '' ? null : Number(v);
  };

  const cost = num('cost');
  const acquired = String(formData.get('acquired_at') || '').trim() || null;

  if (cost == null) {
    return { error: 'Informe o custo do carro.' };
  }

  const { error } = await supabase
    .from('cars')
    .update({ cost, acquired_at: acquired })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/estoque');
  revalidatePath('/dashboard');
  redirect(`/estoque/${id}?ok=margin`);
}
