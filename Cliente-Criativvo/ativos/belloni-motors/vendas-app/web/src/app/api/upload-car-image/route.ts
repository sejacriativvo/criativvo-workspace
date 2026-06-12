import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });

  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buf  = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from('car-images')
    .upload(path, buf, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from('car-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
