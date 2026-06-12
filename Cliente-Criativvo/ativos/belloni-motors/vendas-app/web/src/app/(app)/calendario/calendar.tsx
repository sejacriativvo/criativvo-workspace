'use client';

import { useState } from 'react';

export type CalEvent = {
  date: string; // YYYY-MM-DD
  type: 'visit' | 'followup';
  label: string;
  time: string | null;
  car?: string | null;
  notes?: string | null;
  phone?: string | null;
};

function waLink(phone: string, name: string, car?: string | null): string {
  const d = phone.replace(/\D/g, '');
  const num = d.startsWith('55') ? d : '55' + d;
  const msg = `Olá ${name.split(' ')[0]}! Aqui é da Belloni Motors.${car ? ` Tudo bem? Passando pra falar sobre o ${car}.` : ' Tudo bem?'}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_CURTO = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const TYPE_STYLE: Record<string, string> = {
  visit: 'bg-blue-100 text-blue-700',
  followup: 'bg-orange-100 text-orange-700',
};
const DOT_STYLE: Record<string, string> = { visit: 'bg-blue-500', followup: 'bg-orange-500' };
const TYPE_LABEL: Record<string, string> = { visit: 'Visita', followup: 'Retornar' };

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function dayHeader(ds: string): string {
  const [y, m, d] = ds.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const s = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function DayDetail({ title, events, today }: { title: string; events: CalEvent[]; today?: boolean }) {
  return (
    <div>
      <div className="text-sm font-bold text-neutral-700 mb-2">
        {title}
        {today && <span className="ml-2 rounded-full bg-neutral-200 text-neutral-900 text-[11px] font-bold px-2 py-0.5">hoje</span>}
      </div>
      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-center text-neutral-400 text-sm">
          Nada agendado nesse dia.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
          {events.map((e, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-lg px-2 py-1 text-xs font-bold shrink-0 ${TYPE_STYLE[e.type]}`}>{TYPE_LABEL[e.type]}</span>
                {e.time && <span className="text-base font-semibold text-neutral-900 tabular-nums">{e.time.slice(0, 5)}</span>}
                <span data-private className="text-base font-semibold text-neutral-900">{e.label}</span>
              </div>
              {e.car && <div className="text-sm text-neutral-600 mt-1.5">🚗 {e.car}</div>}
              {e.notes && <div data-private className="text-sm text-neutral-600 mt-1 whitespace-pre-wrap">{e.notes}</div>}
              {e.phone && (
                <a
                  data-private
                  href={waLink(e.phone, e.label, e.car)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1A7.9 7.9 0 0 0 12 19.9a7.94 7.94 0 0 0 5.6-13.58zM12 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.49.65.66-2.43-.16-.25A6.56 6.56 0 1 1 12 18.5z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Calendar({ events }: { events: CalEvent[] }) {
  const today = new Date();
  const todayStr = ymd(today.getFullYear(), today.getMonth(), today.getDate());
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(todayStr);

  const byDate = new Map<string, CalEvent[]>();
  for (const e of events) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  }

  const firstWeekday = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const next = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  const goToday = () => {
    setCursor({ y: today.getFullYear(), m: today.getMonth() });
    setSelected(todayStr);
  };

  const selectedEvents = [...(byDate.get(selected) ?? [])].sort((a, b) => (a.time ?? '99').localeCompare(b.time ?? '99'));

  return (
    <>
      {/* Detalhe do dia selecionado — sempre no topo (começa em "hoje") */}
      <div className="mb-3">
        <DayDetail title={dayHeader(selected)} events={selectedEvents} today={selected === todayStr} />
      </div>

      {/* ===== MOBILE: mês compacto tocável ===== */}
      <div className="lg:hidden">
        <div className="bg-white rounded-2xl border border-neutral-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prev} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 active:scale-95 transition">‹</button>
            <div className="text-center">
              <div className="font-bold text-neutral-900">{MESES[cursor.m]} {cursor.y}</div>
              <button onClick={goToday} className="text-xs text-neutral-900">Hoje</button>
            </div>
            <button onClick={next} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 active:scale-95 transition">›</button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DIAS_CURTO.map((d, i) => (
              <div key={i} className="text-center text-[11px] font-medium text-neutral-400">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const ds = ymd(cursor.y, cursor.m, d);
              const evs = byDate.get(ds) ?? [];
              const isToday = ds === todayStr;
              const isSel = ds === selected;
              return (
                <button
                  key={ds}
                  onClick={() => setSelected(ds)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition active:scale-90 ${
                    isSel ? 'bg-neutral-900 text-white' : isToday ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-700'
                  }`}
                >
                  <span className="text-sm leading-none">{d}</span>
                  <span className="flex gap-0.5 mt-1 h-1.5">
                    {evs.slice(0, 3).map((e, j) => (
                      <span key={j} className={`h-1.5 w-1.5 rounded-full ${isSel ? 'bg-white' : DOT_STYLE[e.type]}`} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Visita</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> Retornar</span>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: mês inteiro + detalhe do dia ===== */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prev} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 hover:bg-neutral-50">‹</button>
            <div className="text-center">
              <div className="font-bold text-neutral-900">{MESES[cursor.m]} {cursor.y}</div>
              <button onClick={goToday} className="text-xs text-neutral-900 hover:underline">Hoje</button>
            </div>
            <button onClick={next} className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-200 hover:bg-neutral-50">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DIAS.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-neutral-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const ds = ymd(cursor.y, cursor.m, d);
              const dayEvents = byDate.get(ds) ?? [];
              const isToday = ds === todayStr;
              const isSel = ds === selected;
              return (
                <button
                  key={ds}
                  onClick={() => setSelected(ds)}
                  className={`text-left min-h-20 rounded-lg border p-1 transition hover:border-neutral-300 ${
                    isSel ? 'border-neutral-900 ring-1 ring-neutral-300' : isToday ? 'border-neutral-500 bg-neutral-100' : 'border-neutral-100'
                  }`}
                >
                  <div className={`text-[11px] font-semibold ${isToday || isSel ? 'text-neutral-900' : 'text-neutral-500'}`}>{d}</div>
                  <div className="space-y-0.5 mt-0.5">
                    {dayEvents.slice(0, 4).map((e, j) => (
                      <div key={j} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${TYPE_STYLE[e.type]}`}>
                        {e.time ? `${e.time.slice(0, 5)} ` : ''}<span data-private>{e.label}</span>
                      </div>
                    ))}
                    {dayEvents.length > 4 && <div className="text-[10px] text-neutral-400 px-1">+{dayEvents.length - 4}</div>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Visita agendada</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Retornar</span>
          </div>
        </div>
      </div>
    </>
  );
}
