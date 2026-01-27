import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { StringingOrderStatus } from '@prisma/client'

const updateStringingOrderSchema = z.object({
  status: z.nativeEnum(StringingOrderStatus).optional(),
  internalNotes: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { id } = await params

    const order = await prisma.stringingOrder.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        workshop: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error al obtener orden de encordado:', error)
    return NextResponse.json({ error: 'Error al obtener orden de encordado' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateStringingOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.stringingOrder.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}

    if (parsed.data.internalNotes !== undefined) {
      data.internalNotes = parsed.data.internalNotes
    }

    if (parsed.data.status) {
      // Validate state transition
      const VALID_TRANSITIONS: Record<string, string[]> = {
        PENDING_PAYMENT: ['CONFIRMED', 'STRINGING_CANCELLED'],
        CONFIRMED: ['PICKUP_SCHEDULED', 'STRINGING_CANCELLED'],
        PICKUP_SCHEDULED: ['RECEIVED_AT_WORKSHOP', 'STRINGING_CANCELLED'],
        RECEIVED_AT_WORKSHOP: ['IN_PROGRESS', 'STRINGING_CANCELLED'],
        IN_PROGRESS: ['STRINGING_COMPLETED'],
        STRINGING_COMPLETED: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'],
        READY_FOR_PICKUP: ['DELIVERED'],
        OUT_FOR_DELIVERY: ['DELIVERED'],
        DELIVERED: [],
        STRINGING_CANCELLED: [],
      }

      if (!VALID_TRANSITIONS[existing.status]?.includes(parsed.data.status)) {
        return NextResponse.json(
          { error: `Transicion de estado no valida: ${existing.status} -> ${parsed.data.status}` },
          { status: 400 }
        )
      }

      data.status = parsed.data.status

      const statusTimestamps: Record<string, string> = {
        CONFIRMED: 'confirmedAt',
        RECEIVED_AT_WORKSHOP: 'receivedAt',
        STRINGING_COMPLETED: 'completedAt',
        DELIVERED: 'deliveredAt',
        STRINGING_CANCELLED: 'cancelledAt',
      }

      const timestampField = statusTimestamps[parsed.data.status]
      if (timestampField) {
        data[timestampField] = new Date()
      }
    }

    const order = await prisma.stringingOrder.update({
      where: { id },
      data,
      include: {
        user: { select: { name: true, email: true } },
        workshop: { select: { name: true } },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error al actualizar orden de encordado:', error)
    return NextResponse.json({ error: 'Error al actualizar orden de encordado' }, { status: 500 })
  }
}
