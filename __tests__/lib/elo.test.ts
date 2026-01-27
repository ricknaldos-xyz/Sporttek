import { describe, it, expect } from 'vitest'
import { calculateElo, expectedScore, getKFactor } from '@/lib/elo'

describe('getKFactor', () => {
  it('returns 32 for provisional players (< 30 matches)', () => {
    expect(getKFactor(0)).toBe(32)
    expect(getKFactor(15)).toBe(32)
    expect(getKFactor(29)).toBe(32)
  })

  it('returns 16 for established players (>= 30 matches)', () => {
    expect(getKFactor(30)).toBe(16)
    expect(getKFactor(100)).toBe(16)
  })
})

describe('expectedScore', () => {
  it('returns 0.5 for equal ELO', () => {
    expect(expectedScore(1500, 1500)).toBeCloseTo(0.5)
  })

  it('returns higher expected score for higher rated player', () => {
    const score = expectedScore(1800, 1500)
    expect(score).toBeGreaterThan(0.5)
    expect(score).toBeLessThan(1)
  })

  it('returns lower expected score for lower rated player', () => {
    const score = expectedScore(1200, 1500)
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThan(0.5)
  })

  it('expected scores of two opponents sum to 1', () => {
    const p1 = expectedScore(1600, 1400)
    const p2 = expectedScore(1400, 1600)
    expect(p1 + p2).toBeCloseTo(1)
  })
})

describe('calculateElo', () => {
  it('equal ELO players: winner gains ~16, loser loses ~16 (provisional K=32)', () => {
    const winner = calculateElo(1500, 1500, 1, 10)
    const loser = calculateElo(1500, 1500, 0, 10)

    expect(winner.eloChange).toBe(16)
    expect(loser.eloChange).toBe(-16)
    expect(winner.newElo).toBe(1516)
    expect(loser.newElo).toBe(1484)
  })

  it('higher rated wins: smaller change', () => {
    const winner = calculateElo(1800, 1400, 1, 10) // strong favorite wins
    const loser = calculateElo(1400, 1800, 0, 10)

    // The higher rated player was expected to win, so small gain
    expect(winner.eloChange).toBeGreaterThan(0)
    expect(winner.eloChange).toBeLessThan(16)
    expect(loser.eloChange).toBeLessThan(0)
    expect(loser.eloChange).toBeGreaterThan(-16)
  })

  it('lower rated wins (upset): larger change', () => {
    const winner = calculateElo(1400, 1800, 1, 10) // upset
    const loser = calculateElo(1800, 1400, 0, 10)

    expect(winner.eloChange).toBeGreaterThan(16)
    expect(loser.eloChange).toBeLessThan(-16)
  })

  it('uses K=16 for established players (30+ matches)', () => {
    const result = calculateElo(1500, 1500, 1, 50)
    // K=16, expected=0.5 => change = 16 * (1 - 0.5) = 8
    expect(result.eloChange).toBe(8)
    expect(result.newElo).toBe(1508)
  })

  it('ELO can go negative if player is very low rated and loses', () => {
    // With an ELO of 10 vs 1500 opponent, losing still subtracts
    const result = calculateElo(10, 1500, 0, 5)
    expect(result.eloChange).toBeLessThanOrEqual(0)
    // The new ELO could be negative or zero
    expect(result.newElo).toBeLessThanOrEqual(10)
  })

  it('winner and loser ELO changes are symmetric for equal ratings', () => {
    const winner = calculateElo(1500, 1500, 1, 20)
    const loser = calculateElo(1500, 1500, 0, 20)
    expect(winner.eloChange + loser.eloChange).toBe(0)
  })

  it('handles very large ELO differences', () => {
    const result = calculateElo(2800, 800, 1, 10)
    // Almost fully expected to win, so minimal gain
    expect(result.eloChange).toBeGreaterThanOrEqual(0)
    expect(result.eloChange).toBeLessThanOrEqual(2)
  })
})
