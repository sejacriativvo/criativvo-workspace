'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function updateCar(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get('id') || '');
  if (!id) return { error: 'ID do carro não encontrado.' };

  const str = (k: string) => String(formData.get(k) || '').trim() || null;
  const num = (k: string) => {
    const v = String(formData.get(k) || '').trim();
    return v === '' ? null : Number(v);
  };

  const name = str('name');
  if (!name) return { error: 'Nome obrigatório.' };

  const price = num('price');
  if (!price) return { error: 'Preço obrigatório.' };

  const opcionais = String(formData.get('opcionais') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from('cars')
    .update({
      name,
      brand:        str('brand'),
      category:     str('category'),
      doors:        str('doors'),
      premium:      formData.get('premium') === 'on',
      year:         str('year'),
      km:           str('km'),
      cor:          str('cor'),
      cambio:       str('cambio'),
      combustivel:  str('combustivel'),
      price,
      cost:         num('cost') ?? 0,
      photos:       formData.getAll('photos[]').map(String).filter(Boolean),
      img:          formData.getAll('photos[]').map(String).filter(Boolean)[0] ?? null,
      acquisition_date: str('acquisition_date'),
      opcionais,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/estoque');
  revalidatePath(`/estoque/${id}`);
  redirect(`/estoque/${id}?ok=updated`);
}
