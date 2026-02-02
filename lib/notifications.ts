import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'
import { sendPushToUser } from '@/lib/push'
import { logger } from '@/lib/logger'

// Map notification types to URLs for push notification click
const NOTIFICATION_URLS: Partial<Record<NotificationType, string>> = {
  CHALLENGE_RECEIVED: '/challenges',
  CHALLENGE_ACCEPTED: '/challenges',
  CHALLENGE_DECLINED: '/challenges',
  MATCH_RESULT_PENDING: '/matches',
  MATCH_CONFIRMED: '/matches',
  NEW_FOLLOWER: '/profile',
  COMMENT_ON_ANALYSIS: '/analyses',
  RANKING_CHANGE: '/rankings',
  BADGE_EARNED: '/badges',
  TIER_PROMOTION: '/rankings',
  COACH_INVITATION: '/marketplace',
  COACH_REQUEST_RECEIVED: '/profile',
  COACH_REQUEST_ACCEPTED: '/marketplace',
  BOOKING_REQUESTED: '/courts',
  BOOKING_CONFIRMED: '/courts',
  STRINGING_STATUS_UPDATE: '/tienda/pedidos',
  STRINGING_COMPLETED: '/tienda/pedidos',
  SYSTEM_ANNOUNCEMENT: '/notifications',
}

/**
 * Create an in-app notification for a user and send a push notification.
 */
export async function createNotification({
  userId,
  type,
  title,
  body,
  referenceId,
  referenceType,
}: {
  userId: string
  type: NotificationType
  title: string
  body?: string
  referenceId?: string
  referenceType?: string
}): Promise<void> {
  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      referenceId,
      referenceType,
    },
  })

  // Send push notification (fire-and-forget, don't block)
  sendPushToUser(userId, {
    title,
    body: body || undefined,
    url: NOTIFICATION_URLS[type] || '/notifications',
    tag: type,
  }).catch((error) => {
    logger.error('Failed to send push notification:', error)
  })
}
