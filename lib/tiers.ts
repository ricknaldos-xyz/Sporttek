export const TIER_ORDER = ['BRONCE', 'PLATA', 'ORO', 'PLATINO', 'DIAMANTE'] as const
export type SkillTier = (typeof TIER_ORDER)[number]

/**
 * Check whether a player's tier falls within an optional min/max range.
 * Returns true when the player is allowed, false otherwise.
 */
export function isPlayerTierAllowed(
  playerTier: string,
  minTier?: string | null,
  maxTier?: string | null
): boolean {
  const playerTierIndex = TIER_ORDER.indexOf(playerTier as SkillTier)

  // Unknown tier is never allowed
  if (playerTierIndex === -1) return false

  if (minTier) {
    const minIndex = TIER_ORDER.indexOf(minTier as SkillTier)
    if (minIndex !== -1 && playerTierIndex < minIndex) {
      return false
    }
  }

  if (maxTier) {
    const maxIndex = TIER_ORDER.indexOf(maxTier as SkillTier)
    if (maxIndex !== -1 && playerTierIndex > maxIndex) {
      return false
    }
  }

  return true
}
