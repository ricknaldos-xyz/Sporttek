import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma before importing the module under test
vi.mock('@/lib/prisma', () => ({
  prisma: {
    block: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

import { isBlocked, getBlockedProfileIds } from '@/lib/blocks'
import { prisma } from '@/lib/prisma'

const mockFindFirst = vi.mocked(prisma.block.findFirst)
const mockFindMany = vi.mocked(prisma.block.findMany)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('isBlocked', () => {
  it('returns true when a block exists (A blocked B)', () => {
    mockFindFirst.mockResolvedValue({
      id: 'block-1',
      blockerId: 'profileA',
      blockedId: 'profileB',
      createdAt: new Date(),
    } as never)

    return expect(isBlocked('profileA', 'profileB')).resolves.toBe(true)
  })

  it('returns false when no block exists', () => {
    mockFindFirst.mockResolvedValue(null as never)

    return expect(isBlocked('profileA', 'profileB')).resolves.toBe(false)
  })

  it('checks bidirectional blocking (B blocked A)', () => {
    mockFindFirst.mockResolvedValue({
      id: 'block-2',
      blockerId: 'profileB',
      blockedId: 'profileA',
      createdAt: new Date(),
    } as never)

    return expect(isBlocked('profileA', 'profileB')).resolves.toBe(true)
  })

  it('passes the correct OR query for bidirectional check', async () => {
    mockFindFirst.mockResolvedValue(null as never)

    await isBlocked('p1', 'p2')

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { blockerId: 'p1', blockedId: 'p2' },
          { blockerId: 'p2', blockedId: 'p1' },
        ],
      },
    })
  })
})

describe('getBlockedProfileIds', () => {
  it('returns all blocked profile IDs', async () => {
    mockFindMany.mockResolvedValue([
      { blockerId: 'me', blockedId: 'user1' },
      { blockerId: 'me', blockedId: 'user2' },
    ] as never)

    const ids = await getBlockedProfileIds('me')
    expect(ids).toContain('user1')
    expect(ids).toContain('user2')
    expect(ids).toHaveLength(2)
  })

  it('returns IDs from both directions (blocker and blocked)', async () => {
    mockFindMany.mockResolvedValue([
      { blockerId: 'me', blockedId: 'user1' },    // I blocked user1
      { blockerId: 'user2', blockedId: 'me' },    // user2 blocked me
    ] as never)

    const ids = await getBlockedProfileIds('me')
    expect(ids).toContain('user1')
    expect(ids).toContain('user2')
    expect(ids).toHaveLength(2)
  })

  it('does not include the requesting profile ID', async () => {
    mockFindMany.mockResolvedValue([
      { blockerId: 'me', blockedId: 'user1' },
      { blockerId: 'user2', blockedId: 'me' },
    ] as never)

    const ids = await getBlockedProfileIds('me')
    expect(ids).not.toContain('me')
  })

  it('returns empty array when no blocks exist', async () => {
    mockFindMany.mockResolvedValue([] as never)

    const ids = await getBlockedProfileIds('me')
    expect(ids).toEqual([])
  })

  it('deduplicates IDs when same user appears in multiple blocks', async () => {
    mockFindMany.mockResolvedValue([
      { blockerId: 'me', blockedId: 'user1' },
      { blockerId: 'user1', blockedId: 'me' },
    ] as never)

    const ids = await getBlockedProfileIds('me')
    expect(ids).toEqual(['user1'])
  })
})
