import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { BookingStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const skip = (page - 1) * limit

    const status = searchParams.get('status') as BookingStatus | null
    const courtId = searchParams.get('courtId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: Record<string, unknown> = {}

    if (status && Object.values(BookingStatus).includes(status)) {
      where.status = status
    }

    if (courtId) {
      where.courtId = courtId
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        (where.date as Record<string, unknown>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        (where.date as Record<string, unknown>).lte = new Date(dateTo)
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.courtBooking.findMany({
        where,
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        skip,
        take: limit,
        include: {
          court: {
            select: { name: true, district: true, city: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.courtBooking.count({ where }),
    ])

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    logger.error('Admin list bookings error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
