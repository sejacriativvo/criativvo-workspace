'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Client, Vehicle } from '@/lib/types';
import { CLIENT_STATUS_LABEL, brl } from '@/lib/negociacao';
import { BottomSheet } from '@/components/bottom-sheet';
import { saveClient, moveClient, deleteClient } from './actions';

type Veh = Pick<Vehicle, 'id' | 'name' | 'price'>;
type Cols = Record<string, Client[]>;

// Ordem das colunas do quadro (funil da esquerda pra direita).
const BOARD = ['lead', 'visit', 'negotiating', 'followup', 'sold', 'lost'];
// Colunas "finais" que mostram só o mês selecionado (não acumulam pra sempre).
const TERMINAL = new Set(['sold', 'lost']);
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Cor por etapa: tinge o cabeçalho da coluna E o card (fundo suave + barra
// lateral), pra identificar a etapa de bate-olho, principalmente no celular
// (colunas empilhadas). Paleta sem roxo — 6 famílias bem distintas.
const STAGE: Record<string, { head: string; card: string }> = {
  lead: { head: 'bg-blue-100 text-blue-700', card: 'border-blue-200 border-l-blue-500 bg-blue-50/60' },
  visit: { head: 'bg-orange-100 text-orange-700', card: 'border-orange-200 border-l-orange-400 bg-orange-50/60' },
  negotiating: { head: 'bg-yellow-100 text-yellow-800', card: 'border-yellow-200 border-l-yellow-400 bg-yellow-50/70' },
  followup: { head: 'bg-rose-100 text-rose-700', card: 'border-rose-200 border-l-rose-400 bg-rose-50/60' },
  sold: { head: 'bg-emerald-100 text-emerald-700', card: 'border-emerald-200 border-l-emerald-400 bg-emerald-50/60' },
  lost: { head: 'bg-neutral-200 text-neutral-600', card: 'border-neutral-200 border-l-neutral-300 bg-neutral-50' },
};

function fmtDate(d: string): string {
  const [, m, day] = d.split('-');
  return day && m ? `${day}/${m}` : d;
}
function waLink(phone: string, msg?: string): string {
  const d = phone.replace(/\D/g, '');
  const num = d.startsWith('55') ? d : '55' + d;
  return `https://wa.me/${num}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

// Monta as colunas a partir da lista crua, aplicando o filtro de mês nas finais.
function buildColumns(clients: Client[], cm: { y: number; m: number }): Cols {
  const cols: Cols = {};
  for (const s of BOARD) cols[s] = [];
  for (const c of clients) {
    if (!cols[c.status]) continue;
    if (TERMINAL.has(c.status)) {
      if (!c.closed_at) continue;
      const d = new Date(c.closed_at);
      if (d.getFullYear() !== cm.y || d.getMonth() !== cm.m) continue;
    }
    cols[c.status].push(c);
  }
  return cols;
}

function findContainer(id: string, cols: Cols): string | undefined {
  if (id in cols) return id;
  return BOARD.find((s) => cols[s]?.some((c) => c.id === id));
}

// ——— Conteúdo visual do card (usado no card real e no card flutuante) ———
function CardBody({ c, carName }: { c: Client; carName: (id: string | null) => string }) {
  return (
    <>
      <div data-private className="font-semibold text-base text-neutral-900">{c.name}</div>
      {c.phone && <div data-private className="text-sm text-neutral-500">{c.phone}</div>}
      {c.car_id && <div className="text-sm text-neutral-600 mt-1">🚗 {carName(c.car_id)}</div>}
      {c.status === 'sold' && c.sold_value != null && (
        <div data-private className="text-sm font-medium text-emerald-700 mt-1">
          Vendido por {brl(c.sold_value)}{c.payment ? ` · ${c.payment}` : ''}
        </div>
      )}
      {c.status === 'lost' && c.lost_reason && (
        <div className="text-sm text-neutral-600 mt-1">
          <span className="text-neutral-400">Motivo:</span> {c.lost_reason}
        </div>
      )}
      {c.notes && <p data-private className="text-sm text-neutral-700 mt-1.5 whitespace-pre-wrap">{c.notes}</p>}
      {(c.contacted_at || c.visit_date || c.followup_date || c.visited_at) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.contacted_at && (
            <span className="rounded-md bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5">
              Conversa {fmtDate(c.contacted_at)}
            </span>
          )}
          {c.visit_date && (
            <span className="rounded-md bg-blue-50 text-blue-700 text-xs px-2 py-0.5">
              Visita {fmtDate(c.visit_date)}{c.visit_time ? ` ${c.visit_time.slice(0, 5)}` : ''}
            </span>
          )}
          {c.followup_date && (
            <span className="rounded-md bg-orange-50 text-orange-700 text-xs px-2 py-0.5">
              Retornar {fmtDate(c.followup_date)}
            </span>
          )}
          {c.visited_at && (
            <span className="rounded-md bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5">
              Veio {fmtDate(c.visited_at)}
            </span>
          )}
        </div>
      )}
    </>
  );
}

// ——— Card arrastável ———
function SortableCard({
  c,
  carName,
  onEdit,
  onMove,
}: {
  c: Client;
  carName: (id: string | null) => string;
  onEdit: (c: Client) => void;
  onMove: (c: Client, status: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: c.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const st = STAGE[c.status] ?? STAGE.lead;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border border-l-4 p-3 transition hover:shadow-sm ${st.card}`}
    >
      {/* Alça de arrastar: SÓ ela move o card. O resto do card rola e clica
          normal (no celular não briga mais com o scroll). */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar"
        className="absolute right-1.5 top-1.5 grid h-8 w-8 touch-none cursor-grab place-items-center rounded-lg text-neutral-300 transition hover:bg-neutral-100 hover:text-neutral-500 active:cursor-grabbing"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" />
          <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
          <circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" />
        </svg>
      </button>

      <div className="pr-7">
        <CardBody c={c} carName={carName} />
      </div>

      <div className="mt-2.5 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {c.phone && (
            <a
              href={waLink(
                c.phone,
                `Olá ${c.name.split(' ')[0]}! Aqui é da GilsonCar Veículos.${
                  c.car_id ? ` Tudo bem? Passando pra falar sobre o ${carName(c.car_id)}.` : ' Tudo bem?'
                }`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-2 grid place-items-center active:scale-95 transition"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1A7.9 7.9 0 0 0 12 19.9a7.94 7.94 0 0 0 5.6-13.58zM12 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.49.65.66-2.43-.16-.25A6.56 6.56 0 1 1 12 18.5zm3.61-4.94c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.5.63-.62.76-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.99 6 6 0 0 1-1.1-1.37c-.12-.2 0-.31.09-.41s.2-.23.3-.35a1.36 1.36 0 0 0 .2-.33.37.37 0 0 0 0-.35c-.05-.1-.44-1.07-.61-1.46s-.32-.33-.44-.34h-.38a.72.72 0 0 0-.52.24 2.2 2.2 0 0 0-.68 1.63 3.82 3.82 0 0 0 .8 2.03 8.7 8.7 0 0 0 3.33 2.95c.47.2.83.32 1.11.41a2.68 2.68 0 0 0 1.23.08 2 2 0 0 0 1.31-.93 1.62 1.62 0 0 0 .12-.92c-.05-.08-.18-.13-.38-.23z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(c)}
            className="rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold px-2.5 py-2"
          >
            Editar
          </button>
          <form
            action={deleteClient}
            onSubmit={(ev) => {
              if (!confirm(`Excluir o cliente "${c.name}"?`)) ev.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={c.id} />
            <button
              type="submit"
              className="rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold px-2.5 py-2"
            >
              Excluir
            </button>
          </form>
        </div>
        <select
          value=""
          onChange={(ev) => {
            onMove(c, ev.target.value);
            ev.target.value = '';
          }}
          className="w-full rounded-lg border border-neutral-300 text-xs font-medium text-neutral-600 px-2 py-2"
        >
          <option value="" disabled>Mover para ▾</option>
          {BOARD.filter((s) => s !== c.status).map((s) => (
            <option key={s} value={s}>{CLIENT_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ——— Coluna (área que recebe os cards, inclusive quando vazia) ———
function Column({
  status,
  items,
  carName,
  onEdit,
  onMove,
}: {
  status: string;
  items: Client[];
  carName: (id: string | null) => string;
  onEdit: (c: Client) => void;
  onMove: (c: Client, status: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div className="w-full lg:flex-1 lg:min-w-0">
      <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 mb-2 text-xs font-bold ${(STAGE[status] ?? STAGE.lead).head}`}>
        <span>{CLIENT_STATUS_LABEL[status]}</span>
        <span className="opacity-70">{items.length}</span>
      </div>
      <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`space-y-2 min-h-16 rounded-xl transition-colors ${
            isOver ? 'bg-neutral-200/60' : ''
          }`}
        >
          {items.map((c) => (
            <SortableCard key={c.id} c={c} carName={carName} onEdit={onEdit} onMove={onMove} />
          ))}
          {items.length === 0 && (
            <div className="text-center text-[11px] text-neutral-300 py-5 border border-dashed border-neutral-200 rounded-xl">
              arraste aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function ClientesView({
  clients,
  vehicles,
  preselectCarId,
  openNew = false,
}: {
  clients: Client[];
  vehicles: Veh[];
  preselectCarId: string | null;
  openNew?: boolean;
}) {
  const [open, setOpen] = useState(!!preselectCarId || openNew);
  const [editing, setEditing] = useState<Client | null>(null);
  const [formStatus, setFormStatus] = useState('lead');
  const [toast, setToast] = useState<string | null>(null);
  const now = new Date();
  const [closedMonth, setClosedMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [, startMove] = useTransition();
  const [state, formAction, pending] = useActionState(saveClient, null);
  const router = useRouter();

  // Estado local das colunas (permite mover o card na hora, antes de salvar no servidor).
  const [columns, setColumns] = useState<Cols>(() => buildColumns(clients, closedMonth));
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);
  // Sincroniza quando os dados do servidor mudam ou troca o mês.
  useEffect(() => {
    setColumns(buildColumns(clients, closedMonth));
  }, [clients, closedMonth]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const startContainer = useRef<string | undefined>(undefined);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  useEffect(() => {
    if (state?.ok) {
      setOpen(false);
      setEditing(null);
      setToast('Salvo com sucesso');
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Botão "+" flutuante (de qualquer aba) abre o cadastro aqui.
  useEffect(() => {
    const h = () => {
      setEditing(null);
      setFormStatus('lead');
      setOpen(true);
    };
    window.addEventListener('gc:new-client', h);
    return () => window.removeEventListener('gc:new-client', h);
  }, []);

  function startNew() {
    setEditing(null);
    setFormStatus('lead');
    setOpen(true);
  }
  function startEdit(c: Client, presetStatus?: string) {
    setEditing(c);
    setFormStatus(presetStatus ?? c.status);
    setOpen(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Move via o seletor "Mover" (acessível/fallback). "Vendeu" abre o formulário.
  function move(c: Client, status: string) {
    if (status === c.status) return;
    if (status === 'sold') {
      startEdit(c, 'sold');
      return;
    }
    setColumns((prev) => {
      const from = c.status;
      const moving = prev[from]?.find((x) => x.id === c.id);
      if (!moving || !prev[status]) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((x) => x.id !== c.id),
        [status]: [moving, ...prev[status]],
      };
    });
    startMove(async () => {
      await moveClient(c.id, status);
      router.refresh();
    });
  }

  function handleDragStart(e: DragStartEvent) {
    const id = e.active.id as string;
    setActiveId(id);
    startContainer.current = findContainer(id, columnsRef.current);
  }

  // Durante o arraste: move o card entre colunas em tempo real (o reflow é animado).
  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeKey = active.id as string;
    const overKey = over.id as string;
    setColumns((prev) => {
      const from = findContainer(activeKey, prev);
      const to = findContainer(overKey, prev);
      if (!from || !to || from === to) return prev;
      const fromItems = prev[from];
      const toItems = prev[to];
      const moving = fromItems.find((c) => c.id === activeKey);
      if (!moving) return prev;
      const overIdx = toItems.findIndex((c) => c.id === overKey);
      const insertAt = overIdx >= 0 ? overIdx : toItems.length;
      return {
        ...prev,
        [from]: fromItems.filter((c) => c.id !== activeKey),
        [to]: [...toItems.slice(0, insertAt), moving, ...toItems.slice(insertAt)],
      };
    });
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    const activeKey = active.id as string;
    const start = startContainer.current;
    startContainer.current = undefined;
    setActiveId(null);
    if (!over) return;

    const cols = columnsRef.current;
    const final = findContainer(activeKey, cols);
    if (!final) return;

    // Reordena dentro da mesma coluna (só visual).
    const overKey = over.id as string;
    const items = cols[final];
    const oldI = items.findIndex((c) => c.id === activeKey);
    const overI = items.findIndex((c) => c.id === overKey);
    if (oldI !== -1 && overI !== -1 && oldI !== overI) {
      setColumns((prev) => ({ ...prev, [final]: arrayMove(prev[final], oldI, overI) }));
    }

    // Mudou de coluna? Persiste o novo status.
    if (!start || final === start) return;
    const client = clients.find((c) => c.id === activeKey);
    if (!client) return;
    if (final === 'sold') {
      // Venda precisa de valor/pagamento: desfaz o movimento e abre o formulário.
      setColumns(buildColumns(clients, closedMonth));
      startEdit(client, 'sold');
      return;
    }
    startMove(async () => {
      await moveClient(client.id, final);
      router.refresh();
    });
  }

  const carName = (id: string | null) =>
    id ? (vehicles.find((v) => v.id === id)?.name ?? '—') : '—';

  const activeClient = activeId ? clients.find((c) => c.id === activeId) ?? null : null;
  const e = editing;

  return (
    <div>
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-600 text-white text-sm font-semibold px-4 py-2 shadow-lg">
          ✓ {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Clientes</h1>
          <p className="text-xs text-neutral-500">Arraste os cards pra mudar de etapa (no celular, segure e arraste) ou use “Mover”.</p>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : startNew())}
          className="inline-flex rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white text-sm font-semibold px-3 py-2 shrink-0"
        >
          {open ? 'Fechar' : '+ Cliente'}
        </button>
      </div>

      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={e ? 'Editar cliente' : 'Novo cliente'}
      >
        <form key={e?.id ?? 'new'} action={formAction} className="space-y-3">
          {e && <input type="hidden" name="id" value={e.id} />}

          <div className="grid grid-cols-2 gap-3">
            <input name="name" required defaultValue={e?.name ?? ''} placeholder="Nome do cliente" className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
            <input name="phone" defaultValue={e?.phone ?? ''} placeholder="(16) 99999-0000" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
            <select
              name="status"
              value={formStatus}
              onChange={(ev) => setFormStatus(ev.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              {Object.entries(CLIENT_STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select name="car_id" defaultValue={e?.car_id ?? preselectCarId ?? ''} className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm">
              <option value="">Carro de interesse (opcional)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name} · {brl(v.price)}</option>
              ))}
            </select>
            <textarea name="notes" defaultValue={e?.notes ?? ''} placeholder="Observações da negociação..." rows={2} className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          </div>

          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
            <div className="text-xs font-semibold text-neutral-600 mb-2">Datas (opcional)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block min-w-0 text-xs text-neutral-500">
                Conversamos em
                <input name="contacted_at" type="date" defaultValue={e?.contacted_at ?? ''} className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </label>
              <label className="block min-w-0 text-xs text-neutral-500">
                Visita agendada para
                <input name="visit_date" type="date" defaultValue={e?.visit_date ?? ''} className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </label>
              <label className="block min-w-0 text-xs text-neutral-500">
                Horário da visita
                <input name="visit_time" type="time" defaultValue={e?.visit_time?.slice(0, 5) ?? ''} className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </label>
              <label className="block min-w-0 text-xs text-neutral-500">
                Veio à loja em
                <input name="visited_at" type="date" defaultValue={e?.visited_at ?? ''} className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
              </label>
            </div>
          </div>

          {formStatus === 'sold' && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-xs font-semibold text-emerald-800 mb-2">Dados da venda</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="sm:col-span-2 block min-w-0 text-xs text-neutral-600">
                  Loja da venda
                  <select name="store" defaultValue={e?.store ?? 'ibitinga'} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                    <option value="ibitinga">Ibitinga</option>
                    <option value="borborema">Borborema</option>
                  </select>
                </label>
                <label className="block min-w-0 text-xs text-neutral-600">
                  Valor vendido (R$)
                  <input name="sold_value" type="number" min="0" defaultValue={e?.sold_value ?? ''} placeholder="65000" className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
                </label>
                <label className="block min-w-0 text-xs text-neutral-600">
                  Desconto dado (R$)
                  <input name="discount" type="number" min="0" defaultValue={e?.discount ?? ''} placeholder="2000" className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
                </label>
                <label className="sm:col-span-2 block min-w-0 text-xs text-neutral-600">
                  Forma de pagamento
                  <select name="payment" defaultValue={e?.payment ?? ''} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
                    <option value="">Selecionar...</option>
                    <option>À vista (dinheiro/PIX)</option>
                    <option>Financiamento bancário</option>
                    <option>Cartão</option>
                    <option>Troca + diferença</option>
                    <option>Outro</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {formStatus === 'lost' && (
            <input
              name="lost_reason"
              defaultValue={e?.lost_reason ?? ''}
              placeholder="Motivo de não ter comprado (ex: preço, achou outro carro)"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          )}

          {formStatus === 'followup' && (
            <label className="block text-xs text-neutral-600">
              Quando retornar
              <input
                name="followup_date"
                type="date"
                defaultValue={e?.followup_date ?? ''}
                className="mt-1 block w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
          )}

          {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold py-2.5 disabled:opacity-60"
          >
            {pending ? 'Salvando...' : e ? 'Salvar alterações' : 'Salvar cliente'}
          </button>
        </form>
      </BottomSheet>

      {/* Seletor de mês — afeta só as colunas Vendeu / Não comprou */}
      <div className="flex items-center flex-wrap gap-2 mb-3 text-sm">
        <span className="text-neutral-500">Vendeu/perdeu de:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setClosedMonth((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))}
            className="h-7 w-7 grid place-items-center rounded-lg border border-neutral-200 active:scale-95 transition"
          >‹</button>
          <span className="font-semibold text-neutral-800 min-w-24 text-center">{MESES[closedMonth.m]} {closedMonth.y}</span>
          <button
            onClick={() => setClosedMonth((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))}
            className="h-7 w-7 grid place-items-center rounded-lg border border-neutral-200 active:scale-95 transition"
          >›</button>
        </div>
      </div>

      {/* Quadro estilo Trello — drag fluido (PC e celular) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex flex-col lg:flex-row gap-2 pb-3">
          {BOARD.map((status) => (
            <Column
              key={status}
              status={status}
              items={columns[status] ?? []}
              carName={carName}
              onEdit={startEdit}
              onMove={move}
            />
          ))}
        </div>

        <DragOverlay>
          {activeClient ? (
            <div className={`rounded-xl border border-l-4 p-3 shadow-2xl rotate-2 cursor-grabbing ${(STAGE[activeClient.status] ?? STAGE.lead).card}`}>
              <CardBody c={activeClient} carName={carName} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
