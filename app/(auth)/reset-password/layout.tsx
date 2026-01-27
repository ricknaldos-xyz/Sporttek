import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restablecer Contrasena | SportTech',
  description: 'Establece una nueva contrasena para tu cuenta de SportTech.',
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
