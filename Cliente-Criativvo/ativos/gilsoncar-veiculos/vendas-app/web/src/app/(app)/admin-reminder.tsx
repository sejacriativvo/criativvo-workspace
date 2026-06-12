'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Pop-up que lembra o Italo de preencher o que falta (1x por sessão).
export function AdminReminder({
  semMargem,
  semCusto,
  vendasSemLoja,
}: {
  semMargem: number;
  semCusto: number;
  vendasSemLoja: number;
}) {
  const [open, setOpen] = useState(false);
  const total = semMargem + semCusto + vendasSemLoja;

  useEffect(() => {
    if (total === 0) return;
    try {
      if (sessionStorage.getItem('gc:reminder') === '1') return;
    } catch {}
    setOpen(true);
  }, [total]);

  function close() {
    try {
      sessionStorage.setItem('gc:reminder', '1');
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  const items: { href: string; label: string; desc: string }[] = [];
  if (semMargem > 0)
    items.push({
      href: '/estoque',
      label: `${semMargem} carro(s) sem margem definida`,
      desc: 'O vendedor não vê desconto até você definir.',
    });
  if (semCusto > 0)
    items.push({
      href: '/estoque',
      label: `${semCusto} carro(s) sem custo cadastrado`,
      desc: 'Sem o custo, o lucro do relatório não conta essas vendas.',
    });
  if (vendasSemLoja > 0)
    items.push({
      href: '/clientes',
      label: `${vendasSemLoja} venda(s) sem loja definida`,
      desc: 'Defina Ibitinga ou Borborema pra entrar no relatório.',
    });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={close}>
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-neutral-900">Tem informação faltando 👇</h2>
          <button onClick={close} aria-label="Fechar" className="text-neutral-400 hover:text-neutral-700 text-2xl leading-none">×</button>
        </div>
        <p className="text-sm text-neutral-500 mt-1">Pra os números do painel e do relatório ficarem certos:</p>

        <div className="mt-3 space-y-2">
          {items.map((it, i) => (
            <Link
              key={i}
              href={it.href}
              onClick={close}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 hover:bg-neutral-50"
            >
              <span className="grid place-items-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-bold shrink-0">!</span>
              <span>
                <span className="block font-semibold text-sm text-neutral-900">{it.label}</span>
                <span className="block text-xs text-neutral-500">{it.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <button onClick={close} className="mt-4 w-full rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold py-2.5">
          Entendi, depois preencho
        </button>
      </div>
    </div>
  );
}
