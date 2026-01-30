import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Encordado | SportTek',
  description: 'Administracion del servicio de encordado: pedidos y talleres.',
}

export default function AdminEncordadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
