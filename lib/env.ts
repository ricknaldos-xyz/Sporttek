import { z } from 'zod'

/** Zod string that logs a warning when missing instead of throwing */
const warnString = z
  .string()
  .optional()
  .default('')
  .transform((val) => val || '')

const envSchema = z.object({
  // Required — app will not start without these
  DATABASE_URL: z.string().min(1, 'Missing required env: DATABASE_URL'),
  AUTH_SECRET: z.string().min(1, 'Missing required env: AUTH_SECRET'),

  // Important — features degrade without them
  NEXTAUTH_URL: warnString,
  GOOGLE_AI_API_KEY: warnString,
  CULQI_SECRET_KEY: warnString,
  CULQI_WEBHOOK_SECRET: warnString,
  CRON_SECRET: warnString,
  RESEND_API_KEY: warnString,
  BLOB_READ_WRITE_TOKEN: warnString,
  UPSTASH_REDIS_REST_URL: warnString,
  UPSTASH_REDIS_REST_TOKEN: warnString,

  // Optional — app works fine without them
  NEXT_PUBLIC_APP_URL: z.string().optional().default('https://sporttek.xyz'),
  NEXT_PUBLIC_CULQI_PUBLIC_KEY: z.string().optional().default(''),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional().default(''),
  VAPID_PRIVATE_KEY: z.string().optional().default(''),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  YOUTUBE_API_KEY: z.string().optional().default(''),
  FROM_EMAIL: z.string().optional().default('SportTek <noreply@sporttek.xyz>'),
  SENTRY_ORG: z.string().optional().default(''),
  SENTRY_PROJECT: z.string().optional().default(''),
  SENTRY_AUTH_TOKEN: z.string().optional().default(''),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const missing = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n')
    throw new Error(`Environment validation failed:\n${missing}`)
  }

  // Warn about important but non-required vars
  const important = [
    'GOOGLE_AI_API_KEY', 'CULQI_SECRET_KEY', 'RESEND_API_KEY',
    'UPSTASH_REDIS_REST_URL', 'BLOB_READ_WRITE_TOKEN',
  ] as const
  for (const key of important) {
    if (!result.data[key]) {
      console.warn(`[WARN] Missing environment variable: ${key}. Related features will not work.`)
    }
  }

  return result.data
}

/** Validated, typed environment variables. Import and use `env.DATABASE_URL` etc. */
export const env = validateEnv()
