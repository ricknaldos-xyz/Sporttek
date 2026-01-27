import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Expire old pending challenges
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await prisma.challenge.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    })

    return NextResponse.json({
      message: `Expired ${result.count} challenges`,
    })
  } catch (error) {
    console.error('Expire challenges cron error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
