import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generar Plan de Entrenamiento | SportTech',
  description: 'Genera un plan de entrenamiento personalizado basado en tu analisis de tecnica.',
}

export default function TrainingGenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
