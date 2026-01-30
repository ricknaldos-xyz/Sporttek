import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cambiar Contrasena | SportTek',
  description: 'Actualiza tu contrasena de acceso a SportTek.',
}

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
