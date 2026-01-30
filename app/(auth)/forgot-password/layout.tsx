import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Contrasena | SportTek',
  description: 'Recupera el acceso a tu cuenta de SportTek restableciendo tu contrasena.',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
