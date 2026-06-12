// Cliente Supabase com a chave service_role — IGNORA RLS.
// Use SÓ no servidor (rotas/cron/sync). Nunca no front.
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
