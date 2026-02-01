#!/usr/bin/env tsx

/**
 * Smoke test for cron job endpoints.
 * Run: CRON_SECRET=xxx APP_URL=https://your-app.vercel.app npx tsx scripts/test-crons.ts
 */

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET

if (!CRON_SECRET) {
  console.error('❌ CRON_SECRET environment variable is required')
  process.exit(1)
}

const cronEndpoints = [
  { path: '/api/cron/check-stale-analyses', method: 'POST' },
  { path: '/api/cron/compute-rankings', method: 'POST' },
  { path: '/api/cron/expire-challenges', method: 'POST' },
  { path: '/api/cron/auto-tournaments', method: 'POST' },
  { path: '/api/cron/weekly-digest', method: 'POST' },
]

async function testCron(endpoint: { path: string; method: string }) {
  try {
    const res = await fetch(`${APP_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    })

    const body = await res.json().catch(() => ({}))
    const status = res.status

    if (status === 200) {
      console.log(`  ✅ ${endpoint.path} — ${status} ${JSON.stringify(body)}`)
    } else {
      console.log(`  ❌ ${endpoint.path} — ${status} ${JSON.stringify(body)}`)
    }

    return status === 200
  } catch (error) {
    console.log(`  ❌ ${endpoint.path} — ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

async function main() {
  console.log(`\n🔍 Testing cron endpoints at ${APP_URL}\n`)

  let passed = 0
  for (const endpoint of cronEndpoints) {
    const ok = await testCron(endpoint)
    if (ok) passed++
  }

  console.log(`\n${passed}/${cronEndpoints.length} cron endpoints passed.\n`)

  if (passed < cronEndpoints.length) {
    process.exit(1)
  }
}

main()
