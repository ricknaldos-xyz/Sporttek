import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateId } from '@/lib/validation'
import { getCulqiClient } from '@/lib/culqi'

const CANCELLABLE_STATUSES = ['PENDING_PAYMENT', 'CONFIRMED']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    if (!validateId(id)) {
      return NextResponse.json(
        { error: 'ID invalido' },
        { status: 400 }
      )
    }

    const order = await prisma.stringingOrder.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        totalCents: true,
        culqiChargeId: true,
        userId: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { error: 'Este pedido no puede ser cancelado en su estado actual' },
        { status: 400 }
      )
    }

    // Attempt refund if order was paid
    if (order.culqiChargeId) {
      try {
        const culqi = getCulqiClient()
        await culqi.refunds.createRefund({
          amount: order.totalCents,
          charge_id: order.culqiChargeId,
          reason: 'solicitud_del_comprador',
        })
      } catch (refundError) {
        logger.error('Culqi refund failed for stringing order:', refundError)
        return NextResponse.json(
          { error: 'Error al procesar el reembolso. Contacta soporte.' },
          { status: 500 }
        )
      }
    }

    await prisma.stringingOrder.update({
      where: { id },
      data: { status: 'STRINGING_CANCELLED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Cancel stringing order error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
