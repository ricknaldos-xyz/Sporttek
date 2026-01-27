import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tienda | SportTech',
  description: 'Compra equipamiento deportivo, raquetas, cuerdas y accesorios de tenis.',
}

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
