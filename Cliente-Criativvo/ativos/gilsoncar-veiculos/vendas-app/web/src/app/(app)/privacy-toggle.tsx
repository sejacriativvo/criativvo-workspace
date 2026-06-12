'use client';

import { useEffect, useState } from 'react';

// Olhinho no cabeçalho: liga/desliga o "modo privacidade" (borra dados pessoais
// de cliente). Útil pra mostrar o painel pra terceiros. Fica salvo no navegador.
export function PrivacyToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gc:privacy') === '1';
    setOn(saved);
    document.documentElement.classList.toggle('privacy', saved);
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle('privacy', next);
    try {
      localStorage.setItem('gc:privacy', next ? '1' : '0');
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      title={on ? 'Modo privacidade ligado — mostrar dados' : 'Esconder dados sensíveis (pra mostrar pra outras pessoas)'}
      aria-label="Modo privacidade"
      className={`grid place-items-center h-9 w-9 rounded-full transition ${
        on ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      {on ? (
        // olho cortado (escondendo)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <path d="M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a9.3 9.3 0 0 0 5.4-1.6" />
          <path d="M2 2l20 20" />
        </svg>
      ) : (
        // olho aberto (mostrando)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}
