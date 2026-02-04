import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticacion | SportTek',
  description: 'Inicia sesion o crea tu cuenta en SportTek para mejorar tu tecnica deportiva.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
