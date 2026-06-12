import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { CarRow } from '@/lib/types';
import { EditCarForm } from './form';

export const dynamic = 'force-dynamic';

export default async function EditarCarroPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from('cars').select('*').eq('id', id).single();
  if (!data) notFound();
  const car = data as CarRow;

  return (
    <div className="max-w-xl mx-auto">
      <Link href={`/estoque/${id}`} className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Voltar ao carro
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 mt-3 mb-5">Editar carro</h1>
      <EditCarForm car={car} />
    </div>
  );
}
