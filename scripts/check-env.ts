#!/usr/bin/env tsx

/**
 * Pre-deploy environment variable checker.
 * Run: npx tsx scripts/check-env.ts
 */

const required = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_AI_API_KEY',
  'CULQI_SECRET_KEY',
  'CRON_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
  'FROM_EMAIL',
  'BLOB_READ_WRITE_TOKEN',
] as const

const optional = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'YOUTUBE_API_KEY',
  'CULQI_WEBHOOK_SECRET',
  'CULQI_PRO_PLAN_ID',
  'CULQI_ELITE_PLAN_ID',
  'NEXT_PUBLIC_CULQI_PUBLIC_KEY',
  'NEXT_PUBLIC_SENTRY_DSN',
  'SENTRY_ORG',
  'SENTRY_PROJECT',
  'SENTRY_AUTH_TOKEN',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'POSTGRES_URL_NON_POOLING',
] as const

let hasErrors = false

console.log('\n🔍 Checking environment variables...\n')

console.log('Required:')
for (const key of required) {
  if (process.env[key]) {
    console.log(`  ✅ ${key}`)
  } else {
    console.log(`  ❌ ${key} — MISSING`)
    hasErrors = true
  }
}

console.log('\nOptional:')
for (const key of optional) {
  if (process.env[key]) {
    console.log(`  ✅ ${key}`)
  } else {
    console.log(`  ⚠️  ${key} — not set`)
  }
}

console.log('')

if (hasErrors) {
  console.error('❌ Missing required environment variables. Fix before deploying.\n')
  process.exit(1)
} else {
  console.log('✅ All required environment variables are set.\n')
}
