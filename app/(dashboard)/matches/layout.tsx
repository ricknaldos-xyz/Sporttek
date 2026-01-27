import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partidos | SportTech',
  description: 'Revisa tu historial de partidos, resultados y estadisticas de juego.',
}

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
