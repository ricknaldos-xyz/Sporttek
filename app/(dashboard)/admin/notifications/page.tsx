'use client'

import { useState, useEffect, useCallback } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import {
  Bell, Send, Loader2, Megaphone, ChevronLeft, ChevronRight,
} from 'lucide-react'

interface Announcement {
  title: string
  body: string | null
  createdAt: string
  recipientCount: number
}

interface HistoryResponse {
  announcements: Announcement[]
  total: number
  page: number
  totalPages: number
}

const SEGMENT_OPTIONS = [
  { value: 'all', label: 'Todos los usuarios' },
  { value: 'free', label: 'Usuarios Free' },
  { value: 'pro', label: 'Usuarios Pro' },
  { value: 'elite', label: 'Usuarios Elite' },
  { value: 'coaches', label: 'Coaches' },
  { value: 'players', label: 'Jugadores' },
] as const

const SEGMENT_LABELS: Record<string, string> = {
  all: 'Todos',
  free: 'Free',
  pro: 'Pro',
  elite: 'Elite',
  coaches: 'Coaches',
  players: 'Jugadores',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [segment, setSegment] = useState<string>('all')
  const [sending, setSending] = useState(false)

  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchHistory = useCallback(async (currentPage: number) => {
    setHistoryLoading(true)
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: '10' })
      const res = await fetch(`/api/admin/notifications/history?${params}`)
      if (res.ok) {
        const data: HistoryResponse = await res.json()
        setHistory(data)
      } else {
        toast.error('Error al cargar historial')
      }
    } catch (error) {
      logger.error('Error fetching notification history:', error)
      toast.error('Error de conexion')
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory(page)
  }, [page, fetchHistory])

  const handleSend = async () => {
    if (!title.trim()) {
      toast.error('El titulo es requerido')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim() || undefined,
          segment,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Notificacion enviada a ${data.sent} usuario${data.sent !== 1 ? 's' : ''}`)
        setTitle('')
        setBody('')
        setSegment('all')
        setPage(1)
        fetchHistory(1)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al enviar notificacion')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-7 w-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Notificaciones</h1>
      </div>

      {/* Send Broadcast */}
      <GlassCard intensity="light" padding="lg">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Enviar Broadcast</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="broadcast-title" className="text-sm font-medium">
                Titulo <span className="text-red-500">*</span>
              </label>
              <input
                id="broadcast-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titulo de la notificacion..."
                maxLength={200}
                className="glass-input w-full"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <label htmlFor="broadcast-body" className="text-sm font-medium">
                Mensaje (opcional)
              </label>
              <textarea
                id="broadcast-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Cuerpo del mensaje..."
                maxLength={1000}
                rows={3}
                className="glass-input w-full resize-none"
              />
            </div>

            {/* Segment */}
            <div className="space-y-1.5">
              <label htmlFor="broadcast-segment" className="text-sm font-medium">
                Segmento
              </label>
              <select
                id="broadcast-segment"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="glass-input w-full md:w-64"
              >
                {SEGMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Send button */}
            <div className="flex justify-end pt-2">
              <GlassButton
                variant="solid"
                disabled={sending || !title.trim()}
                onClick={handleSend}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar Notificacion
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* History */}
      <GlassCard intensity="light" padding="lg">
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Historial de Broadcasts</h2>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !history || history.announcements.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">Sin broadcasts enviados</h3>
              <p className="text-muted-foreground text-sm">
                Los broadcasts que envies apareceran aqui.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-glass">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Titulo
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Mensaje
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Fecha
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Destinatarios
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.announcements.map((announcement, i) => (
                        <tr
                          key={`${announcement.title}-${announcement.createdAt}-${i}`}
                          className="border-b border-glass/50 last:border-0"
                        >
                          <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                            {announcement.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground max-w-[300px] truncate">
                            {announcement.body || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(announcement.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <GlassBadge variant="primary" size="sm">
                              {announcement.recipientCount} usuario{announcement.recipientCount !== 1 ? 's' : ''}
                            </GlassBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {history.announcements.map((announcement, i) => (
                  <GlassCard
                    key={`${announcement.title}-${announcement.createdAt}-${i}`}
                    intensity="light"
                    padding="md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm truncate flex-1">
                          {announcement.title}
                        </h3>
                        <GlassBadge variant="primary" size="sm">
                          {announcement.recipientCount}
                        </GlassBadge>
                      </div>
                      {announcement.body && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {announcement.body}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Pagination */}
              {history.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    {history.total} broadcast{history.total !== 1 ? 's' : ''} en total
                  </p>
                  <div className="flex items-center gap-2">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </GlassButton>
                    <span className="text-sm font-medium px-2">
                      {history.page} / {history.totalPages}
                    </span>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      disabled={page >= history.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
