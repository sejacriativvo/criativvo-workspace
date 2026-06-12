import type { ReactNode } from 'react'

// Container que dá a forma "tela de celular" mesmo no desktop.
export default function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell relative">{children}</div>
}
