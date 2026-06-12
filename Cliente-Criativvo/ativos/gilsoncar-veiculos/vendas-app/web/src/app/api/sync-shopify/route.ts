// Rota chamada automaticamente pelo Vercel Cron (e disponível pra disparo manual).
// Segurança: o Vercel manda "Authorization: Bearer <CRON_SECRET>" se a env
// CRON_SECRET estiver setada. Em produção, sem o header correto, recusa.
import { NextResponse } from 'next/server';
import { runShopifySync } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  // Fail-closed: sem CRON_SECRET configurado, a rota fica FECHADA (não roda).
  // O sync manual do app usa um server action com requireAdmin(), não esta rota.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'rota desativada (sem CRON_SECRET)' }, { status: 503 });
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'não autorizado' }, { status: 401 });
  }

  const result = await runShopifySync();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
