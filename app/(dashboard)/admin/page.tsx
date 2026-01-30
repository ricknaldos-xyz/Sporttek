'use client'

import { useState, useEffect, useCallback } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassButton } from '@/components/ui/glass-button'
import {
  Users, Brain, Shield, AlertTriangle, UserCheck, Building2,
  CalendarDays, Trophy, Swords, BarChart3, RefreshCw,
} from 'lucide-react'
import { logger } from '@/lib/logger'
import Link from 'next/link'

interface DashboardData {
  kpis: { totalUsers: number; activeToday: number; newThisWeek: number }
  pending: { unreviewedReports: number; pendingCoaches: number; pendingProviders: number; pendingBookings: number }
  quickStats: { analysesCompleted: number; matchesPlayed: number; tournamentsActive: number }
  recentActivity: Array<{ id: string; name: string | null; email: string; createdAt: string; role: string }>
}

function SkeletonCard() {
  return (
    <GlassCard intensity="light">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
        <div className="h-8 w-16 bg-muted-foreground/20 rounded" />
      </div>
    </GlassCard>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (res.ok) setData(await res.json())
    } catch (error) {
      logger.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const fmt = (n: number) => n.toLocaleString()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Resumen general de la plataforma</p>
          </div>
        </div>
        <GlassButton variant="ghost" size="sm" onClick={() => { setLoading(true); fetchDashboard() }}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </GlassButton>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : data ? (
          <>
            <GlassCard intensity="light">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                <span className="text-sm font-medium text-muted-foreground">Total Usuarios</span>
              </div>
              <p className="text-3xl font-bold">{fmt(data.kpis.totalUsers)}</p>
              <div className="flex gap-2 mt-2">
                <GlassBadge variant="success" size="sm">+{fmt(data.kpis.newThisWeek)} esta semana</GlassBadge>
              </div>
            </GlassCard>
            <GlassCard intensity="light">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></div>
                <span className="text-sm font-medium text-muted-foreground">Activos Hoy</span>
              </div>
              <p className="text-3xl font-bold">{fmt(data.kpis.activeToday)}</p>
            </GlassCard>
            <GlassCard intensity="light">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10"><Brain className="h-5 w-5 text-primary" /></div>
                <span className="text-sm font-medium text-muted-foreground">Analisis Completados</span>
              </div>
              <p className="text-3xl font-bold">{fmt(data.quickStats.analysesCompleted)}</p>
            </GlassCard>
          </>
        ) : null}
      </div>

      {/* Pending Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Acciones Pendientes</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : data ? (
            <>
              <Link href="/admin/moderation">
                <GlassCard intensity="light" className="hover:border-destructive/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
                    <span className="text-sm text-muted-foreground">Reportes</span>
                  </div>
                  <p className="text-2xl font-bold">{fmt(data.pending.unreviewedReports)}</p>
                </GlassCard>
              </Link>
              <Link href="/admin/coaches">
                <GlassCard intensity="light" className="hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10"><UserCheck className="h-5 w-5 text-primary" /></div>
                    <span className="text-sm text-muted-foreground">Coaches Pendientes</span>
                  </div>
                  <p className="text-2xl font-bold">{fmt(data.pending.pendingCoaches)}</p>
                </GlassCard>
              </Link>
              <Link href="/admin/providers">
                <GlassCard intensity="light" className="hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                    <span className="text-sm text-muted-foreground">Proveedores Pendientes</span>
                  </div>
                  <p className="text-2xl font-bold">{fmt(data.pending.pendingProviders)}</p>
                </GlassCard>
              </Link>
              <Link href="/admin/bookings">
                <GlassCard intensity="light" className="hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10"><CalendarDays className="h-5 w-5 text-primary" /></div>
                    <span className="text-sm text-muted-foreground">Reservas Pendientes</span>
                  </div>
                  <p className="text-2xl font-bold">{fmt(data.pending.pendingBookings)}</p>
                </GlassCard>
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Estadisticas Rapidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : data ? (
            <>
              <GlassCard intensity="light">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary/10"><Swords className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm text-muted-foreground">Partidos Jugados</span>
                </div>
                <p className="text-2xl font-bold">{fmt(data.quickStats.matchesPlayed)}</p>
              </GlassCard>
              <GlassCard intensity="light">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary/10"><Trophy className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm text-muted-foreground">Torneos Activos</span>
                </div>
                <p className="text-2xl font-bold">{fmt(data.quickStats.tournamentsActive)}</p>
              </GlassCard>
            </>
          ) : null}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ultimos Registros</h2>
        {loading ? (
          <SkeletonCard />
        ) : data?.recentActivity.length ? (
          <GlassCard intensity="light" padding="none">
            <div className="divide-y divide-glass">
              {data.recentActivity.map((u) => (
                <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <GlassBadge variant={u.role === 'ADMIN' ? 'destructive' : u.role === 'COACH' ? 'primary' : 'default'} size="sm">{u.role}</GlassBadge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(u.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard intensity="light">
            <p className="text-muted-foreground text-sm text-center py-4">Sin actividad reciente</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
