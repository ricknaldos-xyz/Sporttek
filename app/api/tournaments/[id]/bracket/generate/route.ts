import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// POST - Generate initial bracket from participants
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: tournamentId } = await params

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        organizer: { select: { userId: true } },
        participants: {
          orderBy: { seed: 'asc' },
          include: { profile: { select: { id: true } } },
        },
        brackets: { select: { id: true }, take: 1 },
      },
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 })
    }

    const userRole = (session.user as { role?: string }).role
    if (tournament.organizer.userId !== session.user.id && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 })
    }

    if (tournament.status !== 'REGISTRATION') {
      return NextResponse.json({ error: 'El torneo ya no esta en fase de registro' }, { status: 400 })
    }

    if (tournament.brackets.length > 0) {
      return NextResponse.json({ error: 'El bracket ya fue generado' }, { status: 400 })
    }

    const participantCount = tournament.participants.length
    if (participantCount < 2) {
      return NextResponse.json({ error: 'Se necesitan al menos 2 participantes' }, { status: 400 })
    }

    // Calculate bracket size (next power of 2)
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(participantCount)))
    const totalRounds = Math.log2(bracketSize)

    // Seed participants (with byes for non-power-of-2)
    const seeded: (string | null)[] = []
    for (let i = 0; i < bracketSize; i++) {
      seeded.push(i < participantCount ? tournament.participants[i].profile.id : null)
    }

    await prisma.$transaction(async (tx) => {
      // Create all bracket entries for every round
      const bracketData: { tournamentId: string; round: number; position: number; player1Id?: string; player2Id?: string; winnerId?: string }[] = []

      // Round 1: assign seeded players
      const round1Matches = bracketSize / 2
      for (let pos = 0; pos < round1Matches; pos++) {
        const p1 = seeded[pos * 2]
        const p2 = seeded[pos * 2 + 1]

        bracketData.push({
          tournamentId,
          round: 1,
          position: pos,
          player1Id: p1 ?? undefined,
          player2Id: p2 ?? undefined,
          // Auto-advance byes
          winnerId: p1 && !p2 ? p1 : (!p1 && p2 ? p2 : undefined),
        })
      }

      // Future rounds: empty brackets
      for (let round = 2; round <= totalRounds; round++) {
        const matchesInRound = bracketSize / Math.pow(2, round)
        for (let pos = 0; pos < matchesInRound; pos++) {
          bracketData.push({
            tournamentId,
            round,
            position: pos,
          })
        }
      }

      for (const data of bracketData) {
        await tx.tournamentBracket.create({ data })
      }

      // Advance bye winners to round 2
      const byeBrackets = bracketData.filter((b) => b.round === 1 && b.winnerId)
      for (const bye of byeBrackets) {
        const nextPos = Math.floor(bye.position / 2)
        const nextBracket = await tx.tournamentBracket.findUnique({
          where: { tournamentId_round_position: { tournamentId, round: 2, position: nextPos } },
        })
        if (nextBracket) {
          const isPlayer1Slot = bye.position % 2 === 0
          await tx.tournamentBracket.update({
            where: { id: nextBracket.id },
            data: isPlayer1Slot ? { player1Id: bye.winnerId } : { player2Id: bye.winnerId },
          })
        }
      }

      // Update tournament status
      await tx.tournament.update({
        where: { id: tournamentId },
        data: { status: 'IN_PROGRESS' },
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    logger.error('Generate bracket error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
