// Helpers de sessão/perfil usados pelas telas (Server Components).
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import type { Profile } from './types';

// cache() = memoiza por request: layout + página + componentes reusam UMA
// busca de usuário/perfil em vez de bater no banco várias vezes (mais rápido).
const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();

  // Pega o ID do usuário pelo token LOCAL (rápido); cai pro getUser (rede) só se precisar.
  let userId: string | undefined;
  try {
    const { data } = await supabase.auth.getClaims();
    userId = data?.claims?.sub;
  } catch {
    userId = undefined;
  }
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  }
  if (!userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, name, initials, active')
    .eq('id', userId)
    .single();

  if (!profile || !profile.active) return null;
  return profile as Profile;
});

export async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect('/login');
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== 'admin') redirect('/estoque');
  return profile;
}

// Relatórios: admin (Italo) e tráfego (Alisson). Vendedor é barrado.
export async function requireReports(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== 'admin' && profile.role !== 'traffic') redirect('/estoque');
  return profile;
}

// Telas de venda/estoque/CRM: barra o tráfego (Alisson só vê Relatórios).
export async function blockTraffic(profile: Profile) {
  if (profile.role === 'traffic') redirect('/relatorios');
}
