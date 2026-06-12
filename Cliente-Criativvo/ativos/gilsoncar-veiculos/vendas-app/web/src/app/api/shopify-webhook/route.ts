// Webhook da Shopify — tempo real. Dispara quando um produto é criado/atualizado
// na loja, e joga o carro aqui na hora (como pendente de custo).
// Precisa ser registrado na Shopify com o token (fase de ativação).
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type ShopifyVariant = { price: string; inventory_quantity?: number };
type ShopifyProductPayload = {
  id: number;
  title: string;
  status?: string;
  image?: { src: string } | null;
  images?: { src: string }[];
  variants?: ShopifyVariant[];
};

function verifyHmac(raw: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false; // sem secret: webhook desativado (fail-closed)
  if (!hmacHeader) return false;
  const digest = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyHmac(raw, request.headers.get('x-shopify-hmac-sha256'))) {
    return NextResponse.json({ ok: false, error: 'hmac inválido' }, { status: 401 });
  }

  let p: ShopifyProductPayload;
  try {
    p = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'payload inválido' }, { status: 400 });
  }

  const variant = p.variants?.[0];
  const price = variant ? Math.round(parseFloat(variant.price)) : 0;
  const img = p.image?.src || p.images?.[0]?.src || null;
  const status =
    variant && typeof variant.inventory_quantity === 'number' && variant.inventory_quantity <= 0
      ? 'sold'
      : 'available';

  const supabase = createAdminClient();
  const { error } = await supabase.rpc('upsert_shopify_car', {
    p_shopify_id: String(p.id),
    p_name: p.title,
    p_price: price,
    p_img: img,
    p_status: status,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
