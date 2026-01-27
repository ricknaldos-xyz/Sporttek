import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

/**
 * Create an in-app notification for a user.
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
}
