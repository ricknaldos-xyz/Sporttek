import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear Cuenta | SportTek',
  description: 'Registrate en SportTek y comienza a mejorar tu tecnica deportiva con analisis de IA.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
