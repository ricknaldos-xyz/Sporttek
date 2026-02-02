import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  deleteAccountLimiter: {
    check: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}))

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn() },
}))

import { DELETE } from '@/app/api/user/delete/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

function makeRequest(body: object) {
  return new NextRequest('http://localhost:3000/api/user/delete', {
    method: 'DELETE',
    body: JSON.stringify(body),
  })
}

describe('DELETE /api/user/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    const res = await DELETE(makeRequest({ password: 'test' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when password is missing', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    const res = await DELETE(makeRequest({ password: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when password is incorrect', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ password: 'hashed' } as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const res = await DELETE(makeRequest({ password: 'wrong' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('incorrecta')
  })

  it('deletes user when password is correct', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ password: 'hashed' } as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(prisma.user.delete).mockResolvedValue({} as never)

    const res = await DELETE(makeRequest({ password: 'correct' }))
    expect(res.status).toBe(200)
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } })
  })

  it('returns 429 when rate limited', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as never)
    const { deleteAccountLimiter } = await import('@/lib/rate-limit')
    vi.mocked(deleteAccountLimiter.check).mockResolvedValueOnce({ success: false, remaining: 0 })

    const res = await DELETE(makeRequest({ password: 'test' }))
    expect(res.status).toBe(429)
  })
})
