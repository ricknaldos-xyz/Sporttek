import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET - List distinct countries with ranked players for a sport
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sportSlug = searchParams.get('sport') || 'tennis'

    const sport = await prisma.sport.findUnique({
      where: { slug: sportSlug },
      select: { id: true },
    })

    if (!sport) {
      return NextResponse.json({ error: 'Deporte no encontrado' }, { status: 404 })
    }

    const sportProfiles = await prisma.sportProfile.findMany({
      where: {
        sportId: sport.id,
        effectiveScore: { not: null },
        skillTier: { not: 'UNRANKED' },
        profile: { visibility: { not: 'PRIVATE' } },
      },
      select: {
        profile: { select: { country: true } },
      },
    })

    const countMap = new Map<string, number>()
    for (const sp of sportProfiles) {
      const c = sp.profile.country
      if (c) countMap.set(c, (countMap.get(c) || 0) + 1)
    }

    const result = [...countMap.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Get ranking countries error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
