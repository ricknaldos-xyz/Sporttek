import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Contrasena | SportTech',
  description: 'Recupera el acceso a tu cuenta de SportTech restableciendo tu contrasena.',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
