import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    return redis
  }
  return null
}

/**
 * Cached query with Redis. Falls back to direct fetch if Redis is unavailable.
 *
 * @param key - Cache key
 * @param ttlSeconds - Time-to-live in seconds
 * @param fetchFn - Function to fetch data on cache miss
 */
export async function cachedQuery<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const client = getRedis()

  if (!client) {
    return fetchFn()
  }

  try {
    const cached = await client.get<T>(key)
    if (cached !== null && cached !== undefined) {
      return cached
    }
  } catch (error) {
    logger.error('Cache read error:', error)
  }

  const data = await fetchFn()

  try {
    await client.set(key, JSON.stringify(data), { ex: ttlSeconds })
  } catch (error) {
    logger.error('Cache write error:', error)
  }

  return data
}
