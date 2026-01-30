export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate environment variables — warns for non-critical, throws for critical
    try {
      await import('@/lib/env')
    } catch (e) {
      console.error('[FATAL] Environment validation failed:', e)
    }
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
