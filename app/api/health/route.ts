import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  // Database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'error'
  }

  // Critical env vars
  const envVars = ['DATABASE_URL', 'AUTH_SECRET', 'CRON_SECRET', 'NEXT_PUBLIC_APP_URL']
  checks.env = envVars.every((v) => !!process.env[v]) ? 'ok' : 'missing'

  const healthy = Object.values(checks).every((v) => v === 'ok')

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
