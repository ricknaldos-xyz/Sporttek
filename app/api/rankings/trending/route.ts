import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { DEFAULT_COUNTRY } from '@/lib/constants'

// GET - Trending players (biggest rank improvements)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sportSlug = searchParams.get('sport') || 'tennis'
    const country = searchParams.get('country') || DEFAULT_COUNTRY
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20)

    // Resolve sport
    const sport = await prisma.sport.findUnique({
      where: { slug: sportSlug },
      select: { id: true },
    })

    if (!sport) {
      return NextResponse.json({ error: 'Deporte no encontrado' }, { status: 404 })
    }

    // Query rankings where previousRank exists (can compute change)
    const rankings = await prisma.ranking.findMany({
      where: {
        category: 'COUNTRY',
        period: 'ALL_TIME',
        previousRank: { not: null },
        country,
        sportId: sport.id,
      },
      select: {
        rank: true,
        previousRank: true,
        effectiveScore: true,
        profile: {
          select: {
            userId: true,
            displayName: true,
            avatarUrl: true,
            sportProfiles: {
              where: { sportId: sport.id },
              select: { skillTier: true },
              take: 1,
            },
          },
        },
      },
    })

    // Filter to players who improved and compute change
    const trending = rankings
      .filter((r) => r.previousRank! > r.rank)
      .map((r) => ({
        userId: r.profile.userId,
        displayName: r.profile.displayName,
        avatarUrl: r.profile.avatarUrl,
        skillTier: r.profile.sportProfiles[0]?.skillTier ?? 'UNRANKED',
        rank: r.rank,
        previousRank: r.previousRank!,
        change: r.previousRank! - r.rank,
        effectiveScore: r.effectiveScore,
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, limit)

    return NextResponse.json(trending)
  } catch (error) {
    logger.error('Get trending rankings error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
