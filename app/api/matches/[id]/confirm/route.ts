import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateElo } from '@/lib/elo'
import { z } from 'zod'

const confirmSchema = z.object({
  result: z.enum(['WIN', 'LOSS', 'NO_SHOW']),
  score: z.string().optional(),
  sets: z.array(z.object({ p1: z.number(), p2: z.number() })).optional(),
})

// PATCH - Confirm match result and update ELO
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validated = confirmSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        player1: { select: { id: true, matchElo: true, matchesPlayed: true } },
        player2: { select: { id: true, matchElo: true, matchesPlayed: true } },
      },
    })

    if (!match) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
    }

    const isPlayer1 = match.player1Id === profile.id
    const isPlayer2 = match.player2Id === profile.id

    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ error: 'No eres parte de este partido' }, { status: 403 })
    }

    const { result, score, sets } = validated.data

    // Update match confirmation
    const updateData: Record<string, unknown> = {}
    if (isPlayer1) {
      updateData.player1Confirmed = true
      updateData.player1Result = result
    } else {
      updateData.player2Confirmed = true
      updateData.player2Result = result === 'WIN' ? 'LOSS' : result === 'LOSS' ? 'WIN' : result
    }

    if (score) updateData.score = score
    if (sets) updateData.sets = sets

    const updated = await prisma.match.update({
      where: { id },
      data: updateData,
    })

    // If both players confirmed, update ELO
    if (updated.player1Confirmed && updated.player2Confirmed) {
      const p1Won = updated.player1Result === 'WIN'
      const p2Won = updated.player2Result === 'WIN'

      if (p1Won || p2Won) {
        const p1Elo = calculateElo(
          match.player1.matchElo,
          match.player2.matchElo,
          p1Won ? 1 : 0,
          match.player1.matchesPlayed
        )
        const p2Elo = calculateElo(
          match.player2.matchElo,
          match.player1.matchElo,
          p2Won ? 1 : 0,
          match.player2.matchesPlayed
        )

        await Promise.all([
          prisma.playerProfile.update({
            where: { id: match.player1Id },
            data: {
              matchElo: p1Elo.newElo,
              matchesPlayed: { increment: 1 },
              ...(p1Won ? { matchesWon: { increment: 1 } } : {}),
            },
          }),
          prisma.playerProfile.update({
            where: { id: match.player2Id },
            data: {
              matchElo: p2Elo.newElo,
              matchesPlayed: { increment: 1 },
              ...(p2Won ? { matchesWon: { increment: 1 } } : {}),
            },
          }),
          prisma.match.update({
            where: { id },
            data: {
              player1EloChange: p1Elo.eloChange,
              player2EloChange: p2Elo.eloChange,
            },
          }),
        ])

        // Update challenge status if linked
        if (match.challengeId) {
          await prisma.challenge.update({
            where: { id: match.challengeId },
            data: { status: 'COMPLETED' },
          })
        }
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Confirm match error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
