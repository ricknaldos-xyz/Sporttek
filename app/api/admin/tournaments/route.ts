import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { TournamentStatus } from '@prisma/client'

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
    const statusFilter = searchParams.get('status') as TournamentStatus | null
    const search = searchParams.get('search')?.trim() || null

    const where: Record<string, unknown> = {}

    if (statusFilter && Object.values(TournamentStatus).includes(statusFilter)) {
      where.status = statusFilter
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        include: {
          organizer: {
            select: {
              displayName: true,
              avatarUrl: true,
              user: { select: { name: true, email: true } },
            },
          },
          _count: { select: { participants: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tournament.count({ where }),
    ])

    return NextResponse.json({
      tournaments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    logger.error('Admin tournaments list error:', error)
    return NextResponse.json({ error: 'Error al listar torneos' }, { status: 500 })
  }
}
