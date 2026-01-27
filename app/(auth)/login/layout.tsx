import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesion | SportTech',
  description: 'Inicia sesion en tu cuenta de SportTech para acceder a tus analisis y entrenamientos.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
