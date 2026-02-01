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

    // Fetch all existing global rankings in a single query
    const existingGlobalRankings = await prisma.ranking.findMany({
      where: {
        profileId: { in: profiles.map(p => p.id) },
        category: 'GLOBAL',
        period: 'ALL_TIME',
      },
      select: { profileId: true, rank: true },
    })

    const globalRankMap = new Map(
      existingGlobalRankings.map(r => [r.profileId, r.rank])
    )

    // Batch all global ranking upserts and profile updates into a single transaction
    const globalOperations = profiles.flatMap((profile, i) => {
      const newRank = i + 1
      const previousRank = globalRankMap.get(profile.id) ?? null

      return [
        prisma.ranking.upsert({
          where: {
            profileId_category_period_country_skillTier_ageGroup_periodStart: {
              profileId: profile.id,
              category: 'GLOBAL',
              period: 'ALL_TIME',
              // Prisma compound unique requires all fields; these are genuinely null for GLOBAL rankings
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
        }),
        prisma.playerProfile.update({
          where: { id: profile.id },
          data: { globalRank: newRank },
        }),
      ]
    })

    await prisma.$transaction(globalOperations)

    const recomputed = profiles.length

    // --- COUNTRY Rankings ---
    const countryGroups: Record<string, typeof profiles> = {}
    for (const profile of profiles) {
      const country = profile.country ?? 'UNKNOWN'
      if (!countryGroups[country]) countryGroups[country] = []
      countryGroups[country].push(profile)
    }

    const countries = Object.keys(countryGroups)

    // Fetch all existing country rankings in a single query
    const existingCountryRankings = await prisma.ranking.findMany({
      where: {
        profileId: { in: profiles.map(p => p.id) },
        category: 'COUNTRY',
        period: 'ALL_TIME',
      },
      select: { profileId: true, rank: true },
    })

    const countryRankMap = new Map(
      existingCountryRankings.map(r => [r.profileId, r.rank])
    )

    // Batch all country ranking upserts and profile updates into a single transaction
    const countryOperations = countries.flatMap(country => {
      const countryProfiles = countryGroups[country]
      // Already sorted by effectiveScore desc from the initial query

      return countryProfiles.flatMap((profile, i) => {
        const countryRank = i + 1
        const previousCountryRank = countryRankMap.get(profile.id) ?? null

        return [
          prisma.ranking.upsert({
            where: {
              profileId_category_period_country_skillTier_ageGroup_periodStart: {
                profileId: profile.id,
                category: 'COUNTRY',
                period: 'ALL_TIME',
                country,
                // Prisma compound unique requires all fields; these are genuinely null for COUNTRY rankings
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
          }),
          prisma.playerProfile.update({
            where: { id: profile.id },
            data: { countryRank },
          }),
        ]
      })
    })

    await prisma.$transaction(countryOperations)

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
