'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function addCar(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const str = (k: string) => String(formData.get(k) || '').trim() || null;
  const num = (k: string) => {
    const v = String(formData.get(k) || '').trim();
    return v === '' ? null : Number(v);
  };

  const name = str('name');
  if (!name) return { error: 'Nome do carro obrigatório.' };

  const price = num('price');
  if (!price) return { error: 'Preço de tabela obrigatório.' };

  const opcionais = String(formData.get('opcionais') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const photos = formData.getAll('photos[]').map(String).filter(Boolean);
  if (photos.length === 0) return { error: 'Adicione pelo menos 1 foto do carro.' };
  const img    = photos[0];

  const { data, error } = await supabase
    .from('cars')
    .insert({
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
      img,
      photos,
      in_prep:      false,
      acquisition_date: str('acquisition_date'),
      opcionais,
      status:       'available',
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/estoque');
  revalidatePath('/dashboard');
  redirect(`/estoque/${data.id}?ok=created`);
}

export async function markSold(carId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from('cars')
    .update({ status: 'sold', sold_at: new Date().toISOString() })
    .eq('id', carId);
  revalidatePath('/estoque');
  redirect('/estoque?ok=sold');
}

export async function deleteCar(carId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from('cars').delete().eq('id', carId);
  revalidatePath('/estoque');
  redirect('/estoque?ok=deleted');
}
