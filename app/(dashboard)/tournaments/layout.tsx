import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Torneos | SportTech',
  description: 'Descubre y participa en torneos de tenis organizados en tu zona.',
}

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
