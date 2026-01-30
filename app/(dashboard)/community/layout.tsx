import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comunidad | SportTek',
  description: 'Conecta con otros jugadores, unete a clubes y participa en la comunidad deportiva.',
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
