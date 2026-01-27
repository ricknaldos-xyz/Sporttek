import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTournamentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  format: z.enum(['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN']).optional().default('SINGLE_ELIMINATION'),
  maxPlayers: z.number().int().min(4).max(64).optional().default(16),
  minTier: z.string().optional(),
  maxTier: z.string().optional(),
  ageGroup: z.string().optional(),
  registrationEnd: z.string(),
  startDate: z.string(),
  venue: z.string().optional(),
  city: z.string().optional(),
  clubId: z.string().optional(),
})

// POST - Create tournament
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createTournamentSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, country: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    const slug = validated.data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) + '-' + Date.now().toString(36)

    const tournament = await prisma.tournament.create({
      data: {
        ...validated.data,
        slug,
        organizerId: profile.id,
        country: profile.country,
        registrationEnd: new Date(validated.data.registrationEnd),
        startDate: new Date(validated.data.startDate),
        minTier: validated.data.minTier as 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO' | 'DIAMANTE' | undefined,
        maxTier: validated.data.maxTier as 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO' | 'DIAMANTE' | undefined,
      },
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Create tournament error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// GET - List tournaments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const country = searchParams.get('country') || 'PE'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { country }
    if (status) where.status = status

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
        include: {
          organizer: {
            select: { displayName: true, avatarUrl: true },
          },
          _count: { select: { participants: true } },
        },
      }),
      prisma.tournament.count({ where }),
    ])

    return NextResponse.json({
      tournaments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('List tournaments error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
