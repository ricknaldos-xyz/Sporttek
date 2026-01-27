import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Current user's ranking position
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        compositeScore: true,
        effectiveScore: true,
        skillTier: true,
        globalRank: true,
        countryRank: true,
        country: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    // Count total players in same country
    const totalInCountry = await prisma.playerProfile.count({
      where: {
        country: profile.country,
        effectiveScore: { not: null },
        skillTier: { not: 'UNRANKED' },
        visibility: { not: 'PRIVATE' },
      },
    })

    // Count total players in same tier
    const totalInTier = profile.skillTier !== 'UNRANKED'
      ? await prisma.playerProfile.count({
          where: {
            skillTier: profile.skillTier,
            visibility: { not: 'PRIVATE' },
          },
        })
      : 0

    return NextResponse.json({
      compositeScore: profile.compositeScore,
      effectiveScore: profile.effectiveScore,
      skillTier: profile.skillTier,
      globalRank: profile.globalRank,
      countryRank: profile.countryRank,
      country: profile.country,
      totalInCountry,
      totalInTier,
    })
  } catch (error) {
    console.error('Get my position error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
