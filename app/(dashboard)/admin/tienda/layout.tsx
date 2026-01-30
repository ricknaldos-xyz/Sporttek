import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Tienda | SportTek',
  description: 'Administracion de la tienda: productos, pedidos e inventario.',
}

export default function AdminTiendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
