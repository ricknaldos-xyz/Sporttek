import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: {
      create: vi.fn().mockResolvedValue({ id: 'notif-1' }),
    },
  },
}))

// Mock push
vi.mock('@/lib/push', () => ({
  sendPushToUser: vi.fn().mockResolvedValue(undefined),
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}))

import { createNotification } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'
import { sendPushToUser } from '@/lib/push'

describe('createNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a notification in the database', async () => {
    await createNotification({
      userId: 'user-1',
      type: 'NEW_FOLLOWER',
      title: 'Nuevo seguidor',
      body: 'Alguien te sigue',
    })

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        type: 'NEW_FOLLOWER',
        title: 'Nuevo seguidor',
        body: 'Alguien te sigue',
        referenceId: undefined,
        referenceType: undefined,
      },
    })
  })

  it('sends a push notification', async () => {
    await createNotification({
      userId: 'user-1',
      type: 'BADGE_EARNED',
      title: 'Badge ganado',
    })

    expect(sendPushToUser).toHaveBeenCalledWith('user-1', {
      title: 'Badge ganado',
      body: undefined,
      url: '/badges',
      tag: 'BADGE_EARNED',
    })
  })

  it('maps notification type to correct URL', async () => {
    await createNotification({
      userId: 'user-1',
      type: 'MATCH_CONFIRMED',
      title: 'Partido confirmado',
    })

    expect(sendPushToUser).toHaveBeenCalledWith('user-1', expect.objectContaining({
      url: '/matches',
    }))
  })

  it('falls back to /notifications for unknown URL mapping', async () => {
    await createNotification({
      userId: 'user-1',
      type: 'SYSTEM_ANNOUNCEMENT',
      title: 'Anuncio',
    })

    expect(sendPushToUser).toHaveBeenCalledWith('user-1', expect.objectContaining({
      url: '/notifications',
    }))
  })

  it('does not throw if push notification fails', async () => {
    const { sendPushToUser: mockPush } = await import('@/lib/push')
    vi.mocked(mockPush).mockRejectedValueOnce(new Error('Push failed'))

    await expect(
      createNotification({
        userId: 'user-1',
        type: 'NEW_FOLLOWER',
        title: 'Test',
      })
    ).resolves.not.toThrow()
  })
})
