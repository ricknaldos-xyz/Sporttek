'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { logger } from '@/lib/logger'
import { Bell, Loader2, Check, Swords, Trophy, Video } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch {
      logger.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        toast.success('Todas marcadas como leidas')
        fetchNotifications()
      }
    } catch {
      toast.error('Error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <GlassButton variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar todas
          </GlassButton>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-semibold mb-2">Sin notificaciones</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Aqui veras avisos de desafios, resultados de partidos, analisis completados y mas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <GlassButton variant="outline" size="sm" asChild>
                <Link href="/matchmaking">
                  <Swords className="mr-2 h-4 w-4" />
                  Buscar oponentes
                </Link>
              </GlassButton>
              <GlassButton variant="outline" size="sm" asChild>
                <Link href="/analyze">
                  <Video className="mr-2 h-4 w-4" />
                  Analizar tecnica
                </Link>
              </GlassButton>
              <GlassButton variant="outline" size="sm" asChild>
                <Link href="/tournaments">
                  <Trophy className="mr-2 h-4 w-4" />
                  Ver torneos
                </Link>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <GlassCard
              key={notif.id}
              intensity={notif.read ? 'ultralight' : 'light'}
              padding="md"
            >
              <div className="flex items-start gap-3">
                {!notif.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${notif.read ? 'text-muted-foreground' : ''}`}>
                    {notif.title}
                  </p>
                  {notif.body && (
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.createdAt).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
