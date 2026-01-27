import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicio de Encordado | SportTech',
  description: 'Solicita el servicio de encordado profesional para tu raqueta de tenis.',
}

export default function EncordadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
