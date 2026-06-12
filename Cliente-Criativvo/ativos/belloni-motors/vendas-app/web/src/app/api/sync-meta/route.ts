// Rota chamada automaticamente pelo Vercel Cron (e disponível pra disparo manual).
// Mesma blindagem do sync da Shopify: exige "Authorization: Bearer <CRON_SECRET>".
// Sem CRON_SECRET, fica FECHADA. O botão manual do app usa um server action.
import { NextResponse } from 'next/server';
import { runMetaSync } from '@/lib/meta';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'rota desativada (sem CRON_SECRET)' }, { status: 503 });
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'não autorizado' }, { status: 401 });
  }

  const result = await runMetaSync();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
