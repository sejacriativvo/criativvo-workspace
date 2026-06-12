'use client';

import { AnimatePresence, motion } from 'motion/react';

// Painel modal animado. No celular sobe de baixo (gaveta); no desktop aparece
// centralizado com fade + leve zoom. Fecha no X ou clicando no fundo.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          {/* Fundo escurecido */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Painel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-4 pb-3 pt-4">
              <span className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-neutral-300 sm:hidden" />
              <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-full text-2xl leading-none text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 pb-8 sm:pb-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
