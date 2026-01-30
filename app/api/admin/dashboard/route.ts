import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      activeToday,
      newThisWeek,
      unreviewedReports,
      pendingCoaches,
      pendingProviders,
      pendingBookings,
      analysesCompleted,
      matchesPlayed,
      tournamentsActive,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastLoginAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.report.count({ where: { resolved: false } }),
      prisma.coachProfile.count({ where: { verificationStatus: 'PENDING_VERIFICATION' } }),
      prisma.providerApplication.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.courtBooking.count({ where: { status: 'PENDING' } }),
      prisma.analysis.count({ where: { status: 'COMPLETED' } }),
      prisma.match.count(),
      prisma.tournament.count({ where: { status: { in: ['REGISTRATION', 'IN_PROGRESS'] } } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true, role: true },
      }),
    ])

    return NextResponse.json({
      kpis: { totalUsers, activeToday, newThisWeek },
      pending: { unreviewedReports, pendingCoaches, pendingProviders, pendingBookings },
      quickStats: { analysesCompleted, matchesPlayed, tournamentsActive },
      recentActivity: recentUsers,
    })
  } catch (error) {
    logger.error('Admin dashboard error:', error)
    return NextResponse.json({ error: 'Error al obtener dashboard' }, { status: 500 })
  }
}
