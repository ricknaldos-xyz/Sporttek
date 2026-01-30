import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { Prisma } from '@prisma/client'

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
    const filter = searchParams.get('filter') || 'all'

    let where: Prisma.MatchWhereInput = {}

    if (filter === 'disputed') {
      // Both players reported results but they conflict
      where = {
        player1Result: { not: null },
        player2Result: { not: null },
        OR: [
          // Both claim WIN
          { player1Result: 'WIN', player2Result: 'WIN' },
          // Both claim LOSS
          { player1Result: 'LOSS', player2Result: 'LOSS' },
          // Both claim NO_SHOW
          { player1Result: 'NO_SHOW', player2Result: 'NO_SHOW' },
          // One says WIN but other doesn't say LOSS (says NO_SHOW instead)
          { player1Result: 'WIN', player2Result: { not: 'LOSS' } },
          { player2Result: 'WIN', player1Result: { not: 'LOSS' } },
          // Confirmation mismatch with both results present
          {
            player1Confirmed: { not: { equals: true } },
            player2Confirmed: true,
          },
          {
            player1Confirmed: true,
            player2Confirmed: { not: { equals: true } },
          },
        ],
      }
    } else if (filter === 'unconfirmed') {
      where = {
        OR: [
          { player1Result: { not: null } },
          { player2Result: { not: null } },
        ],
        AND: [
          {
            OR: [
              { player1Confirmed: false },
              { player2Confirmed: false },
            ],
          },
        ],
      }
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          player1: {
            include: { user: { select: { name: true, email: true, image: true } } },
          },
          player2: {
            include: { user: { select: { name: true, email: true, image: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.match.count({ where }),
    ])

    return NextResponse.json({
      matches,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    logger.error('Admin matches list error:', error)
    return NextResponse.json({ error: 'Error al listar partidos' }, { status: 500 })
  }
}
