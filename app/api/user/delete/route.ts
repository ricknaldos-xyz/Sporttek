import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const deleteSchema = z.object({
  password: z.string().min(1, 'Contrasena requerida'),
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validated = deleteSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const isValid = await bcrypt.compare(validated.data.password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Contrasena incorrecta' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cuenta' },
      { status: 500 }
    )
  }
}
