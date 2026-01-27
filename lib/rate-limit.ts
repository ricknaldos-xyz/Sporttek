// Simple in-memory rate limiter using a Map with sliding window
// Note: This works per-instance. In serverless (Vercel), each cold start gets a fresh map.
// For production-grade rate limiting, use Upstash or similar.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const limiters = new Map<string, Map<string, RateLimitEntry>>()

export function rateLimit(options: {
  key: string       // limiter name (e.g., 'auth', 'analyze')
  limit: number     // max requests
  window: number    // time window in seconds
}) {
  return {
    async check(identifier: string): Promise<{ success: boolean; remaining: number }> {
      const { key, limit, window } = options

      if (!limiters.has(key)) {
        limiters.set(key, new Map())
      }
      const store = limiters.get(key)!
      const now = Date.now()
      const entry = store.get(identifier)

      if (!entry || now > entry.resetAt) {
        store.set(identifier, { count: 1, resetAt: now + window * 1000 })
        return { success: true, remaining: limit - 1 }
      }

      if (entry.count >= limit) {
        return { success: false, remaining: 0 }
      }

      entry.count++
      return { success: true, remaining: limit - entry.count }
    }
  }
}

// Pre-configured limiters
export const authLimiter = rateLimit({ key: 'auth', limit: 5, window: 60 })          // 5 per minute
export const registerLimiter = rateLimit({ key: 'register', limit: 3, window: 60 })   // 3 per minute
export const forgotPasswordLimiter = rateLimit({ key: 'forgot', limit: 3, window: 300 }) // 3 per 5 min
export const analyzeLimiter = rateLimit({ key: 'analyze', limit: 10, window: 60 })     // 10 per minute
export const reportLimiter = rateLimit({ key: 'report', limit: 5, window: 300 })       // 5 per 5 min
