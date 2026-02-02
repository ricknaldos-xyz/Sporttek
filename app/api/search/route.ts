import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const q = request.nextUrl.searchParams.get('q')?.trim()
    if (!q || q.length < 2) {
      return NextResponse.json({ results: { jugadores: [], torneos: [], clubes: [], canchas: [] } })
    }

    const [players, tournaments, clubs, courts] = await Promise.all([
      prisma.playerProfile.findMany({
        where: {
          OR: [
            { displayName: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
          ],
          visibility: 'PUBLIC',
        },
        select: { id: true, displayName: true, city: true, avatarUrl: true, skillTier: true },
        take: 5,
      }),
      prisma.tournament.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
        },
        select: { id: true, name: true, slug: true, city: true, status: true },
        take: 5,
      }),
      prisma.club.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
          ],
          isPublic: true,
        },
        select: { id: true, name: true, slug: true, city: true, imageUrl: true },
        take: 5,
      }),
      prisma.court.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { district: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
          ],
          isActive: true,
        },
        select: { id: true, name: true, district: true, city: true, surface: true },
        take: 5,
      }),
    ])

    const results = {
      jugadores: players.map((p) => ({
        id: p.id,
        name: p.displayName || 'Jugador',
        subtitle: [p.city, p.skillTier !== 'UNRANKED' ? p.skillTier : null].filter(Boolean).join(' · '),
        href: `/community/player/${p.id}`,
        imageUrl: p.avatarUrl,
      })),
      torneos: tournaments.map((t) => ({
        id: t.id,
        name: t.name,
        subtitle: [t.city, t.status].filter(Boolean).join(' · '),
        href: `/tournaments/${t.slug}`,
      })),
      clubes: clubs.map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: c.city,
        href: `/community/clubs/${c.slug}`,
        imageUrl: c.imageUrl,
      })),
      canchas: courts.map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: [c.district, c.city].filter(Boolean).join(', '),
        href: `/courts/${c.id}`,
      })),
    }

    return NextResponse.json({ results })
  } catch (error) {
    logger.error('Search error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
