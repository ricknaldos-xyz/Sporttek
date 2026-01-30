import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Verify webhook authenticity via shared secret
  const webhookSecret = process.env.CULQI_WEBHOOK_SECRET
  const authHeader = request.headers.get('x-culqi-webhook-secret')

  if (!webhookSecret || authHeader !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = await request.json()

  try {
    const eventType = event.type || event.object

    switch (eventType) {
      case 'subscription.charge.succeeded':
      case 'charge.creation.succeeded': {
        // Update subscription period end if it's a subscription charge
        const metadata = event.data?.metadata || event.metadata || {}
        const userId = metadata.userId

        if (userId && metadata.type === 'subscription') {
          const periodEnd = new Date()
          periodEnd.setDate(periodEnd.getDate() + 30)

          await prisma.user.update({
            where: { id: userId },
            data: { culqiCurrentPeriodEnd: periodEnd },
          })
        }

        // Handle one-time payment for shop orders
        if (metadata.type === 'shop_order' && metadata.orderId) {
          const order = await prisma.shopOrder.findUnique({
            where: { id: metadata.orderId },
            select: { status: true },
          })
          if (order && order.status === 'PENDING_PAYMENT') {
            await prisma.shopOrder.update({
              where: { id: metadata.orderId },
              data: {
                status: 'PAID',
                culqiChargeId: event.data?.id || event.id,
                paidAt: new Date(),
              },
            })
          }
        }

        // Handle stringing order
        if (metadata.type === 'stringing_order' && metadata.orderId) {
          const order = await prisma.stringingOrder.findUnique({
            where: { id: metadata.orderId },
            select: { status: true },
          })
          if (order && order.status === 'PENDING_PAYMENT') {
            await prisma.stringingOrder.update({
              where: { id: metadata.orderId },
              data: {
                status: 'CONFIRMED',
                culqiChargeId: event.data?.id || event.id,
                paidAt: new Date(),
                confirmedAt: new Date(),
              },
            })
          }
        }
        break
      }

      case 'subscription.charge.failed': {
        const metadata = event.data?.metadata || event.metadata || {}
        const userId = metadata.userId
        if (userId) {
          logger.warn('Subscription charge failed', { userId })
        }
        break
      }

      case 'subscription.deleted':
      case 'subscription.cancelled': {
        const metadata = event.data?.metadata || event.metadata || {}
        const userId = metadata.userId
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: 'FREE',
              culqiSubscriptionId: null,
              culqiCurrentPeriodEnd: null,
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Culqi webhook error', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
