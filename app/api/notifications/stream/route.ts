import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return new Response('No autorizado', { status: 401 })
  }

  const userId = session.user.id

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let lastCount = -1
      let cancelled = false

      function sendHeartbeat() {
        if (!cancelled) {
          try {
            controller.enqueue(encoder.encode(': heartbeat\n\n'))
          } catch {
            cancelled = true
          }
        }
      }

      async function poll() {
        if (cancelled) return
        try {
          const count = await prisma.notification.count({
            where: { userId, read: false },
          })
          if (count !== lastCount) {
            lastCount = count
            const data = JSON.stringify({ unreadCount: count })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        } catch (error) {
          if (!cancelled) {
            logger.error('SSE poll error:', error)
          }
        }
      }

      await poll()

      const pollInterval = setInterval(poll, 5000)
      const heartbeatInterval = setInterval(sendHeartbeat, 30000)

      const cleanup = () => {
        cancelled = true
        clearInterval(pollInterval)
        clearInterval(heartbeatInterval)
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      // Cleanup after 5 minutes to prevent long-lived connections
      const maxLifetime = setTimeout(cleanup, 5 * 60 * 1000)

      // Store cleanup for cancel
      ;(controller as unknown as { _cleanup: () => void })._cleanup = () => {
        clearTimeout(maxLifetime)
        cleanup()
      }
    },
    cancel(controller) {
      const ctrl = controller as unknown as { _cleanup?: () => void }
      ctrl._cleanup?.()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
