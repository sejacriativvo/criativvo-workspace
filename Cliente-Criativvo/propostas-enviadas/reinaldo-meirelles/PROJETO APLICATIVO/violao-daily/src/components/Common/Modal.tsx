import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  hideClose?: boolean
}

export default function Modal({ open, onClose, title, children, hideClose }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[480px] overflow-hidden rounded-t-[32px] bg-white p-6 shadow-glow-soft md:rounded-3xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || !hideClose) && (
              <div className="mb-4 flex items-center justify-between">
                {title ? <h3 className="font-display text-xl font-bold text-ink-900">{title}</h3> : <span />}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-600 hover:bg-ink-200"
                    aria-label="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
