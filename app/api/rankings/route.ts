import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SkillTier } from '@prisma/client'

// GET - Public rankings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || 'PE'
    const skillTier = searchParams.get('skillTier') as SkillTier | null
    const ageGroup = searchParams.get('ageGroup')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const skip = (page - 1) * limit

    const where = {
      effectiveScore: { not: null },
      skillTier: skillTier ? { equals: skillTier } : { not: 'UNRANKED' as SkillTier },
      visibility: { not: 'PRIVATE' as const },
      country,
      ...(ageGroup ? { ageGroup } : {}),
    }

    const [players, total] = await Promise.all([
      prisma.playerProfile.findMany({
        where,
        orderBy: { effectiveScore: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          displayName: true,
          avatarUrl: true,
          region: true,
          city: true,
          skillTier: true,
          compositeScore: true,
          effectiveScore: true,
          countryRank: true,
          matchesPlayed: true,
          matchesWon: true,
          ageGroup: true,
          showRealName: true,
          showLocation: true,
          user: {
            select: { name: true, image: true },
          },
        },
      }),
      prisma.playerProfile.count({ where }),
    ])

    const rankings = players.map((p, index) => ({
      rank: skip + index + 1,
      userId: p.userId,
      displayName: p.showRealName ? (p.displayName || p.user.name) : (p.displayName?.charAt(0) + '***'),
      avatarUrl: p.avatarUrl ?? p.user.image,
      region: p.showLocation ? p.region : null,
      city: p.showLocation ? p.city : null,
      skillTier: p.skillTier,
      compositeScore: p.compositeScore,
      effectiveScore: p.effectiveScore,
      countryRank: p.countryRank,
      matchesPlayed: p.matchesPlayed,
      matchesWon: p.matchesWon,
      ageGroup: p.ageGroup,
    }))

    return NextResponse.json({
      rankings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get rankings error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
