import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET - Players ranked near the current user (±5 positions)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sportSlug = searchParams.get('sport') || 'tennis'
    const range = Math.min(parseInt(searchParams.get('range') || '5'), 10)

    const sport = await prisma.sport.findUnique({
      where: { slug: sportSlug },
      select: { id: true },
    })

    if (!sport) {
      return NextResponse.json({ error: 'Deporte no encontrado' }, { status: 404 })
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, country: true },
    })

    if (!profile) {
      return NextResponse.json({ neighbors: [], myRank: null })
    }

    const sportProfile = await prisma.sportProfile.findUnique({
      where: {
        profileId_sportId: {
          profileId: profile.id,
          sportId: sport.id,
        },
      },
      select: { countryRank: true, effectiveScore: true },
    })

    if (!sportProfile?.countryRank) {
      return NextResponse.json({ neighbors: [], myRank: null })
    }

    const myRank = sportProfile.countryRank
    const minRank = Math.max(1, myRank - range)
    const maxRank = myRank + range

    // Get sport profiles in the rank range
    const neighborProfiles = await prisma.sportProfile.findMany({
      where: {
        sportId: sport.id,
        countryRank: { gte: minRank, lte: maxRank },
        effectiveScore: { not: null },
        profile: {
          country: profile.country,
          visibility: { not: 'PRIVATE' },
        },
      },
      orderBy: { countryRank: 'asc' },
      select: {
        countryRank: true,
        effectiveScore: true,
        skillTier: true,
        profile: {
          select: {
            userId: true,
            displayName: true,
            avatarUrl: true,
            city: true,
            showRealName: true,
            showLocation: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
    })

    const neighbors = neighborProfiles.map((sp) => ({
      rank: sp.countryRank,
      userId: sp.profile.userId,
      displayName: sp.profile.showRealName
        ? (sp.profile.displayName || sp.profile.user.name)
        : (sp.profile.displayName?.charAt(0) + '***'),
      avatarUrl: sp.profile.avatarUrl ?? sp.profile.user.image,
      city: sp.profile.showLocation ? sp.profile.city : null,
      skillTier: sp.skillTier,
      effectiveScore: sp.effectiveScore,
      isMe: sp.profile.userId === session.user.id,
    }))

    return NextResponse.json({ neighbors, myRank })
  } catch (error) {
    logger.error('Get ranking neighbors error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
