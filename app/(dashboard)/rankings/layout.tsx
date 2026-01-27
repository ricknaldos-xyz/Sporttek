import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rankings | SportTech',
  description: 'Consulta los rankings de jugadores por Skill Score y posicion en el pais.',
}

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
