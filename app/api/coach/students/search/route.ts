import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET /api/coach/students/search?q=term
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verify user is a coach
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!coachProfile) {
      return NextResponse.json({ error: 'No eres entrenador' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    if (!q || q.length < 2) {
      return NextResponse.json({ error: 'Busqueda muy corta' }, { status: 400 })
    }

    // Search players by name or email, exclude already-connected students
    const existingStudentIds = await prisma.coachStudent.findMany({
      where: { coachId: coachProfile.id },
      select: { studentId: true },
    })
    const excludeIds = existingStudentIds.map(s => s.studentId)

    const players = await prisma.playerProfile.findMany({
      where: {
        id: { notIn: excludeIds.length > 0 ? excludeIds : undefined },
        OR: [
          { displayName: { contains: q, mode: 'insensitive' } },
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        userId: true,
        displayName: true,
        avatarUrl: true,
        skillTier: true,
        user: { select: { name: true, email: true } },
      },
      take: 10,
    })

    return NextResponse.json(players)
  } catch (error) {
    logger.error('Search students error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
