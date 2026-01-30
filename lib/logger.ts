const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  /** Debug info - only in development */
  debug(...args: unknown[]) {
    if (isDev) console.log('[DEBUG]', ...args)
  },
  /** Info - always logs but could be filtered in prod */
  info(...args: unknown[]) {
    console.log('[INFO]', ...args)
  },
  /** Warnings */
  warn(...args: unknown[]) {
    console.warn('[WARN]', ...args)
  },
  /** Errors - always logs */
  error(...args: unknown[]) {
    console.error('[ERROR]', ...args)
  },
}
