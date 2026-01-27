import { describe, it, expect } from 'vitest'
import {
  SHOP_ORDER_TRANSITIONS,
  STRINGING_ORDER_TRANSITIONS,
  isValidTransition,
} from '@/lib/order-transitions'

describe('isValidTransition', () => {
  it('returns true for valid transitions', () => {
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PENDING_PAYMENT', 'PAID')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PENDING_PAYMENT', 'CANCELLED')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PAID', 'PROCESSING')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PROCESSING', 'SHIPPED')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'SHIPPED', 'DELIVERED')).toBe(true)
  })

  it('returns false for invalid transitions', () => {
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'DELIVERED', 'PENDING_PAYMENT')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'CANCELLED', 'SHIPPED')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PENDING_PAYMENT', 'SHIPPED')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'SHIPPED', 'PROCESSING')).toBe(false)
  })

  it('returns false for unknown current status', () => {
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'NONEXISTENT', 'PAID')).toBe(false)
  })

  it('terminal states have no valid transitions', () => {
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'DELIVERED', 'PAID')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'DELIVERED', 'CANCELLED')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'CANCELLED', 'PAID')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'CANCELLED', 'PROCESSING')).toBe(false)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'REFUNDED', 'PENDING_PAYMENT')).toBe(false)
  })

  it('allows cancellation from active states', () => {
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PENDING_PAYMENT', 'CANCELLED')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PAID', 'CANCELLED')).toBe(true)
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'PROCESSING', 'CANCELLED')).toBe(true)
    // Cannot cancel once shipped
    expect(isValidTransition(SHOP_ORDER_TRANSITIONS, 'SHIPPED', 'CANCELLED')).toBe(false)
  })
})

describe('SHOP_ORDER_TRANSITIONS completeness', () => {
  it('defines transitions for all expected statuses', () => {
    const expectedStatuses = [
      'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
    ]
    for (const status of expectedStatuses) {
      expect(SHOP_ORDER_TRANSITIONS).toHaveProperty(status)
    }
  })
})

describe('stringing order transitions', () => {
  it('follows the full happy path', () => {
    const happyPath = [
      'PENDING_PAYMENT',
      'CONFIRMED',
      'PICKUP_SCHEDULED',
      'RECEIVED_AT_WORKSHOP',
      'IN_PROGRESS',
      'STRINGING_COMPLETED',
      'READY_FOR_PICKUP',
      'DELIVERED',
    ]

    for (let i = 0; i < happyPath.length - 1; i++) {
      expect(
        isValidTransition(STRINGING_ORDER_TRANSITIONS, happyPath[i], happyPath[i + 1])
      ).toBe(true)
    }
  })

  it('allows cancellation from early stages', () => {
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'PENDING_PAYMENT', 'STRINGING_CANCELLED')).toBe(true)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'CONFIRMED', 'STRINGING_CANCELLED')).toBe(true)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'RECEIVED_AT_WORKSHOP', 'STRINGING_CANCELLED')).toBe(true)
  })

  it('prevents cancellation once in progress', () => {
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'IN_PROGRESS', 'STRINGING_CANCELLED')).toBe(false)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'STRINGING_COMPLETED', 'STRINGING_CANCELLED')).toBe(false)
  })

  it('allows delivery via pickup or delivery route', () => {
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'STRINGING_COMPLETED', 'READY_FOR_PICKUP')).toBe(true)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'STRINGING_COMPLETED', 'OUT_FOR_DELIVERY')).toBe(true)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'READY_FOR_PICKUP', 'DELIVERED')).toBe(true)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'OUT_FOR_DELIVERY', 'DELIVERED')).toBe(true)
  })

  it('terminal states have no transitions', () => {
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'DELIVERED', 'PENDING_PAYMENT')).toBe(false)
    expect(isValidTransition(STRINGING_ORDER_TRANSITIONS, 'STRINGING_CANCELLED', 'CONFIRMED')).toBe(false)
  })
})
