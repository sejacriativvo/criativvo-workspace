import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Vehicle, CarRow } from '@/lib/types';
import { brl, levelHint, LEVEL_LABEL, adminMetrics } from '@/lib/negociacao';
import { CarActions } from './car-actions';
import { SuccessToast } from '@/components/success-toast';

export const dynamic = 'force-dynamic';

const LEVEL_BG: Record<string, string> = {
  green: 'from-emerald-500 to-emerald-600',
  yellow: 'from-amber-500 to-amber-600',
  red: 'from-rose-500 to-rose-600',
  pending: 'from-slate-500 to-slate-600',
};

export default async function CarDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const { ok }  = await searchParams;
  const profile = await requireProfile();
  await blockTraffic(profile);
  const isAdmin = profile.role === 'admin';
  const supabase = await createClient();

  const { data: v } = await supabase
    .from('vehicles_public')
    .select('*')
    .eq('id', id)
    .single();
  if (!v) notFound();
  const vehicle = v as Vehicle;

  let car: CarRow | null = null;
  if (isAdmin) {
    const { data: c } = await supabase.from('cars').select('*').eq('id', id).single();
    car = (c as CarRow) ?? null;
  }
  const m = car ? adminMetrics(car.price, car.cost, vehicle.max_discount) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <SuccessToast ok={ok ?? null} />
      <Link href="/estoque" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Voltar ao estoque
      </Link>

      <div className="mt-3 bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Foto principal */}
        <div className="aspect-[16/10] bg-neutral-100">
          {vehicle.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vehicle.img} alt={vehicle.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full grid place-items-center text-neutral-300">sem foto</div>
          )}
        </div>

        {/* Galeria de fotos adicionais */}
        {vehicle.photos?.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto p-2 bg-neutral-50 border-t border-neutral-100">
            {vehicle.photos.map((url, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={url} alt={`Foto ${idx + 1}`}
                className="h-16 w-24 shrink-0 rounded-lg object-cover border border-neutral-200" />
            ))}
          </div>
        )}

        <div className="p-5">
          <h1 className="text-2xl font-bold text-neutral-900">{vehicle.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {vehicle.year} · {vehicle.km} · {vehicle.cor} · {vehicle.cambio} · {vehicle.combustivel}
          </p>

          <div className="mt-3 text-2xl font-bold text-neutral-900">{brl(vehicle.price)}</div>
          <p className="text-xs text-neutral-400">
            {vehicle.days_in_stock} dias no estoque
            {isAdmin && car?.acquired_at && (
              <> · adquirido em {car.acquired_at.split('-').reverse().join('/')}</>
            )}
          </p>

          {/* Card de negociação — o coração do app. Aparece mesmo em preparação. */}
          <div className={`mt-4 rounded-2xl p-4 text-white bg-gradient-to-br ${LEVEL_BG[vehicle.level]}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-medium opacity-90">{LEVEL_LABEL[vehicle.level]}</div>
              {vehicle.in_prep && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                  Em preparação
                </span>
              )}
            </div>
            {vehicle.level === 'pending' ? (
              <>
                <div className="mt-1 text-lg font-bold">Sem desconto liberado</div>
                <p className="mt-2 text-sm opacity-95">{levelHint(vehicle.level, null)}</p>
              </>
            ) : (
              <>
                <div className="mt-1 text-sm opacity-90">Preço mínimo de venda</div>
                <div className="text-4xl font-extrabold mt-0.5">{brl(vehicle.price - (vehicle.max_discount ?? 0))}</div>
                <p className="mt-2 text-sm opacity-95">
                  Tabela {brl(vehicle.price)} · até {brl(vehicle.max_discount ?? 0)} de desconto.
                  Não feche abaixo desse valor sem aprovação.
                </p>
              </>
            )}
          </div>

          {/* Visão exclusiva do admin: margem definida, custo e lucro */}
          {isAdmin && car && m && (
            <div className={`mt-4 rounded-2xl border p-4 ${vehicle.level === 'pending' ? 'border-amber-300 bg-amber-50' : 'border-neutral-200'}`}>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Visão do administrador
              </div>

              {vehicle.level === 'pending' ? (
                <p className="text-sm text-amber-800">
                  Margem ainda não definida.
                  Enquanto não definir, o vendedor não vê desconto pra esse carro.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-neutral-400">Desconto liberado</div>
                      <div className="font-bold text-neutral-900">{brl(vehicle.max_discount ?? 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Custo</div>
                      <div className="font-bold text-neutral-900">{car.cost != null ? brl(car.cost) : '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Lucro</div>
                      <div className="font-bold text-emerald-700">{m.margin != null ? brl(m.margin) : '—'}</div>
                    </div>
                  </div>
                  {m.profitAfterDiscount != null && (
                    <p className="mt-2 text-xs text-neutral-500 text-center">
                      Lucro se der o desconto máximo: <b className="text-neutral-800">{brl(m.profitAfterDiscount)}</b>
                    </p>
                  )}
                </>
              )}

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/cadastrar?id=${car.id}`}
                  className={`flex-1 block text-center text-sm rounded-lg py-2 font-semibold ${
                    vehicle.level === 'pending'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {vehicle.level === 'pending' ? 'Definir margem agora' : 'Editar margem'}
                </Link>
                <Link
                  href={`/estoque/${car.id}/editar`}
                  className="flex-1 block text-center text-sm rounded-lg py-2 font-semibold border border-neutral-300 hover:bg-neutral-50"
                >
                  Editar carro / foto
                </Link>
              </div>
            </div>
          )}

          {/* Opcionais */}
          {vehicle.opcionais?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Opcionais
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.opcionais.map((o) => (
                  <span key={o} className="rounded-full bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA: registrar cliente/negociação */}
          <Link
            href={`/clientes?carId=${vehicle.id}`}
            className="mt-5 block text-center rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold py-3"
          >
            Registrar cliente / negociação
          </Link>

          {/* Ações admin: marcar como vendido ou remover */}
          {isAdmin && vehicle.status === 'available' && (
            <CarActions carId={vehicle.id} />
          )}
        </div>
      </div>
    </div>
  );
}
