import { describe, it, expect } from 'vitest'
import { isPlayerTierAllowed, TIER_ORDER } from '@/lib/tiers'

describe('TIER_ORDER', () => {
  it('contains 5 tiers in ascending order', () => {
    expect(TIER_ORDER).toEqual(['BRONCE', 'PLATA', 'ORO', 'PLATINO', 'DIAMANTE'])
  })
})

describe('isPlayerTierAllowed', () => {
  it('allows player when no restrictions are set', () => {
    expect(isPlayerTierAllowed('BRONCE')).toBe(true)
    expect(isPlayerTierAllowed('DIAMANTE')).toBe(true)
    expect(isPlayerTierAllowed('ORO', null, null)).toBe(true)
    expect(isPlayerTierAllowed('PLATA', undefined, undefined)).toBe(true)
  })

  it('allows player within min/max range', () => {
    expect(isPlayerTierAllowed('ORO', 'PLATA', 'PLATINO')).toBe(true)
  })

  it('allows player at exact min boundary', () => {
    expect(isPlayerTierAllowed('PLATA', 'PLATA', 'DIAMANTE')).toBe(true)
  })

  it('allows player at exact max boundary', () => {
    expect(isPlayerTierAllowed('PLATINO', 'BRONCE', 'PLATINO')).toBe(true)
  })

  it('rejects player below minimum tier', () => {
    expect(isPlayerTierAllowed('BRONCE', 'PLATA', 'DIAMANTE')).toBe(false)
  })

  it('rejects player above maximum tier', () => {
    expect(isPlayerTierAllowed('DIAMANTE', 'BRONCE', 'PLATINO')).toBe(false)
  })

  it('allows player when only minTier is set and player meets it', () => {
    expect(isPlayerTierAllowed('ORO', 'PLATA')).toBe(true)
    expect(isPlayerTierAllowed('PLATA', 'PLATA')).toBe(true)
  })

  it('rejects player when only minTier is set and player is below', () => {
    expect(isPlayerTierAllowed('BRONCE', 'ORO')).toBe(false)
  })

  it('allows player when only maxTier is set and player meets it', () => {
    expect(isPlayerTierAllowed('PLATA', null, 'ORO')).toBe(true)
    expect(isPlayerTierAllowed('ORO', null, 'ORO')).toBe(true)
  })

  it('rejects player when only maxTier is set and player exceeds it', () => {
    expect(isPlayerTierAllowed('DIAMANTE', null, 'PLATINO')).toBe(false)
  })

  it('handles single-tier range (min == max)', () => {
    expect(isPlayerTierAllowed('ORO', 'ORO', 'ORO')).toBe(true)
    expect(isPlayerTierAllowed('PLATA', 'ORO', 'ORO')).toBe(false)
    expect(isPlayerTierAllowed('PLATINO', 'ORO', 'ORO')).toBe(false)
  })

  it('rejects unknown tier', () => {
    expect(isPlayerTierAllowed('UNKNOWN', 'BRONCE', 'DIAMANTE')).toBe(false)
    expect(isPlayerTierAllowed('')).toBe(false)
  })
})
