import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

    // Get all SYSTEM_ANNOUNCEMENT notifications ordered by createdAt desc
    const allAnnouncements = await prisma.notification.findMany({
      where: { type: 'SYSTEM_ANNOUNCEMENT' },
      select: {
        title: true,
        body: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group by title+body within the same minute window
    const groupMap = new Map<string, { title: string; body: string | null; createdAt: Date; recipientCount: number }>()

    for (const n of allAnnouncements) {
      // Round createdAt to the nearest minute for grouping
      const minuteKey = new Date(
        Math.floor(n.createdAt.getTime() / 60000) * 60000,
      ).toISOString()
      const groupKey = `${n.title}||${n.body || ''}||${minuteKey}`

      const existing = groupMap.get(groupKey)
      if (existing) {
        existing.recipientCount++
      } else {
        groupMap.set(groupKey, {
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          recipientCount: 1,
        })
      }
    }

    const grouped = Array.from(groupMap.values())
    // Already sorted by createdAt desc due to query order
    const total = grouped.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit
    const announcements = grouped.slice(skip, skip + limit)

    return NextResponse.json({
      announcements,
      total,
      page,
      totalPages,
    })
  } catch (error) {
    logger.error('Admin notification history error:', error)
    return NextResponse.json(
      { error: 'Error al obtener historial de notificaciones' },
      { status: 500 },
    )
  }
}
