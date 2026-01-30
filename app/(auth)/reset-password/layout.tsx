import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restablecer Contrasena | SportTek',
  description: 'Establece una nueva contrasena para tu cuenta de SportTek.',
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
