import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    playerProfile: { findUnique: vi.fn() },
    technique: { findMany: vi.fn() },
    techniqueScore: { findMany: vi.fn() },
    improvementGoal: { findMany: vi.fn(), count: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  goalLimiter: { check: vi.fn().mockResolvedValue({ success: true }) },
}))

vi.mock('@/lib/subscription', () => ({
  getUserSubscription: vi.fn().mockResolvedValue('FREE'),
  checkActiveGoalsLimit: vi.fn().mockResolvedValue({ allowed: true }),
}))

vi.mock('@/lib/goals/roadmap', () => ({
  generateGoalRoadmap: vi.fn().mockResolvedValue({ milestones: [] }),
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}))

vi.mock('@/lib/validation', () => ({
  sanitizeZodError: vi.fn().mockReturnValue('Validation error'),
}))

import { POST, GET } from '@/app/api/goals/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkActiveGoalsLimit } from '@/lib/subscription'
import { NextRequest } from 'next/server'

function makePostRequest(body: object) {
  return new NextRequest('http://localhost:3000/api/goals', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

function makeGetRequest(params = '') {
  return new NextRequest(`http://localhost:3000/api/goals${params}`)
}

describe('POST /api/goals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await POST(makePostRequest({ type: 'TECHNIQUE', techniqueIds: ['t1'] }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid input', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    const res = await POST(makePostRequest({ type: 'TECHNIQUE', techniqueIds: [] }))
    expect(res.status).toBe(400)
  })

  it('returns 403 when goal limit reached', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(checkActiveGoalsLimit).mockResolvedValueOnce({ allowed: false, limit: 1, current: 1 } as never)

    const res = await POST(makePostRequest({ type: 'TECHNIQUE', techniqueIds: ['t1'] }))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toContain('límite')
  })

  it('creates a goal successfully', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.technique.findMany).mockResolvedValue([
      { id: 't1', name: 'Forehand', slug: 'forehand', sport: { name: 'Tennis', slug: 'tennis' } },
    ] as never)
    vi.mocked(prisma.playerProfile.findUnique).mockResolvedValue({ id: 'p1' } as never)
    vi.mocked(prisma.techniqueScore.findMany).mockResolvedValue([{ averageScore: 65 }] as never)
    vi.mocked(prisma.$transaction).mockResolvedValue({ id: 'g1', title: 'Mejorar Forehand' } as never)

    const res = await POST(makePostRequest({ type: 'TECHNIQUE', techniqueIds: ['t1'] }))
    expect(res.status).toBe(201)
  })
})

describe('GET /api/goals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(401)
  })

  it('returns goals for authenticated user', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.improvementGoal.findMany).mockResolvedValue([{ id: 'g1' }] as never)
    vi.mocked(prisma.improvementGoal.count).mockResolvedValue(1 as never)

    const res = await GET(makeGetRequest('?page=1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.goals).toHaveLength(1)
  })
})
