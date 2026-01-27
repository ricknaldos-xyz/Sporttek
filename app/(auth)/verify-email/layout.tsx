import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificar Email | SportTech',
  description: 'Verifica tu direccion de correo electronico para activar tu cuenta de SportTech.',
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
