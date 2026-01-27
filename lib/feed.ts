import { prisma } from '@/lib/prisma'
import { FeedItemType } from '@prisma/client'

/**
 * Create a feed item for a player's activity.
 */
export async function createFeedItem({
  userId,
  type,
  title,
  description,
  referenceId,
  referenceType,
  metadata,
}: {
  userId: string
  type: FeedItemType
  title: string
  description?: string
  referenceId?: string
  referenceType?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  const profile = await prisma.playerProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!profile) return

  await prisma.feedItem.create({
    data: {
      profileId: profile.id,
      type,
      title,
      description,
      referenceId,
      referenceType,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  })
}
