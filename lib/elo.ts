/**
 * ELO Rating System for competitive matches.
 *
 * K-factor:
 * - K=32 for players with <30 matches (provisional)
 * - K=16 for established players (30+ matches)
 */

const K_PROVISIONAL = 32
const K_ESTABLISHED = 16
const PROVISIONAL_THRESHOLD = 30

export function getKFactor(matchesPlayed: number): number {
  return matchesPlayed < PROVISIONAL_THRESHOLD ? K_PROVISIONAL : K_ESTABLISHED
}

export function expectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
}

export interface EloResult {
  newElo: number
  eloChange: number
}

/**
 * Calculate new ELO after a match.
 * @param playerElo Current ELO of the player
 * @param opponentElo Current ELO of the opponent
 * @param result 1 for win, 0 for loss
 * @param matchesPlayed How many matches the player has played (for K-factor)
 */
export function calculateElo(
  playerElo: number,
  opponentElo: number,
  result: 0 | 1,
  matchesPlayed: number
): EloResult {
  const expected = expectedScore(playerElo, opponentElo)
  const K = getKFactor(matchesPlayed)
  const eloChange = Math.round(K * (result - expected))
  const newElo = playerElo + eloChange

  return { newElo, eloChange }
}
