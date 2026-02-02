import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// GET - Get tournament bracket
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        brackets: {
          orderBy: [{ round: 'asc' }, { position: 'asc' }],
          include: {
            match: {
              select: {
                id: true,
                score: true,
                player1Confirmed: true,
                player2Confirmed: true,
              },
            },
          },
        },
        participants: {
          include: {
            profile: {
              select: {
                id: true,
                userId: true,
                displayName: true,
                avatarUrl: true,
                skillTier: true,
              },
            },
          },
          orderBy: { seed: 'asc' },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        status: tournament.status,
        format: tournament.format,
        maxPlayers: tournament.maxPlayers,
      },
      brackets: tournament.brackets,
      participants: tournament.participants,
    })
  } catch (error) {
    logger.error('Get bracket error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

const patchSchema = z.object({
  bracketId: z.string().min(1),
  winnerId: z.string().min(1),
  score: z.string().optional(),
})

// PATCH - Update bracket match result and advance winner
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: tournamentId } = await params
    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { bracketId, winnerId, score } = parsed.data

    // Verify tournament and permissions
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        organizer: { select: { userId: true } },
        brackets: { orderBy: [{ round: 'asc' }, { position: 'asc' }] },
      },
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 })
    }

    const userRole = (session.user as { role?: string }).role
    if (tournament.organizer.userId !== session.user.id && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 })
    }

    if (tournament.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'El torneo no esta en progreso' }, { status: 400 })
    }

    // Find the bracket entry
    const bracket = tournament.brackets.find((b) => b.id === bracketId)
    if (!bracket) {
      return NextResponse.json({ error: 'Bracket no encontrado' }, { status: 404 })
    }

    if (!bracket.player1Id || !bracket.player2Id) {
      return NextResponse.json({ error: 'Bracket incompleto — faltan jugadores' }, { status: 400 })
    }

    if (winnerId !== bracket.player1Id && winnerId !== bracket.player2Id) {
      return NextResponse.json({ error: 'El ganador debe ser uno de los jugadores del bracket' }, { status: 400 })
    }

    const loserId = winnerId === bracket.player1Id ? bracket.player2Id : bracket.player1Id

    await prisma.$transaction(async (tx) => {
      // Update bracket with winner
      await tx.tournamentBracket.update({
        where: { id: bracketId },
        data: { winnerId },
      })

      // Create or update the match record
      if (bracket.matchId) {
        await tx.match.update({
          where: { id: bracket.matchId },
          data: {
            score,
            player1Result: winnerId === bracket.player1Id ? 'WIN' : 'LOSS',
            player2Result: winnerId === bracket.player2Id ? 'WIN' : 'LOSS',
            player1Confirmed: true,
            player2Confirmed: true,
          },
        })
      } else {
        const match = await tx.match.create({
          data: {
            player1Id: bracket.player1Id!,
            player2Id: bracket.player2Id!,
            score,
            player1Result: winnerId === bracket.player1Id ? 'WIN' : 'LOSS',
            player2Result: winnerId === bracket.player2Id ? 'WIN' : 'LOSS',
            player1Confirmed: true,
            player2Confirmed: true,
            playedAt: new Date(),
            sportId: tournament.sportId,
          },
        })
        await tx.tournamentBracket.update({
          where: { id: bracketId },
          data: { matchId: match.id },
        })
      }

      // Mark loser as eliminated
      await tx.tournamentParticipant.updateMany({
        where: { tournamentId, profileId: loserId },
        data: { eliminated: true },
      })

      // Advance winner to next round
      const maxRound = Math.max(...tournament.brackets.map((b) => b.round))

      if (bracket.round < maxRound) {
        // Find the next bracket slot (round+1, position = floor(position/2))
        const nextPosition = Math.floor(bracket.position / 2)
        const nextBracket = tournament.brackets.find(
          (b) => b.round === bracket.round + 1 && b.position === nextPosition
        )

        if (nextBracket) {
          // Place winner in the correct slot (even position → player1, odd → player2)
          const isPlayer1Slot = bracket.position % 2 === 0
          await tx.tournamentBracket.update({
            where: { id: nextBracket.id },
            data: isPlayer1Slot ? { player1Id: winnerId } : { player2Id: winnerId },
          })
        }
      } else {
        // This was the final — tournament is complete
        await tx.tournament.update({
          where: { id: tournamentId },
          data: { status: 'COMPLETED' },
        })

        // Set final positions
        await tx.tournamentParticipant.updateMany({
          where: { tournamentId, profileId: winnerId },
          data: { finalPosition: 1 },
        })
        await tx.tournamentParticipant.updateMany({
          where: { tournamentId, profileId: loserId },
          data: { finalPosition: 2 },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Update bracket error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
