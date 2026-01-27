import { prisma } from '@/lib/prisma'

/**
 * Generate a single-elimination bracket from seeded participants.
 * Seeds are assigned by effectiveScore descending.
 * Bracket pairing: seed 1 vs last, seed 2 vs second-to-last, etc.
 */
export async function generateBracket(tournamentId: string): Promise<void> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      participants: {
        include: {
          profile: { select: { effectiveScore: true } },
        },
      },
    },
  })

  if (!tournament) throw new Error('Torneo no encontrado')
  if (tournament.status !== 'REGISTRATION') throw new Error('El torneo no esta en registro')

  // Sort by effective score for seeding
  const participants = tournament.participants
    .sort((a, b) => (b.profile.effectiveScore ?? 0) - (a.profile.effectiveScore ?? 0))

  // Assign seeds
  for (let i = 0; i < participants.length; i++) {
    await prisma.tournamentParticipant.update({
      where: { id: participants[i].id },
      data: { seed: i + 1 },
    })
  }

  // Pad to nearest power of 2
  const totalSlots = nextPowerOf2(participants.length)
  const totalRounds = Math.log2(totalSlots)

  // Create first round matchups
  const firstRoundMatches = totalSlots / 2

  for (let pos = 0; pos < firstRoundMatches; pos++) {
    const topSeedIndex = pos
    const bottomSeedIndex = totalSlots - 1 - pos

    const player1 = topSeedIndex < participants.length ? participants[topSeedIndex] : null
    const player2 = bottomSeedIndex < participants.length ? participants[bottomSeedIndex] : null

    await prisma.tournamentBracket.create({
      data: {
        tournamentId,
        round: 1,
        position: pos,
        player1Id: player1?.profileId || null,
        player2Id: player2?.profileId || null,
        // Auto-advance if bye (only 1 player in the match)
        winnerId: player1 && !player2 ? player1.profileId : (!player1 && player2 ? player2.profileId : null),
      },
    })
  }

  // Create empty brackets for subsequent rounds
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = totalSlots / Math.pow(2, round)
    for (let pos = 0; pos < matchesInRound; pos++) {
      await prisma.tournamentBracket.create({
        data: {
          tournamentId,
          round,
          position: pos,
        },
      })
    }
  }

  // Update tournament status
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: 'IN_PROGRESS' },
  })

  // Advance byes in first round
  await advanceByes(tournamentId)
}

/**
 * After a match result, advance the winner to the next round.
 */
export async function advanceWinner(
  tournamentId: string,
  round: number,
  position: number,
  winnerId: string
): Promise<void> {
  // Update current bracket
  await prisma.tournamentBracket.update({
    where: {
      tournamentId_round_position: { tournamentId, round, position },
    },
    data: { winnerId },
  })

  // Find next round bracket
  const nextRound = round + 1
  const nextPosition = Math.floor(position / 2)

  const nextBracket = await prisma.tournamentBracket.findUnique({
    where: {
      tournamentId_round_position: { tournamentId, round: nextRound, position: nextPosition },
    },
  })

  if (nextBracket) {
    // Place winner in correct slot (top or bottom)
    const isTopSlot = position % 2 === 0
    await prisma.tournamentBracket.update({
      where: { id: nextBracket.id },
      data: isTopSlot ? { player1Id: winnerId } : { player2Id: winnerId },
    })
  } else {
    // No next round - this is the final. Mark tournament complete.
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'COMPLETED' },
    })

    // Mark winner as position 1 and loser as position 2
    await prisma.tournamentParticipant.updateMany({
      where: { tournamentId, profileId: winnerId },
      data: { finalPosition: 1 },
    })
  }
}

async function advanceByes(tournamentId: string): Promise<void> {
  const byes = await prisma.tournamentBracket.findMany({
    where: {
      tournamentId,
      round: 1,
      winnerId: { not: null },
    },
  })

  for (const bye of byes) {
    await advanceWinner(tournamentId, 1, bye.position, bye.winnerId!)
  }
}

function nextPowerOf2(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}
