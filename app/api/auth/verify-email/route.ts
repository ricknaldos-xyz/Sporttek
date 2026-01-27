import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, markTokenAsUsed } from '@/lib/tokens'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token es requerido' },
        { status: 400 }
      )
    }

    // Verify the token
    const result = await verifyToken(token, 'EMAIL_VERIFICATION')

    if (!result.valid || !result.userId) {
      return NextResponse.json(
        { error: result.error || 'Token invalido' },
        { status: 400 }
      )
    }

    // Update user emailVerified
    await prisma.user.update({
      where: { id: result.userId },
      data: { emailVerified: new Date() },
    })

    // Mark token as used
    await markTokenAsUsed(token)

    return NextResponse.json({
      message: 'Email verificado exitosamente',
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Error al verificar el email' },
      { status: 500 }
    )
  }
}
