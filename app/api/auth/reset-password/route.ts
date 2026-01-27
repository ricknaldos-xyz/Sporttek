import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyToken, markTokenAsUsed } from '@/lib/tokens'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contrasena son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contrasena debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verify the token
    const result = await verifyToken(token, 'PASSWORD_RESET')

    if (!result.valid || !result.userId) {
      return NextResponse.json(
        { error: result.error || 'Token invalido' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { id: result.userId },
      data: { password: hashedPassword },
    })

    // Mark token as used
    await markTokenAsUsed(token)

    return NextResponse.json({
      message: 'Contrasena actualizada exitosamente',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Error al restablecer la contrasena' },
      { status: 500 }
    )
  }
}
