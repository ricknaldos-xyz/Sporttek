import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { acquireCronLock, releaseCronLock } from '@/lib/cron-lock'
import { logger } from '@/lib/logger'
import { timingSafeCompare } from '@/lib/validation'

// POST - Expire old pending court bookings
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`
    if (!authHeader || !timingSafeCompare(authHeader, expected)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locked = await acquireCronLock('expire-bookings')
    if (!locked) {
      return NextResponse.json({ message: 'Job already running' }, { status: 200 })
    }

    try {
      const result = await prisma.courtBooking.updateMany({
        where: {
          status: 'PENDING',
          expiresAt: { lt: new Date() },
        },
        data: { status: 'CANCELLED' },
      })

      return NextResponse.json({
        message: `Expired ${result.count} bookings`,
      })
    } finally {
      await releaseCronLock('expire-bookings')
    }
  } catch (error) {
    logger.error('Expire bookings cron error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
