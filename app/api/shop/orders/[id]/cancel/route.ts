import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateId } from '@/lib/validation'
import { getCulqiClient } from '@/lib/culqi'

const CANCELLABLE_STATUSES = ['PAID', 'PROCESSING']

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

    const order = await prisma.shopOrder.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        totalCents: true,
        culqiChargeId: true,
        userId: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
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

    // Attempt refund if order was paid via Culqi
    if (order.culqiChargeId) {
      try {
        const culqi = getCulqiClient()
        await culqi.refunds.createRefund({
          amount: order.totalCents,
          charge_id: order.culqiChargeId,
          reason: 'solicitud_del_comprador',
        })
      } catch (refundError) {
        logger.error('Culqi refund failed for shop order:', refundError)
        return NextResponse.json(
          { error: 'Error al procesar el reembolso. Contacta soporte.' },
          { status: 500 }
        )
      }
    }

    // Restore stock and cancel order in a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }

      await tx.shopOrder.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Cancel shop order error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
