import { prisma } from '@/lib/prisma'
import { SkillTier } from '@prisma/client'
import { logger } from '@/lib/logger'

const DECAY_GRACE_DAYS = 30
const DECAY_RATE_PER_DAY = 0.005
const MAX_DECAY = 0.3

/**
 * Apply score decay based on inactivity.
 * effectiveScore = compositeScore * max(0.7, 1.0 - max(0, daysInactive - 30) * 0.005)
 */
export function calculateDecay(compositeScore: number, lastScoreUpdate: Date | null): number {
  if (!lastScoreUpdate) return compositeScore

  const now = new Date()
  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastScoreUpdate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const daysOverGrace = Math.max(0, daysSinceUpdate - DECAY_GRACE_DAYS)
  const decayMultiplier = Math.max(1.0 - MAX_DECAY, 1.0 - daysOverGrace * DECAY_RATE_PER_DAY)

  return compositeScore * decayMultiplier
}

/**
 * Apply decay to all sport profiles and recompute rankings per sport.
 * Called by daily cron job.
 */
export async function computeAllRankings(): Promise<void> {
  const sports = await prisma.sport.findMany({
    where: { isActive: true },
    select: { id: true, slug: true },
  })

  for (const sport of sports) {
    await computeSportRankings(sport.id)
  }

  await updatePlayerProfileBestScores()
}

