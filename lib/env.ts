function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please add it to your .env file or environment.`
    )
  }
  return value
}

function warnEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.warn(
      `[WARN] Missing environment variable: ${name}. ` +
      `Related features will not work.`
    )
    return ''
  }
  return value
}

// Validate on import (server-side only)
export const env = {
  // Required - app won't start without these
  DATABASE_URL: requireEnv('DATABASE_URL'),
  AUTH_SECRET: requireEnv('AUTH_SECRET'),

  // Important but app can boot without them (features degrade)
  NEXTAUTH_URL: warnEnv('NEXTAUTH_URL'),
  GOOGLE_AI_API_KEY: warnEnv('GOOGLE_AI_API_KEY'),
  CULQI_SECRET_KEY: warnEnv('CULQI_SECRET_KEY'),
  CULQI_WEBHOOK_SECRET: warnEnv('CULQI_WEBHOOK_SECRET'),
  CRON_SECRET: warnEnv('CRON_SECRET'),

  // Optional
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
}
