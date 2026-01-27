import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cambiar Contrasena | SportTech',
  description: 'Actualiza tu contrasena de acceso a SportTech.',
}

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
