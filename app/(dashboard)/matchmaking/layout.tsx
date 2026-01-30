import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar Rival | SportTek',
  description: 'Encuentra rivales de tu nivel para jugar partidos de tenis cerca de ti.',
}

export default function MatchmakingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
