'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveClient(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = String(formData.get('id') || '');
  const num = (k: string) => {
    const v = String(formData.get(k) || '').trim();
    return v ? Number(v) : null;
  };
  const str = (k: string) => String(formData.get(k) || '').trim() || null;

  const client = {
    name: String(formData.get('name') || '').trim(),
    phone: str('phone'),
    status: String(formData.get('status') || 'lead'),
    car_id: str('car_id'),
    notes: str('notes'),
    sold_value: num('sold_value'),
    discount: num('discount'),
    payment: str('payment'),
    store: str('store'),
    contacted_at: str('contacted_at'),
    visit_date: str('visit_date'),
    visit_time: str('visit_time'),
    visited_at: str('visited_at'),
    followup_date: str('followup_date'),
    lost_reason: str('lost_reason'),
    seller_id: user?.id ?? null,
    closed_at: null as string | null,
  };

  if (!client.name) return { error: 'Nome do cliente é obrigatório.' };

  // Data de fechamento: define ao virar vendeu/não comprou; preserva a original em edições.
  const terminal = client.status === 'sold' || client.status === 'lost';
  if (terminal) {
    if (id) {
      const { data: existing } = await supabase.from('clients').select('closed_at').eq('id', id).single();
      client.closed_at = existing?.closed_at ?? new Date().toISOString();
    } else {
      client.closed_at = new Date().toISOString();
    }
  }

  const { error } = id
    ? await supabase.from('clients').update(client).eq('id', id)
    : await supabase.from('clients').insert(client);

  if (error) return { error: error.message };

  // Venda fechada num carro -> tira o carro do estoque disponível.
  if (client.status === 'sold' && client.car_id) {
    await supabase.rpc('mark_car_sold', { p_car_id: client.car_id });
    revalidatePath('/estoque');
    revalidatePath('/dashboard');
  }
  // Venda conta no relatório (vendidos automático por loja).
  if (client.status === 'sold') revalidatePath('/relatorios');

  revalidatePath('/clientes');
  return { ok: true };
}

// Move rápido no quadro (Trello). Só muda o status. Venda passa pelo formulário.
export async function moveClient(id: string, status: string) {
  const supabase = await createClient();
  const terminal = status === 'sold' || status === 'lost';
  const { error } = await supabase
    .from('clients')
    .update({ status, closed_at: terminal ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/clientes');
  return { ok: true };
}

export async function deleteClient(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') || '');
  if (id) await supabase.from('clients').delete().eq('id', id);
  revalidatePath('/clientes');
}
