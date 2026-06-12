import { requireProfile, blockTraffic } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Client } from '@/lib/types';
import { Calendar, type CalEvent } from './calendar';

export const dynamic = 'force-dynamic';

export default async function CalendarioPage() {
  await blockTraffic(await requireProfile());
  const supabase = await createClient();

  const [{ data }, { data: veh }] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, phone, status, car_id, notes, visit_date, visit_time, followup_date')
      .or('visit_date.not.is.null,followup_date.not.is.null'),
    supabase.from('vehicles_public').select('id, name'),
  ]);

  const clients = (data as Client[]) ?? [];
  const carName = new Map(((veh as { id: string; name: string }[]) ?? []).map((v) => [v.id, v.name]));
  const events: CalEvent[] = [];
  for (const c of clients) {
    const base = {
      label: c.name,
      phone: c.phone,
      car: c.car_id ? carName.get(c.car_id) ?? null : null,
      notes: c.notes,
    };
    if (c.visit_date)
      events.push({ ...base, date: c.visit_date, type: 'visit', time: c.visit_time });
    if (c.followup_date)
      events.push({ ...base, date: c.followup_date, type: 'followup', time: null });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Calendário</h1>
      <p className="text-sm text-neutral-500 mb-4">
        Toque num dia pra ver os agendamentos. Começa mostrando hoje.
      </p>

      <Calendar events={events} />
    </div>
  );
}
