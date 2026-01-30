import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketplace de Coaches | SportTek',
  description: 'Encuentra entrenadores profesionales de tenis para mejorar tu juego.',
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