async function computeSportRankings(sportId: string): Promise<void> {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // 1. Apply decay to all SportProfiles for this sport
  const sportProfiles = await prisma.sportProfile.findMany({
    where: {
      sportId,
      compositeScore: { not: null },
      skillTier: { not: 'UNRANKED' },
    },
    select: {
      id: true,
      compositeScore: true,
      lastScoreUpdate: true,
      profile: {
        select: {
          id: true,
          country: true,
          skillTier: true,
          ageGroup: true,
          visibility: true,
        },
      },
    },
  })

  // Update effective scores with decay
  await prisma.$transaction(
    sportProfiles.map((sp) => {
      const effectiveScore = calculateDecay(sp.compositeScore!, sp.lastScoreUpdate)
      return prisma.sportProfile.update({
        where: { id: sp.id },
        data: { effectiveScore },
      })
    })
  )

  // 2. Compute country rankings
  const countries = [...new Set(sportProfiles.map((sp) => sp.profile.country).filter(Boolean))] as string[]

  for (const country of countries) {
    const countryProfiles = await prisma.sportProfile.findMany({
      where: {
        sportId,
        effectiveScore: { not: null },
        skillTier: { not: 'UNRANKED' },
        profile: {
          country,
          visibility: { not: 'PRIVATE' },
        },
      },
      orderBy: { effectiveScore: 'desc' },
      select: {
        id: true,
        profileId: true,
        effectiveScore: true,
      },
    })

    // Update country rank on each sport profile
    await prisma.$transaction(
      countryProfiles.map((cp, i) =>
        prisma.sportProfile.update({
          where: { id: cp.id },
          data: { countryRank: i + 1 },
        })
      )
    )

    // Fetch existing country rankings for previousRank tracking
    const existingCountryRankings = await prisma.ranking.findMany({
      where: {
        profileId: { in: countryProfiles.map(cp => cp.profileId) },
        sportId,
        category: 'COUNTRY',
        period: 'ALL_TIME',
      },
      select: { profileId: true, rank: true },
    })
    const countryPrevRankMap = new Map(existingCountryRankings.map(r => [r.profileId, r.rank]))

    // Upsert ranking records
    for (const [index, p] of countryProfiles.entries()) {
      const newRank = index + 1
      const previousRank = countryPrevRankMap.get(p.profileId) ?? null

      await prisma.ranking.upsert({
        where: {
          profileId_category_period_country_skillTier_ageGroup_periodStart: {
            profileId: p.profileId,
            category: 'COUNTRY',
            period: 'ALL_TIME',
            country,
            skillTier: null as unknown as SkillTier,
            ageGroup: null as unknown as string,
            periodStart,
          },
        },
        create: {
          profileId: p.profileId,
          sportId,
          category: 'COUNTRY',
          period: 'ALL_TIME',
          country,
          rank: newRank,
          previousRank,
          effectiveScore: p.effectiveScore!,
          periodStart,
          computedAt: now,
        },
        update: {
          rank: newRank,
          previousRank,
          effectiveScore: p.effectiveScore!,
          sportId,
          computedAt: now,
        },
      })
    }
  }

  // 3. Compute global rankings for this sport
  const globalProfiles = await prisma.sportProfile.findMany({
    where: {
      sportId,
      effectiveScore: { not: null },
      skillTier: { not: 'UNRANKED' },
      profile: {
        visibility: { not: 'PRIVATE' },
      },
    },
    orderBy: { effectiveScore: 'desc' },
    select: {
      id: true,
      profileId: true,
      effectiveScore: true,
    },
  })

  // Update globalRank on SportProfile
  await prisma.$transaction(
    globalProfiles.map((gp, i) =>
      prisma.sportProfile.update({
        where: { id: gp.id },
        data: { globalRank: i + 1 },
      })
    )
  )

  // Fetch existing global rankings for previousRank tracking
  const existingGlobalRankings = await prisma.ranking.findMany({
    where: {
      profileId: { in: globalProfiles.map(gp => gp.profileId) },
      sportId,
      category: 'GLOBAL',
      period: 'ALL_TIME',
    },
    select: { profileId: true, rank: true },
  })
  const globalPrevRankMap = new Map(existingGlobalRankings.map(r => [r.profileId, r.rank]))

  // Save global ranking records to Ranking table
  const globalRankingOps = globalProfiles.map((gp, index) => {
    const newRank = index + 1
    const previousRank = globalPrevRankMap.get(gp.profileId) ?? null

    return prisma.ranking.upsert({
      where: {
        profileId_category_period_country_skillTier_ageGroup_periodStart: {
          profileId: gp.profileId,
          category: 'GLOBAL',
          period: 'ALL_TIME',
          country: null as unknown as string,
          skillTier: null as unknown as SkillTier,
          ageGroup: null as unknown as string,
          periodStart,
        },
      },
      create: {
        profileId: gp.profileId,
        sportId,
        category: 'GLOBAL',
        period: 'ALL_TIME',
        rank: newRank,
        previousRank,
        effectiveScore: gp.effectiveScore!,
        periodStart,
        computedAt: now,
      },
      update: {
        rank: newRank,
        previousRank,
        effectiveScore: gp.effectiveScore!,
        sportId,
        computedAt: now,
      },
    })
  })

  await prisma.$transaction(globalRankingOps)
}

/**
 * Sync PlayerProfile with the best sport's effective score.
 * Called after per-sport rankings are computed.
 */
export async function updatePlayerProfileBestScores(): Promise<void> {
  const profiles = await prisma.playerProfile.findMany({
    where: {
      sportProfiles: {
        some: {
          compositeScore: { not: null },
        },
      },
    },
    select: {
      id: true,
      sportProfiles: {
        where: { compositeScore: { not: null } },
        orderBy: { effectiveScore: 'desc' },
        take: 1,
        select: {
          effectiveScore: true,
          compositeScore: true,
          skillTier: true,
          globalRank: true,
          countryRank: true,
        },
      },
    },
  })

  await prisma.$transaction(
    profiles
      .filter((profile) => profile.sportProfiles[0])
      .map((profile) => {
        const best = profile.sportProfiles[0]
        return prisma.playerProfile.update({
          where: { id: profile.id },
          data: {
            effectiveScore: best.effectiveScore,
            compositeScore: best.compositeScore,
            skillTier: best.skillTier,
            globalRank: best.globalRank,
            countryRank: best.countryRank,
          },
        })
      })
  )
}
