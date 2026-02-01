import type { Metadata } from 'next'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Mi Perfil | SportTek',
  description: 'Gestiona tu perfil, revisa tus estadisticas y preferencias en SportTek.',
}
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Calendar, Trophy, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'

async function getUserStats(userId: string) {
  const [user, analysesCount, plansCount, completedPlans] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoriteSports: {
          include: { sport: true },
        },
      },
    }),
    prisma.analysis.count({ where: { userId } }),
    prisma.trainingPlan.count({ where: { userId } }),
    prisma.trainingPlan.count({ where: { userId, status: 'COMPLETED' } }),
  ])

  return { user, analysesCount, plansCount, completedPlans }
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { user, analysesCount, plansCount, completedPlans } = await getUserStats(
    session.user.id
  )

  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      {/* User Info */}
      <GlassCard intensity="light" padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 glass-primary border-glass rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Miembro desde:</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Plan:</span>
            <GlassBadge variant="primary">{user.subscription}</GlassBadge>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <GlassCard intensity="light" padding="lg">
        <h3 className="font-semibold mb-4">Estadisticas</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 glass-ultralight border-glass rounded-xl">
            <div className="text-2xl font-bold text-primary">{analysesCount}</div>
            <div className="text-sm text-muted-foreground">Analisis</div>
          </div>
          <div className="text-center p-4 glass-ultralight border-glass rounded-xl">
            <div className="text-2xl font-bold text-primary">{plansCount}</div>
            <div className="text-sm text-muted-foreground">Planes</div>
          </div>
          <div className="text-center p-4 glass-ultralight border-glass rounded-xl">
            <div className="text-2xl font-bold text-primary">{completedPlans}</div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <GlassCard intensity="light" padding="md" hover="lift" asChild>
          <Link href="/profile/player" className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Perfil de Jugador</p>
              <p className="text-sm text-muted-foreground">Score, tecnicas y estadisticas</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </GlassCard>
        <GlassCard intensity="light" padding="md" hover="lift" asChild>
          <Link href="/profile/settings" className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Configuracion</p>
              <p className="text-sm text-muted-foreground">Privacidad, suscripcion y mas</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </GlassCard>
      </div>

      {/* Favorite Sports */}
      {user.favoriteSports.length > 0 && (
        <GlassCard intensity="light" padding="lg">
          <h3 className="font-semibold mb-4">Deportes Favoritos</h3>
          <div className="flex flex-wrap gap-2">
            {user.favoriteSports.map((fs) => (
              <GlassBadge key={fs.id} variant="default">
                {fs.sport.name}
                {fs.level && (
                  <span className="text-muted-foreground ml-1">({fs.level})</span>
                )}
              </GlassBadge>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
