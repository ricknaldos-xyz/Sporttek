import { NextRequest, NextResponse } from 'next/server'
import { computeAllRankings } from '@/lib/rankings'

// POST - Cron job to compute rankings daily
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for Vercel Cron Jobs
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await computeAllRankings()

    return NextResponse.json({ message: 'Rankings computed successfully' })
  } catch (error) {
    console.error('Compute rankings cron error:', error)
    return NextResponse.json(
      { error: 'Error computing rankings' },
      { status: 500 }
    )
  }
}
