import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notificaciones | SportTek',
  description: 'Revisa tus notificaciones de desafios, partidos, torneos y actividad social.',
}

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
