'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let fallbackInterval: ReturnType<typeof setInterval> | null = null

    async function fetchCount() {
      try {
        const res = await fetch('/api/notifications?unreadOnly=true&limit=1', {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.unreadCount ?? 0)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    function startSSE() {
      try {
        const es = new EventSource('/api/notifications/stream')
        eventSourceRef.current = es

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setUnreadCount(data.unreadCount ?? 0)
          } catch {
            // ignore parse errors
          }
        }

        es.onerror = () => {
          es.close()
          eventSourceRef.current = null
          // Fall back to polling
          fetchCount()
          fallbackInterval = setInterval(fetchCount, 30000)
        }
      } catch {
        // EventSource not supported — fall back to polling
        fetchCount()
        fallbackInterval = setInterval(fetchCount, 30000)
      }
    }

    startSSE()

    return () => {
      controller.abort()
      eventSourceRef.current?.close()
      if (fallbackInterval) clearInterval(fallbackInterval)
    }
  }, [])

  const ariaLabel = unreadCount > 0
    ? `${unreadCount} notificaciones sin leer`
    : 'Notificaciones'

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl hover:bg-white/10 transition-colors"
      aria-label={ariaLabel}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1" aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
