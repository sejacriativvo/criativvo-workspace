'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { login } from '@/app/auth/actions';
import { Wordmark } from '@/components/ui/wordmark';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden">

      {/* Fundo — foto da fachada com overlay escuro */}
      <Image
        src="/fachada.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

      {/* Ruído sutil pra dar textura premium */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Card liquid glass */}
      <div className="relative z-10 w-full max-w-sm mx-6">

        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-belloni.png"
            alt="Belloni Motors"
            width={160}
            height={64}
            className="h-16 w-auto object-contain drop-shadow-lg"
            priority
          />
          <p className="mt-3 text-white/60 text-sm tracking-wide">
            Sistema de vendas e estoque
          </p>
        </div>

        {/* Liquid glass card */}
        <form
          action={formAction}
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
          className="rounded-3xl p-7"
        >
          {/* E-mail */}
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
            E-mail
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@bellonimotors.com.br"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
            }}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/30
              focus:ring-2 focus:ring-white/25 transition mb-4"
          />

          {/* Senha */}
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
            Senha
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
            }}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/30
              focus:ring-2 focus:ring-white/25 transition"
          />

          {state?.error && (
            <p className="mt-3 text-sm text-rose-300 bg-rose-500/10 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 w-full rounded-xl bg-white hover:bg-neutral-100 active:bg-neutral-200
              disabled:opacity-50 text-neutral-900 font-bold py-3 text-sm tracking-wide
              shadow-lg transition"
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-6 text-center space-y-1.5">
          <p className="text-xs text-white/30">Belloni Motors · acesso restrito ao time</p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-white/40">
            <span>um sistema</span>
            <Wordmark className="text-sm text-white/70" />
          </div>
        </div>
      </div>
    </main>
  );
}
