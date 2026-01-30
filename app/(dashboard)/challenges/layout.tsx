import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Desafios | SportTek',
  description: 'Envia y recibe desafios de otros jugadores para partidos competitivos.',
}

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
