import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partidos | SportTek',
  description: 'Revisa tu historial de partidos, resultados y estadisticas de juego.',
}

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
