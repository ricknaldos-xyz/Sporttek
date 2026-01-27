import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const STALE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS)

    // Find analyses that have been processing for too long
    const staleAnalyses = await prisma.analysis.findMany({
      where: {
        status: 'PROCESSING',
        processingStartedAt: {
          lt: staleThreshold,
        },
      },
      select: {
        id: true,
        processingStartedAt: true,
        retryCount: true,
      },
    })

    if (staleAnalyses.length === 0) {
      return NextResponse.json({
        message: 'No stale analyses found',
        checked: 0,
        marked: 0,
      })
    }

    // Mark stale analyses as failed
    const result = await prisma.analysis.updateMany({
      where: {
        id: { in: staleAnalyses.map((a) => a.id) },
      },
      data: {
        status: 'FAILED',
        errorMessage: 'El analisis excedio el tiempo limite. Puedes intentarlo de nuevo.',
      },
    })

    console.log(`Marked ${result.count} stale analyses as failed`)

    return NextResponse.json({
      message: 'Stale analyses check completed',
      checked: staleAnalyses.length,
      marked: result.count,
    })
  } catch (error) {
    console.error('Stale analyses check error:', error)
    return NextResponse.json(
      { error: 'Error checking stale analyses' },
      { status: 500 }
    )
  }
}
