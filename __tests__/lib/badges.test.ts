import { describe, it, expect } from 'vitest'
import { BADGE_DEFINITIONS, getBadgeDefinition } from '@/lib/badges'

describe('BADGE_DEFINITIONS', () => {
  const entries = Object.entries(BADGE_DEFINITIONS)

  it('has 26 badge definitions', () => {
    expect(entries.length).toBe(26)
  })

  it('every key matches its type field', () => {
    for (const [key, badge] of entries) {
      expect(badge.type).toBe(key)
    }
  })

  it('every badge has all required fields', () => {
    for (const [, badge] of entries) {
      expect(badge.name).toBeTruthy()
      expect(badge.description).toBeTruthy()
      expect(badge.icon).toBeTruthy()
      expect(badge.color).toBeTruthy()
    }
  })

  it('every badge has a non-empty string name', () => {
    for (const [, badge] of entries) {
      expect(typeof badge.name).toBe('string')
      expect(badge.name.length).toBeGreaterThan(0)
    }
  })
})

describe('getBadgeDefinition', () => {
  it('returns the correct badge for FIRST_ANALYSIS', () => {
    const badge = getBadgeDefinition('FIRST_ANALYSIS')
    expect(badge.name).toBe('Primer Analisis')
    expect(badge.type).toBe('FIRST_ANALYSIS')
  })

  it('returns the correct badge for TOURNAMENT_WINNER', () => {
    const badge = getBadgeDefinition('TOURNAMENT_WINNER')
    expect(badge.name).toBe('Campeon de Torneo')
    expect(badge.icon).toBe('🏆')
  })

  it('returns the correct badge for NUMBER_ONE_COUNTRY', () => {
    const badge = getBadgeDefinition('NUMBER_ONE_COUNTRY')
    expect(badge.name).toBe('Numero 1')
  })
})
