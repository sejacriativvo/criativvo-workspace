// Cliente Supabase para o SERVIDOR (Server Components, Server Actions, Route Handlers).
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // Blindagem: o cookie de sessão NUNCA é lido por JS (HttpOnly), só
            // viaja em HTTPS (Secure em produção) e não vaza cross-site (SameSite).
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              }),
            );
          } catch {
            // Chamado de um Server Component — ignorar; o proxy renova a sessão.
          }
        },
      },
    },
  );
}
