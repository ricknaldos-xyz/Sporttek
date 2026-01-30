import { prisma } from '@/lib/prisma'
import { PLANS, PlanType } from '@/lib/culqi'

/**
 * Get the user's subscription plan limits.
 */
export function getPlanLimits(subscription: string) {
  const plan = PLANS[subscription as PlanType] ?? PLANS.FREE
  return plan.limits
}

/**
 * Check if the user has reached their monthly analysis limit.
 * Returns { allowed: true } or { allowed: false, limit, current }.
 */
export async function checkAnalysisLimit(userId: string, subscription: string) {
  const limits = getPlanLimits(subscription)
  if (limits.analysesPerMonth === -1) {
    return { allowed: true } as const
  }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const count = await prisma.analysis.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  })

  if (count >= limits.analysesPerMonth) {
    return { allowed: false, limit: limits.analysesPerMonth, current: count } as const
  }

  return { allowed: true } as const
}

/**
 * Check if the user has reached their active training plans limit.
 * Returns { allowed: true } or { allowed: false, limit, current }.
 */
export async function checkActivePlansLimit(userId: string, subscription: string) {
  const limits = getPlanLimits(subscription)
  if (limits.activePlans === -1) {
    return { allowed: true } as const
  }

  const count = await prisma.trainingPlan.count({
    where: {
      userId,
      status: 'ACTIVE',
    },
  })

  if (count >= limits.activePlans) {
    return { allowed: false, limit: limits.activePlans, current: count } as const
  }

  return { allowed: true } as const
}

/**
 * Check if the user has reached their active goals limit.
 * Free users: 3 active goals. Pro/Elite: unlimited.
 */
export async function checkActiveGoalsLimit(userId: string, subscription: string) {
  const limits = getPlanLimits(subscription)
  // Goals limit follows activePlans for now (FREE=1 is too restrictive for goals, use 3)
  const goalsLimit = limits.activePlans === -1 ? -1 : 3

  if (goalsLimit === -1) {
    return { allowed: true } as const
  }

  const count = await prisma.improvementGoal.count({
    where: {
      userId,
      status: 'ACTIVE',
    },
  })

  if (count >= goalsLimit) {
    return { allowed: false, limit: goalsLimit, current: count } as const
  }

  return { allowed: true } as const
}

/**
 * Get the user's subscription tier from the database.
 */
export async function getUserSubscription(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true },
  })
  return user?.subscription ?? 'FREE'
}
