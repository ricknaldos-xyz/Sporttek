import { prisma } from '@/lib/prisma'
import { SkillTier } from '@prisma/client'

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
 * Apply decay to all profiles and recompute rankings.
 * Called by daily cron job.
 */
export async function computeAllRankings(): Promise<void> {
  // 1. Apply decay to all profiles with a composite score
  const profiles = await prisma.playerProfile.findMany({
    where: {
      compositeScore: { not: null },
      skillTier: { not: 'UNRANKED' },
    },
    select: {
      id: true,
      compositeScore: true,
      lastScoreUpdate: true,
      country: true,
      skillTier: true,
      ageGroup: true,
    },
  })

  // Update effective scores with decay
  for (const profile of profiles) {
    const effectiveScore = calculateDecay(
      profile.compositeScore!,
      profile.lastScoreUpdate
    )

    await prisma.playerProfile.update({
      where: { id: profile.id },
      data: { effectiveScore },
    })
  }

  // 2. Compute country rankings (Peru first)
  const countries = [...new Set(profiles.map((p) => p.country))]

  for (const country of countries) {
    const countryProfiles = await prisma.playerProfile.findMany({
      where: {
        country,
        effectiveScore: { not: null },
        skillTier: { not: 'UNRANKED' },
        visibility: { not: 'PRIVATE' },
      },
      orderBy: { effectiveScore: 'desc' },
      select: { id: true, effectiveScore: true },
    })

    // Update country rank on each profile
    for (let i = 0; i < countryProfiles.length; i++) {
      await prisma.playerProfile.update({
        where: { id: countryProfiles[i].id },
        data: { countryRank: i + 1 },
      })
    }

    // Create ranking records for the period
    const periodStart = new Date()
    periodStart.setHours(0, 0, 0, 0)

    const rankingData = countryProfiles.map((p, index) => ({
      profileId: p.id,
      category: 'COUNTRY' as const,
      period: 'ALL_TIME' as const,
      country,
      rank: index + 1,
      effectiveScore: p.effectiveScore!,
      periodStart,
    }))

    // Upsert rankings in batches
    for (const data of rankingData) {
      await prisma.ranking.upsert({
        where: {
          profileId_category_period_country_skillTier_ageGroup_periodStart: {
            profileId: data.profileId,
            category: data.category,
            period: data.period,
            country: data.country,
            skillTier: null as unknown as SkillTier,
            ageGroup: null as unknown as string,
            periodStart: data.periodStart,
          },
        },
        create: data,
        update: {
          rank: data.rank,
          effectiveScore: data.effectiveScore,
        },
      })
    }
  }

  // 3. Compute global rankings
  const globalProfiles = await prisma.playerProfile.findMany({
    where: {
      effectiveScore: { not: null },
      skillTier: { not: 'UNRANKED' },
      visibility: { not: 'PRIVATE' },
    },
    orderBy: { effectiveScore: 'desc' },
    select: { id: true },
  })

  for (let i = 0; i < globalProfiles.length; i++) {
    await prisma.playerProfile.update({
      where: { id: globalProfiles[i].id },
      data: { globalRank: i + 1 },
    })
  }
}
