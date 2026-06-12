import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/auth/actions';
import { MacOsDock } from '@/components/ui/mac-os-dock';
import { TopNav } from './top-nav';
import { AdminReminder } from './admin-reminder';
import { PrivacyToggle } from './privacy-toggle';
import { Avatar } from '@/components/ui/avatar';
import { avatarFor } from '@/lib/avatars';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const isAdmin = profile.role === 'admin';

  // Contadores do que falta preencher (alertas/lembrete do admin).
  let pendingCount = 0; // carros sem margem
  let semCusto = 0; // carros sem custo (afeta lucro do relatório)
  let vendasSemLoja = 0; // vendas sem loja (não entram no relatório)
  if (isAdmin) {
    const supabase = await createClient();
    const [{ count: pc }, { count: sc }, { count: vsl }] = await Promise.all([
      supabase.from('vehicles_public').select('id', { count: 'exact', head: true }).eq('level', 'pending'),
      supabase
        .from('cars')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'available')
        .or('cost.is.null,cost.eq.0'),
      supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'sold')
        .is('store', null),
    ]);
    pendingCount = pc ?? 0;
    semCusto = sc ?? 0;
    vendasSemLoja = vsl ?? 0;
  }

  const roleLabel = isAdmin ? 'Administrador' : profile.role === 'traffic' ? 'Tráfego' : 'Vendedor';
  const avatarUrl = avatarFor(profile.id);

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Navegação desktop: barra flutuante no topo */}
      <TopNav
        role={profile.role}
        pendingCount={pendingCount}
        name={profile.name ?? ''}
        initials={profile.initials ?? ''}
        roleLabel={roleLabel}
        avatarUrl={avatarUrl}
      />

      {/* Cabeçalho fino (só no celular; no desktop quem resolve é a top bar) */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white lg:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/estoque" className="flex items-center" aria-label="GilsonCar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gilsoncar-nav.png" alt="GilsonCar" className="h-8 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-3">
            <PrivacyToggle />
            <Avatar src={avatarUrl} initials={profile.initials ?? ''} name={profile.name ?? ''} roleLabel={roleLabel} />
            <form action={logout}>
              <button type="submit" title="Sair" className="text-sm text-neutral-400 transition hover:text-neutral-900">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Máscara de fade no topo: só no desktop, pra dissolver o conteúdo antes
          de chegar na barra flutuante. No celular o cabeçalho é reto (sólido). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 hidden h-24 bg-gradient-to-b from-neutral-50 from-[70%] to-transparent lg:block" />

      {/* Máscara de fade embaixo (só mobile): o conteúdo some antes de chegar
          no dock flutuante, então nada passa atrás dele. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-neutral-50 from-[66%] to-transparent lg:hidden" />

      <main>
        <div className="mx-auto max-w-7xl overflow-x-clip px-4 pt-6 pb-28 lg:pt-24 lg:pb-12">{children}</div>
      </main>

      {/* Lembrete pro admin do que falta preencher (1x por sessão). */}
      {isAdmin && (
        <AdminReminder semMargem={pendingCount} semCusto={semCusto} vendasSemLoja={vendasSemLoja} />
      )}

      {/* Navegação mobile: dock flutuante */}
      <div className="lg:hidden">
        <MacOsDock role={profile.role} pendingCount={pendingCount} />
      </div>
    </div>
  );
}
