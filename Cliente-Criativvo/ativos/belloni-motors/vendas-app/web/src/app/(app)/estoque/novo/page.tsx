import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { AddCarForm } from './form';

export default async function NovoCarroPage() {
  await requireAdmin();

  return (
    <div className="max-w-xl mx-auto">
      <Link href="/estoque" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Voltar ao estoque
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 mt-3 mb-5">Adicionar carro</h1>
      <AddCarForm />
    </div>
  );
}
