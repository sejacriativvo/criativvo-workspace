// Cria o login do Alisson (papel "traffic") usando a service_role.
// Rode SÓ depois da migration-11 (que libera o papel 'traffic' no banco).
// Uso: node scripts/create-alisson.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const EMAIL = 'allison07rodrigues@gmail.com';
const PASS = 'allison123';
const NAME = 'Alisson';
const INITIALS = 'AL';

// Lê .env.local sem dependências extras.
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let userId;
const { data: created, error } = await supa.auth.admin.createUser({
  email: EMAIL,
  password: PASS,
  email_confirm: true,
  user_metadata: { name: NAME },
});

if (error) {
  console.log('createUser:', error.message, '— tentando localizar usuário existente...');
  const { data: list } = await supa.auth.admin.listUsers({ perPage: 1000 });
  userId = list?.users?.find((u) => u.email === EMAIL)?.id;
} else {
  userId = created.user.id;
}

if (!userId) {
  console.error('Não consegui obter o userId do Alisson.');
  process.exit(1);
}

// Garante a senha (caso o usuário já existisse com outra).
await supa.auth.admin.updateUserById(userId, { password: PASS, email_confirm: true });

// Define o papel de tráfego no profile (o trigger cria como 'vendor').
const { error: pe } = await supa
  .from('profiles')
  .upsert({ id: userId, role: 'traffic', name: NAME, initials: INITIALS, active: true });

if (pe) {
  console.error('Erro ao definir profile:', pe.message);
  process.exit(1);
}

console.log('✅ Alisson pronto (traffic):', EMAIL, '/', userId);
