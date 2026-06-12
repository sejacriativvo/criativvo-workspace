import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { CarRow } from '@/lib/types';
import { brl } from '@/lib/negociacao';
import { MarginForm } from './form';

export const dynamic = 'force-dynamic';

export default async function DefinirMargemPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireAdmin();
  const { id } = await searchParams;
  if (!id) redirect('/estoque'); // não existe mais cadastro manual

  const supabase = await createClient();
  const { data } = await supabase.from('cars').select('*').eq('id', id).single();
  const car = (data as CarRow) ?? null;
  if (!car) redirect('/estoque');

  return (
    <div className="max-w-xl mx-auto">
      <Link href={`/estoque/${car.id}`} className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Voltar ao carro
      </Link>

      <h1 className="text-2xl font-bold text-neutral-900 mt-3">Definir margem de negociação</h1>

      {/* Dados do carro (vêm da Shopify, não editáveis aqui) */}
      <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
        {car.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={car.img} alt={car.name} className="h-16 w-20 object-cover rounded-lg" />
        )}
        <div>
          <div className="font-semibold text-neutral-900">{car.name}</div>
          <div className="text-xs text-neutral-500">
            {car.year} · {car.cor} · {brl(car.price)}
          </div>
        </div>
      </div>

      <p className="text-sm text-neutral-500 mt-4 mb-2">
        Defina quanto de desconto o vendedor pode dar nesse carro. O vendedor vê só
        esse valor, nunca o custo.
      </p>
      <MarginForm car={car} />
    </div>
  );
}
