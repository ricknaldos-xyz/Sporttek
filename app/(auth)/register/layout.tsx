import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear Cuenta | SportTech',
  description: 'Registrate en SportTech y comienza a mejorar tu tecnica deportiva con analisis de IA.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
