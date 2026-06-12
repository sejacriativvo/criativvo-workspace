'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { login } from '@/app/auth/actions';
import { Wordmark } from '@/components/ui/wordmark';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-gilsoncar.png"
            alt="GilsonCar"
            width={150}
            height={60}
            className="h-16 w-auto object-contain"
            priority
          />
          <p className="mt-4 text-neutral-400 text-sm">Sistema de vendas e estoque</p>
        </div>

        <form action={formAction} className="bg-neutral-900 rounded-2xl p-6 shadow-xl border border-neutral-800">
          <label className="block text-xs font-medium text-neutral-400 mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-white outline-none focus:border-neutral-500 mb-4"
            placeholder="voce@gilsoncar.com.br"
          />

          <label className="block text-xs font-medium text-neutral-400 mb-1">Senha</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-white outline-none focus:border-neutral-500"
            placeholder="••••••••"
          />

          {state?.error && (
            <p className="mt-3 text-sm text-rose-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 w-full rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-60 text-neutral-900 font-semibold py-2.5 transition"
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-600">GilsonCar Veículos · acesso restrito ao time</p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <span>um sistema</span>
            <Wordmark className="text-sm text-[#FF5501]" />
          </div>
        </div>
      </div>
    </main>
  );
}
