'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/lib/types';
import { saveBankCred, addBank, deleteBank } from './actions';

export type Bank = {
  id: string;
  bank: string;
  label: string;
  login: string | null;
  password: string | null;
  note: string | null;
  sort_order: number;
};

// Cor da marca + sigla de cada banco (vira o "logo" no avatar).
const BANK_STYLE: Record<string, { color: string; short: string }> = {
  santander: { color: '#EC0000', short: 'San' },
  bv: { color: '#16235A', short: 'BV' },
  bradesco: { color: '#CC092F', short: 'Bra' },
  pan: { color: '#0B5CAB', short: 'Pan' },
  c6: { color: '#1A1A1A', short: 'C6' },
  omni: { color: '#E2001A', short: 'Omni' },
  safra: { color: '#0A1F44', short: 'Safra' },
  carbank: { color: '#0E7C5A', short: 'Car' },
  itau: { color: '#EC7000', short: 'Itaú' },
};
function styleFor(slug: string, label: string) {
  return BANK_STYLE[slug] ?? { color: '#475569', short: (label || slug).slice(0, 2).toUpperCase() };
}
// Bancos com logo real salva em /public/banks/<slug>.png. O resto cai no avatar colorido.
const BANK_LOGOS = new Set(['santander', 'itau', 'bradesco', 'c6', 'safra', 'pan', 'omni', 'bv', 'carbank']);

function BankAvatar({ slug, label }: { slug: string; label: string }) {
  if (BANK_LOGOS.has(slug)) {
    // object-cover sem padding: a logo preenche o quadradinho todo (sem borda
    // branca em volta de logos coloridas como Pan/Itaú/Santander).
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/banks/${slug}.png`} alt={label} className="h-full w-full object-cover" />
      </div>
    );
  }
  const st = styleFor(slug, label);
  return (
    <div
      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white shadow-sm"
      style={{ backgroundColor: st.color }}
    >
      {st.short}
    </div>
  );
}

/* ---------- ícones ---------- */
const ic = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Copy = (p: { className?: string }) => (<svg {...ic} className={p.className}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
const Check = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M20 6 9 17l-5-5" /></svg>);
const Eye = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>);
const EyeOff = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a13.4 13.4 0 0 1-2.4 3.1M6.6 6.6A13.3 13.3 0 0 0 2 12s3.5 7 10 7a10.7 10.7 0 0 0 4.1-.8M3 3l18 18M9.5 9.5a3 3 0 0 0 4.2 4.2" /></svg>);
const Pencil = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>);
const Plus = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M12 5v14M5 12h14" /></svg>);
const Trash = (p: { className?: string }) => (<svg {...ic} className={p.className}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>);

/* ---------- botão copiar ---------- */
function CopyButton({ value, what }: { value: string | null; what: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      disabled={!value}
      title={`Copiar ${what}`}
      onClick={async () => {
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        } catch {
          /* clipboard bloqueado */
        }
      }}
      className={`shrink-0 grid h-9 w-9 place-items-center rounded-lg border transition disabled:opacity-40 ${
        done ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
      }`}
    >
      {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

/* ---------- card de um banco ---------- */
function BankCard({ b, isAdmin, onSaved }: { b: Bank; isAdmin: boolean; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [login, setLogin] = useState(b.login ?? '');
  const [pass, setPass] = useState(b.password ?? '');
  const [label, setLabel] = useState(b.label);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function save() {
    setErr(null);
    start(async () => {
      const r = await saveBankCred({ id: b.id, login: login.trim() || null, password: pass.trim() || null, label });
      if (r?.error) setErr(r.error);
      else {
        setEditing(false);
        onSaved();
      }
    });
  }
  function remove() {
    if (!confirm(`Remover o banco "${b.label}"?`)) return;
    start(async () => {
      const r = await deleteBank(b.id);
      if (r?.error) setErr(r.error);
      else onSaved();
    });
  }

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* cabeçalho: avatar + nome + lápis */}
      <div className="flex items-center gap-3">
        <BankAvatar slug={b.bank} label={b.label} />
        {editing ? (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm font-semibold"
          />
        ) : (
          <div className="min-w-0 flex-1">
            <div className="truncate font-bold text-neutral-900">{b.label}</div>
            <div className="text-xs text-neutral-400">Acesso do banco</div>
          </div>
        )}
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Editar"
            className="shrink-0 grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* corpo */}
      {editing ? (
        <div className="mt-4 space-y-2">
          <label className="block text-[11px] font-medium text-neutral-500">
            Login
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="login / CPF / usuário"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono"
            />
          </label>
          <label className="block text-[11px] font-medium text-neutral-500">
            Senha
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="senha"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono"
            />
          </label>
          {err && <p className="text-xs text-rose-600">{err}</p>}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={save}
              disabled={pending}
              className="rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 disabled:opacity-60"
            >
              {pending ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setLogin(b.login ?? '');
                setPass(b.password ?? '');
                setLabel(b.label);
                setErr(null);
              }}
              className="rounded-lg border border-neutral-300 text-neutral-600 text-sm font-semibold px-4 py-2 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            {isAdmin && (
              <button
                onClick={remove}
                disabled={pending}
                title="Remover banco"
                className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {/* login */}
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Login</div>
              <div data-private className="truncate font-mono text-sm text-neutral-900">{b.login || '—'}</div>
            </div>
            <CopyButton value={b.login} what="login" />
          </div>
          {/* senha */}
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Senha</div>
              <div data-private className="truncate font-mono text-sm text-neutral-900">
                {b.password ? (reveal ? b.password : '•'.repeat(10)) : '—'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              title={reveal ? 'Ocultar' : 'Mostrar'}
              disabled={!b.password}
              className="shrink-0 grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40"
            >
              {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <CopyButton value={b.password} what="senha" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- adicionar banco ---------- */
function AddBank({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="grid min-h-[140px] place-items-center rounded-2xl border-2 border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Adicionar banco</span>
      </button>
    );
  }
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-neutral-700 mb-2">Novo banco</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do banco"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      />
      {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            setErr(null);
            start(async () => {
              const r = await addBank({ label: name });
              if (r?.error) setErr(r.error);
              else {
                setOpen(false);
                setName('');
                onSaved();
              }
            });
          }}
          disabled={pending}
          className="rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 disabled:opacity-60"
        >
          {pending ? 'Criando...' : 'Criar'}
        </button>
        <button
          onClick={() => { setOpen(false); setName(''); setErr(null); }}
          className="rounded-lg border border-neutral-300 text-neutral-600 text-sm font-semibold px-4 py-2 hover:bg-neutral-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function FinanceirasView({ rows, role }: { rows: Bank[]; role: Role }) {
  const router = useRouter();
  const isAdmin = role === 'admin';
  const refresh = () => router.refresh();

  return (
    <div>
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Financeiras</h1>
          <p className="text-xs text-neutral-400">Acessos dos bancos. Toque no lápis pra editar, no olho pra revelar a senha.</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
          Nenhum banco cadastrado ainda.{isAdmin ? ' Use “Adicionar banco” abaixo.' : ''}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((b) => (
          <BankCard key={b.id} b={b} isAdmin={isAdmin} onSaved={refresh} />
        ))}
        <AddBank onSaved={refresh} />
      </div>

      <p className="mt-4 text-[11px] text-neutral-400">
        🔒 Visível só pra admin e vendedores. Os dados ficam protegidos por RLS e viajam só em HTTPS. Use o olhinho do topo pra borrar tudo se for mostrar a tela pra alguém.
      </p>
    </div>
  );
}
