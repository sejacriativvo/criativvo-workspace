'use server';

import { revalidatePath } from 'next/cache';
import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

// Acesso às financeiras: admin ou vendedor. Tráfego (Alisson) é barrado.
async function ensureFinance() {
  const profile = await requireProfile();
  await blockTraffic(profile);
  return profile;
}

// Edita login/senha (e opcionalmente o nome) de um banco.
export async function saveBankCred(payload: {
  id: string;
  login: string | null;
  password: string | null;
  label?: string;
  note?: string | null;
}) {
  const profile = await ensureFinance();
  const supabase = await createClient();
  const patch: Record<string, unknown> = {
    login: payload.login,
    password: payload.password,
    updated_at: new Date().toISOString(),
    updated_by: profile.id,
  };
  if (payload.label != null) patch.label = payload.label.trim();
  if (payload.note !== undefined) patch.note = payload.note;

  const { error } = await supabase.from('bank_credentials').update(patch).eq('id', payload.id);
  if (error) return { error: error.message };
  revalidatePath('/financeiras');
  return { ok: true };
}

// Adiciona um banco novo.
export async function addBank(payload: { label: string }) {
  await ensureFinance();
  const supabase = await createClient();
  const label = payload.label.trim();
  if (!label) return { error: 'Dê um nome ao banco.' };
  const slug =
    label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // tira acento
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `banco-${Date.now()}`;

  const { error } = await supabase.from('bank_credentials').insert({ bank: slug, label, sort_order: 999 });
  if (error) return { error: error.message };
  revalidatePath('/financeiras');
  return { ok: true };
}

// Remove um banco (só admin).
export async function deleteBank(id: string) {
  const profile = await ensureFinance();
  if (profile.role !== 'admin') return { error: 'Só o admin remove um banco.' };
  const supabase = await createClient();
  const { error } = await supabase.from('bank_credentials').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/financeiras');
  return { ok: true };
}
