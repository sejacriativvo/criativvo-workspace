// Next 16: o antigo "middleware" agora se chama "proxy".
// Renova a sessão Supabase a cada request e protege as rotas internas.
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            }),
          );
        },
      },
    },
  );

  // Valida o login LOCAL (getClaims, sem rede) na maioria das vezes.
  // Só vai na rede (getUser) se o token estiver ausente/expirado, pra renovar.
  let authed = false;
  try {
    const { data } = await supabase.auth.getClaims();
    authed = !!data?.claims?.sub;
  } catch {
    authed = false;
  }
  if (!authed) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = !!user;
  }

  const path = request.nextUrl.pathname;
  // /api tem segurança própria (segredo do cron / HMAC da Shopify), não passa
  // pelo redirect de login.
  const isPublic = path === '/login' || path.startsWith('/auth') || path.startsWith('/api');

  if (!authed && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if (authed && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/estoque';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)',
  ],
};
