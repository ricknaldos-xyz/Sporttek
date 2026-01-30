import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { ChallengeStatus } from '@prisma/client'

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
    const statusFilter = searchParams.get('status') as ChallengeStatus | null

    const where = statusFilter ? { status: statusFilter } : {}

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        include: {
          challenger: {
            include: { user: { select: { name: true, email: true, image: true } } },
          },
          challenged: {
            include: { user: { select: { name: true, email: true, image: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.challenge.count({ where }),
    ])

    return NextResponse.json({
      challenges,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    logger.error('Admin challenges list error:', error)
    return NextResponse.json({ error: 'Error al listar desafios' }, { status: 500 })
  }
}
