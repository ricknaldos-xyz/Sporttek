import { prisma } from '@/lib/prisma'
import { SkillTier } from '@prisma/client'

// Technique weights for composite score calculation
// Higher weight = more important to overall tennis skill
const TECHNIQUE_WEIGHTS: Record<string, number> = {
  saque: 1.0,
  derecha: 1.0,
  reves: 0.9,
  'resto-de-saque': 0.8,
  'trabajo-de-pies': 0.8,
  volea: 0.7,
  remate: 0.7,
  'golpe-de-aproximacion': 0.6,
  dejada: 0.6,
  globo: 0.6,
  'media-volea': 0.6,
  'passing-shot': 0.6,
}

const DEFAULT_WEIGHT = 0.6
const MIN_TECHNIQUES_FOR_RANKING = 3
const MAX_RECENT_ANALYSES = 3

// Tier thresholds (0-100 scale)
const TIER_THRESHOLDS: { min: number; tier: SkillTier }[] = [
  { min: 85, tier: 'DIAMANTE' },
  { min: 70, tier: 'PLATINO' },
  { min: 55, tier: 'ORO' },
  { min: 40, tier: 'PLATA' },
  { min: 0, tier: 'BRONCE' },
]

export function getTierFromScore(score: number | null): SkillTier {
  if (score === null) return 'UNRANKED'
  for (const { min, tier } of TIER_THRESHOLDS) {
    if (score >= min) return tier
  }
  return 'BRONCE'
}

export function getTierColor(tier: SkillTier): string {
  switch (tier) {
    case 'DIAMANTE': return 'text-violet-500'
    case 'PLATINO': return 'text-cyan-500'
    case 'ORO': return 'text-yellow-500'
    case 'PLATA': return 'text-slate-400'
    case 'BRONCE': return 'text-amber-600'
    default: return 'text-muted-foreground'
  }
}

export function getTierLabel(tier: SkillTier): string {
  switch (tier) {
    case 'DIAMANTE': return 'Diamante'
    case 'PLATINO': return 'Platino'
    case 'ORO': return 'Oro'
    case 'PLATA': return 'Plata'
    case 'BRONCE': return 'Bronce'
    default: return 'Sin clasificar'
  }
}

/**
 * Recalculates the composite skill score for a user.
 * Called after every completed analysis.
 *
 * Algorithm:
 * 1. For each technique analyzed, get the best score from the last 3 analyses
 * 2. Compute weighted average across techniques
 * 3. Require at least 3 different techniques for a ranked score
 * 4. Update PlayerProfile with new composite score and tier
 */
export async function recalculateSkillScore(userId: string): Promise<void> {
  const profile = await prisma.playerProfile.findUnique({
    where: { userId },
  })

  if (!profile) return

  // Get all completed analyses for this user, grouped by technique
  const analyses = await prisma.analysis.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      overallScore: { not: null },
    },
    select: {
      id: true,
      techniqueId: true,
      overallScore: true,
      createdAt: true,
      technique: {
        select: { slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group by technique and take best of last N
  const techniqueMap = new Map<string, {
    techniqueId: string
    slug: string
    scores: number[]
    lastAnalysisId: string
    lastAnalyzedAt: Date
  }>()

  for (const analysis of analyses) {
    const existing = techniqueMap.get(analysis.techniqueId)
    if (existing) {
      if (existing.scores.length < MAX_RECENT_ANALYSES) {
        existing.scores.push(analysis.overallScore! * 10) // Convert 0-10 to 0-100
      }
    } else {
      techniqueMap.set(analysis.techniqueId, {
        techniqueId: analysis.techniqueId,
        slug: analysis.technique.slug,
        scores: [analysis.overallScore! * 10],
        lastAnalysisId: analysis.id,
        lastAnalyzedAt: analysis.createdAt,
      })
    }
  }

  // Update TechniqueScore records
  const techniqueScoreUpserts = Array.from(techniqueMap.entries()).map(
    ([techniqueId, data]) => {
      const bestScore = Math.max(...data.scores)
      const averageScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length

      return prisma.techniqueScore.upsert({
        where: {
          profileId_techniqueId: {
            profileId: profile.id,
            techniqueId,
          },
        },
        create: {
          profileId: profile.id,
          techniqueId,
          bestScore,
          averageScore,
          analysisCount: data.scores.length,
          lastAnalysisId: data.lastAnalysisId,
          lastAnalyzedAt: data.lastAnalyzedAt,
          scoreHistory: data.scores.map((s, i) => ({ index: i, score: s })),
        },
        update: {
          bestScore,
          averageScore,
          analysisCount: data.scores.length,
          lastAnalysisId: data.lastAnalysisId,
          lastAnalyzedAt: data.lastAnalyzedAt,
          scoreHistory: data.scores.map((s, i) => ({ index: i, score: s })),
        },
      })
    }
  )

  await Promise.all(techniqueScoreUpserts)

  // Calculate composite score
  const totalTechniques = techniqueMap.size
  let compositeScore: number | null = null
  let skillTier: SkillTier = 'UNRANKED'

  if (totalTechniques >= MIN_TECHNIQUES_FOR_RANKING) {
    let weightedSum = 0
    let totalWeight = 0

    for (const [, data] of techniqueMap) {
      const weight = TECHNIQUE_WEIGHTS[data.slug] ?? DEFAULT_WEIGHT
      const bestScore = Math.max(...data.scores)
      weightedSum += weight * bestScore
      totalWeight += weight
    }

    compositeScore = totalWeight > 0 ? weightedSum / totalWeight : null
    skillTier = getTierFromScore(compositeScore)
  }

  // Count total analyses
  const totalAnalyses = analyses.length

  // Get previous tier for promotion detection
  const previousTier = profile.skillTier

  // Update profile
  await prisma.playerProfile.update({
    where: { id: profile.id },
    data: {
      compositeScore,
      effectiveScore: compositeScore, // decay applied by cron
      skillTier,
      totalAnalyses,
      totalTechniques,
      lastScoreUpdate: new Date(),
    },
  })

  // Check for tier promotion (for feed/badge logic)
  if (previousTier !== skillTier && skillTier !== 'UNRANKED') {
    console.log(
      `User ${userId} promoted from ${previousTier} to ${skillTier} (score: ${compositeScore?.toFixed(1)})`
    )
  }
}
