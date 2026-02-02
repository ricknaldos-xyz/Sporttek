import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    playerProfile: { findUnique: vi.fn() },
    match: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    sport: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  matchLimiter: { check: vi.fn().mockResolvedValue({ success: true }) },
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}))

vi.mock('@/lib/validation', () => ({
  sanitizeZodError: vi.fn().mockReturnValue('Validation error'),
}))

import { POST, GET } from '@/app/api/matches/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makePostRequest(body: object) {
  return new NextRequest('http://localhost:3000/api/matches', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function makeGetRequest(params = '') {
  return new NextRequest(`http://localhost:3000/api/matches${params}`)
}

describe('POST /api/matches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await POST(makePostRequest({ opponentUserId: 'u2' }))
    expect(res.status).toBe(401)
  })

  it('returns 404 when profile not found', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique)
      .mockResolvedValueOnce(null as never)
      .mockResolvedValueOnce({ id: 'p2' } as never)
    vi.mocked(prisma.sport.findUnique).mockResolvedValue(null as never)

    const res = await POST(makePostRequest({ opponentUserId: 'u2' }))
    expect(res.status).toBe(404)
  })

  it('creates a match successfully', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique)
      .mockResolvedValueOnce({ id: 'p1' } as never)
      .mockResolvedValueOnce({ id: 'p2' } as never)
    vi.mocked(prisma.sport.findUnique).mockResolvedValue(null as never)
    vi.mocked(prisma.match.create).mockResolvedValue({ id: 'm1' } as never)

    const res = await POST(makePostRequest({ opponentUserId: 'u2', score: '6-4 6-3' }))
    expect(res.status).toBe(201)
    expect(prisma.match.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          player1Id: 'p1',
          player2Id: 'p2',
          score: '6-4 6-3',
        }),
      })
    )
  })
})

describe('GET /api/matches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(401)
  })

  it('returns 404 when profile not found', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique).mockResolvedValue(null as never)

    const res = await GET(makeGetRequest())
    expect(res.status).toBe(404)
  })

  it('returns matches for authenticated user', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique).mockResolvedValue({ id: 'p1' } as never)
    vi.mocked(prisma.sport.findUnique).mockResolvedValue({ id: 's1' } as never)
    vi.mocked(prisma.match.findMany).mockResolvedValue([{ id: 'm1' }] as never)

    const res = await GET(makeGetRequest())
    expect(res.status).toBe(200)
  })
})
