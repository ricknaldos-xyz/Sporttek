import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function PATCH() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Complete onboarding error:', error)
    return NextResponse.json({ error: 'Error al completar onboarding' }, { status: 500 })
  }
}
