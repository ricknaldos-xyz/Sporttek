/**
 * Valid state transitions for shop orders.
 */
export const SHOP_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
}

/**
 * Valid state transitions for stringing (racket restring) orders.
 */
export const STRINGING_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'STRINGING_CANCELLED'],
  CONFIRMED: ['PICKUP_SCHEDULED', 'STRINGING_CANCELLED'],
  PICKUP_SCHEDULED: ['RECEIVED_AT_WORKSHOP', 'STRINGING_CANCELLED'],
  RECEIVED_AT_WORKSHOP: ['IN_PROGRESS', 'STRINGING_CANCELLED'],
  IN_PROGRESS: ['STRINGING_COMPLETED'],
  STRINGING_COMPLETED: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'],
  READY_FOR_PICKUP: ['DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  STRINGING_CANCELLED: [],
}

/**
 * Returns true when transitioning from `currentStatus` to `newStatus` is valid
 * according to the given transition map.
 */
export function isValidTransition(
  transitions: Record<string, string[]>,
  currentStatus: string,
  newStatus: string
): boolean {
  return transitions[currentStatus]?.includes(newStatus) ?? false
}
