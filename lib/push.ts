import webpush from 'web-push'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.NEXT_PUBLIC_APP_URL || 'https://sporttek.xyz'

let vapidConfigured = false

function ensureVapidConfig() {
  if (vapidConfigured) return true
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return false
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  vapidConfigured = true
  return true
}

interface PushPayload {
  title: string
  body?: string
  icon?: string
  badge?: string
  url?: string
  tag?: string
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!ensureVapidConfig()) {
    return
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  if (subscriptions.length === 0) return

  const jsonPayload = JSON.stringify({
    title: payload.title,
    body: payload.body || '',
    icon: payload.icon || '/icon-192.png',
    badge: payload.badge || '/icon-192.png',
    data: {
      url: payload.url || '/dashboard',
    },
    tag: payload.tag,
  })

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          jsonPayload
        )
      } catch (error: unknown) {
        // If subscription is expired or invalid, remove it
        const statusCode = (error as { statusCode?: number })?.statusCode
        if (statusCode === 410 || statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          logger.info(`Removed expired push subscription ${sub.id}`)
        } else {
          logger.error(`Push notification failed for subscription ${sub.id}:`, error)
        }
        throw error
      }
    })
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  if (failed > 0) {
    logger.warn(`Push notifications: ${succeeded} sent, ${failed} failed for user ${userId}`)
  }
}
