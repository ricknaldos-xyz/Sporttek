import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificar Email | SportTek',
  description: 'Verifica tu direccion de correo electronico para activar tu cuenta de SportTek.',
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
