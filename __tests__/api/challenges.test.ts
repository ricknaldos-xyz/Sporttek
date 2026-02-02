import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    playerProfile: { findUnique: vi.fn() },
    challenge: { create: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    sport: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  challengeLimiter: { check: vi.fn().mockResolvedValue({ success: true }) },
}))

vi.mock('@/lib/blocks', () => ({
  isBlocked: vi.fn().mockResolvedValue(false),
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}))

import { POST, GET } from '@/app/api/challenges/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isBlocked } from '@/lib/blocks'
import { NextRequest } from 'next/server'

function makePostRequest(body: object) {
  return new NextRequest('http://localhost:3000/api/challenges', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function makeGetRequest(params = '') {
  return new NextRequest(`http://localhost:3000/api/challenges${params}`)
}

describe('POST /api/challenges', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.sport.findUnique).mockResolvedValue(null as never)
    vi.mocked(prisma.challenge.findFirst).mockResolvedValue(null as never)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await POST(makePostRequest({ challengedUserId: 'u2' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when challenging yourself', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique)
      .mockResolvedValueOnce({ id: 'p1' } as never)
      .mockResolvedValueOnce({ id: 'p1' } as never)

    const res = await POST(makePostRequest({ challengedUserId: 'u1' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('ti mismo')
  })

  it('returns 403 when blocked', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique)
      .mockResolvedValueOnce({ id: 'p1' } as never)
      .mockResolvedValueOnce({ id: 'p2' } as never)
    vi.mocked(isBlocked).mockResolvedValueOnce(true)

    const res = await POST(makePostRequest({ challengedUserId: 'u2' }))
    expect(res.status).toBe(403)
  })

  it('creates a challenge successfully', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.playerProfile.findUnique)
      .mockResolvedValueOnce({ id: 'p1' } as never)
      .mockResolvedValueOnce({ id: 'p2' } as never)
    vi.mocked(prisma.challenge.create).mockResolvedValue({ id: 'c1' } as never)

    const res = await POST(makePostRequest({ challengedUserId: 'u2' }))
    expect(res.status).toBe(201)
    expect(prisma.challenge.create).toHaveBeenCalled()
  })
})

describe('GET /api/challenges', () => {
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
    vi.mocked(prisma.sport.findUnique).mockResolvedValue({ id: 's1' } as never)
    vi.mocked(prisma.playerProfile.findUnique).mockResolvedValue(null as never)

    const res = await GET(makeGetRequest())
    expect(res.status).toBe(404)
  })
})
