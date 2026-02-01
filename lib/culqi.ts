import Culqi from 'culqi-node'
import { logger } from '@/lib/logger'

export { PLANS, type PlanType } from '@/lib/plans'

function validateCulqiEnv() {
  const required = ['CULQI_PUBLIC_KEY', 'CULQI_SECRET_KEY'] as const
  for (const key of required) {
    if (!process.env[key]) {
      logger.warn(`Missing environment variable: ${key}`)
    }
  }
}

validateCulqiEnv()

let culqiClient: InstanceType<typeof Culqi> | null = null

export function getCulqiClient() {
  if (!culqiClient) {
    if (!process.env.CULQI_SECRET_KEY) {
      throw new Error('CULQI_SECRET_KEY is not configured')
    }
    culqiClient = new Culqi({
      privateKey: process.env.CULQI_SECRET_KEY,
    })
  }
  return culqiClient
}

export const CULQI_PLAN_IDS = {
  PRO: process.env.CULQI_PRO_PLAN_ID || null,
  ELITE: process.env.CULQI_ELITE_PLAN_ID || null,
} as const
