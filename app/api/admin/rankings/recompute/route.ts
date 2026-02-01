import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { updatePlayerProfileBestScores } from '@/lib/rankings'
import type { SkillTier } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })

    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const sports = await prisma.sport.findMany({
      where: { isActive: true },
      select: { id: true, slug: true },
    })

    let totalRecomputed = 0
    let totalCountries = 0

    for (const sport of sports) {
      // Get all ranked sport profiles for this sport
      const profiles = await prisma.sportProfile.findMany({
        where: {
          sportId: sport.id,
          effectiveScore: { not: null },
          skillTier: { not: 'UNRANKED' },
          profile: { visibility: { not: 'PRIVATE' } },
        },
        orderBy: { effectiveScore: 'desc' },
        select: {
          id: true,
          profileId: true,
          effectiveScore: true,
          profile: { select: { country: true } },
        },
      })

      totalRecomputed += profiles.length

      // --- GLOBAL Rankings ---
      const existingGlobalRankings = await prisma.ranking.findMany({
        where: {
          profileId: { in: profiles.map(p => p.profileId) },
          sportId: sport.id,
          category: 'GLOBAL',
          period: 'ALL_TIME',
        },
        select: { profileId: true, rank: true },
      })
      const globalRankMap = new Map(existingGlobalRankings.map(r => [r.profileId, r.rank]))

      const globalOperations = profiles.flatMap((profile, i) => {
        const newRank = i + 1
        const previousRank = globalRankMap.get(profile.profileId) ?? null

        return [
          prisma.ranking.upsert({
            where: {
              profileId_category_period_country_skillTier_ageGroup_periodStart: {
                profileId: profile.profileId,
                category: 'GLOBAL',
                period: 'ALL_TIME',
                country: null as unknown as string,
                skillTier: null as unknown as SkillTier,
                ageGroup: null as unknown as string,
                periodStart,
              },
            },
            create: {
              profileId: profile.profileId,
              sportId: sport.id,
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
          prisma.sportProfile.update({
            where: { id: profile.id },
            data: { globalRank: newRank },
          }),
        ]
      })

      await prisma.$transaction(globalOperations)

      // --- COUNTRY Rankings ---
      const countryGroups: Record<string, typeof profiles> = {}
      for (const profile of profiles) {
        const country = profile.profile.country ?? 'UNKNOWN'
        if (!countryGroups[country]) countryGroups[country] = []
        countryGroups[country].push(profile)
      }

      const countries = Object.keys(countryGroups)
      totalCountries += countries.length

      const existingCountryRankings = await prisma.ranking.findMany({
        where: {
          profileId: { in: profiles.map(p => p.profileId) },
          sportId: sport.id,
          category: 'COUNTRY',
          period: 'ALL_TIME',
        },
        select: { profileId: true, rank: true },
      })
      const countryRankMap = new Map(existingCountryRankings.map(r => [r.profileId, r.rank]))

      const countryOperations = countries.flatMap(country => {
        const countryProfiles = countryGroups[country]
        return countryProfiles.flatMap((profile, i) => {
          const countryRank = i + 1
          const previousCountryRank = countryRankMap.get(profile.profileId) ?? null

          return [
            prisma.ranking.upsert({
              where: {
                profileId_category_period_country_skillTier_ageGroup_periodStart: {
                  profileId: profile.profileId,
                  category: 'COUNTRY',
                  period: 'ALL_TIME',
                  country,
                  skillTier: null as unknown as SkillTier,
                  ageGroup: null as unknown as string,
                  periodStart,
                },
              },
              create: {
                profileId: profile.profileId,
                sportId: sport.id,
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
            prisma.sportProfile.update({
              where: { id: profile.id },
              data: { countryRank },
            }),
          ]
        })
      })

      await prisma.$transaction(countryOperations)
    }

    // Sync PlayerProfile with best sport scores
    await updatePlayerProfileBestScores()

    logger.info('Rankings recomputed', {
      adminId: session.user.id,
      recomputed: totalRecomputed,
      sports: sports.length,
      countries: totalCountries,
    })

    return NextResponse.json({
      recomputed: totalRecomputed,
      sports: sports.length,
      countries: totalCountries,
    })
  } catch (error) {
    logger.error('Error recomputing rankings:', error)
    return NextResponse.json(
      { error: 'Error al recomputar rankings' },
      { status: 500 }
    )
  }
}
