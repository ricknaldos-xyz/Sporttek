import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planes y Precios | SportTech',
  description: 'Elige el plan que mejor se adapte a tus necesidades. Planes Free, Pro y Elite.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
