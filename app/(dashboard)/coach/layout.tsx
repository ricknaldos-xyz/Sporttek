import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coach - Panel de Entrenador | SportTech',
  description: 'Gestiona tus alumnos, planes de entrenamiento y seguimiento como entrenador.',
}

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
