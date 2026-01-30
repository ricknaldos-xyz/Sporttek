import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { SkillTier } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })

    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // --- GLOBAL Rankings (ALL_TIME) ---
    const profiles = await prisma.playerProfile.findMany({
      where: { effectiveScore: { not: null } },
      orderBy: { effectiveScore: 'desc' },
      select: {
        id: true,
        effectiveScore: true,
        country: true,
      },
    })

    let recomputed = 0

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i]
      const newRank = i + 1

      // Find existing ranking to preserve previousRank
      const existing = await prisma.ranking.findFirst({
        where: {
          profileId: profile.id,
          category: 'GLOBAL',
          period: 'ALL_TIME',
        },
        select: { rank: true },
      })

      const previousRank = existing?.rank ?? null

      await prisma.ranking.upsert({
        where: {
          profileId_category_period_country_skillTier_ageGroup_periodStart: {
            profileId: profile.id,
            category: 'GLOBAL',
            period: 'ALL_TIME',
            country: null as unknown as string,
            skillTier: null as unknown as SkillTier,
            ageGroup: null as unknown as string,
            periodStart,
          },
        },
        create: {
          profileId: profile.id,
          category: 'GLOBAL',
          period: 'ALL_TIME',
          rank: newRank,
          previousRank,
          effectiveScore: profile.effectiveScore!,
          periodStart,
          computedAt: now,
        },
        update: {
          rank: newRank,
          previousRank,
          effectiveScore: profile.effectiveScore!,
          computedAt: now,
        },
      })

      // Update globalRank on the player profile
      await prisma.playerProfile.update({
        where: { id: profile.id },
        data: { globalRank: newRank },
      })

      recomputed++
    }

    // --- COUNTRY Rankings ---
    const countryGroups: Record<string, typeof profiles> = {}
    for (const profile of profiles) {
      const country = profile.country ?? 'UNKNOWN'
      if (!countryGroups[country]) countryGroups[country] = []
      countryGroups[country].push(profile)
    }

    const countries = Object.keys(countryGroups)

    for (const country of countries) {
      const countryProfiles = countryGroups[country]
      // Already sorted by effectiveScore desc from the initial query

      for (let i = 0; i < countryProfiles.length; i++) {
        const profile = countryProfiles[i]
        const countryRank = i + 1

        const existingCountry = await prisma.ranking.findFirst({
          where: {
            profileId: profile.id,
            category: 'COUNTRY',
            period: 'ALL_TIME',
            country,
          },
          select: { rank: true },
        })

        const previousCountryRank = existingCountry?.rank ?? null

        await prisma.ranking.upsert({
          where: {
            profileId_category_period_country_skillTier_ageGroup_periodStart: {
              profileId: profile.id,
              category: 'COUNTRY',
              period: 'ALL_TIME',
              country,
              skillTier: null as unknown as SkillTier,
              ageGroup: null as unknown as string,
              periodStart,
            },
          },
          create: {
            profileId: profile.id,
            category: 'COUNTRY',
            period: 'ALL_TIME',
            country,
            rank: countryRank,
            previousRank: previousCountryRank,
            effectiveScore: profile.effectiveScore!,
            periodStart,
            computedAt: now,
          },
          update: {
            rank: countryRank,
            previousRank: previousCountryRank,
            effectiveScore: profile.effectiveScore!,
            computedAt: now,
          },
        })

        // Update countryRank on the player profile
        await prisma.playerProfile.update({
          where: { id: profile.id },
          data: { countryRank },
        })
      }
    }

    logger.info('Rankings recomputed', {
      adminId: session.user.id,
      recomputed,
      countries: countries.length,
    })

    return NextResponse.json({
      recomputed,
      countries: countries.length,
    })
  } catch (error) {
    logger.error('Error recomputing rankings:', error)
    return NextResponse.json(
      { error: 'Error al recomputar rankings' },
      { status: 500 }
    )
  }
}
