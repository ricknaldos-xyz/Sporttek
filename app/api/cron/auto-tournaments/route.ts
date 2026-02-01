import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { acquireCronLock, releaseCronLock } from '@/lib/cron-lock'
import { logger } from '@/lib/logger'
import { timingSafeCompare } from '@/lib/validation'

// POST - Auto-create weekly tournaments for active sports
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`
    if (!authHeader || !timingSafeCompare(authHeader, expected)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locked = await acquireCronLock('auto-tournaments')
    if (!locked) {
      return NextResponse.json({ message: 'Job already running' }, { status: 200 })
    }

    try {
      const sports = await prisma.sport.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
      })

      // Find an admin's player profile to be the organizer
      const adminProfile = await prisma.playerProfile.findFirst({
        where: { user: { role: 'ADMIN' } },
        select: { id: true },
      })

      if (!adminProfile) {
        logger.warn('No admin player profile found for auto-tournament creation')
        return NextResponse.json({ message: 'No admin profile found' })
      }

      const now = new Date()
      const nextMonday = new Date(now)
      nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7))
      nextMonday.setHours(0, 0, 0, 0)

      const nextSunday = new Date(nextMonday)
      nextSunday.setDate(nextMonday.getDate() + 6)
      nextSunday.setHours(23, 59, 59, 999)

      const registrationDeadline = new Date(nextMonday)
      registrationDeadline.setDate(registrationDeadline.getDate() - 1)
      registrationDeadline.setHours(20, 0, 0, 0)

      const created: string[] = []

      for (const sport of sports) {
        // Check if a tournament already exists for this sport next week
        const existing = await prisma.tournament.findFirst({
          where: {
            sportId: sport.id,
            startDate: { gte: nextMonday, lte: nextSunday },
            name: { startsWith: 'Torneo Semanal' },
          },
        })

        if (existing) continue

        const weekLabel = nextMonday.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
        const slugDate = nextMonday.toISOString().slice(0, 10)

        const tournament = await prisma.tournament.create({
          data: {
            name: `Torneo Semanal ${sport.name} - ${weekLabel}`,
            slug: `torneo-semanal-${sport.slug}-${slugDate}`,
            description: `Torneo semanal automatico de ${sport.name}. Eliminacion directa, abierto a todos los niveles.`,
            sportId: sport.id,
            organizerId: adminProfile.id,
            format: 'SINGLE_ELIMINATION',
            maxPlayers: 16,
            country: 'PE',
            startDate: nextMonday,
            endDate: nextSunday,
            registrationEnd: registrationDeadline,
            status: 'REGISTRATION',
          },
        })

        created.push(tournament.id)
      }

      logger.info(`Auto-tournaments created: ${created.length}`)
      return NextResponse.json({
        message: `Created ${created.length} tournaments`,
        tournamentIds: created,
      })
    } finally {
      await releaseCronLock('auto-tournaments')
    }
  } catch (error) {
    logger.error('Auto-tournament cron error:', error)
    return NextResponse.json(
      { error: 'Error creating auto tournaments' },
      { status: 500 }
    )
  }
}
