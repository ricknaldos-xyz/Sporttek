import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuevo Analisis | SportTek',
  description: 'Sube un video para analizar tu tecnica deportiva con inteligencia artificial.',
}

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
