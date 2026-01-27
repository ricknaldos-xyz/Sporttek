import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Dumbbell, Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

async function getTrainingPlans(userId: string) {
  return prisma.trainingPlan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      analysis: {
        include: {
          technique: {
            include: { sport: true },
          },
        },
      },
      _count: {
        select: { exercises: true, progressLogs: true },
      },
    },
  })
}

const statusVariants = {
  ACTIVE: 'success' as const,
  PAUSED: 'warning' as const,
  COMPLETED: 'primary' as const,
  ABANDONED: 'default' as const,
}

const statusLabels = {
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  COMPLETED: 'Completado',
  ABANDONED: 'Abandonado',
}

export default async function TrainingPage() {
  const session = await auth()
  if (!session?.user) return null

  const plans = await getTrainingPlans(session.user.id)
  const activePlans = plans.filter((p) => p.status === 'ACTIVE')
  const completedPlans = plans.filter((p) => p.status === 'COMPLETED')
  const otherPlans = plans.filter(
    (p) => p.status !== 'ACTIVE' && p.status !== 'COMPLETED'
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Entrenamiento</h1>
        <p className="text-muted-foreground">
          Tus planes de entrenamiento personalizados
        </p>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Planes Activos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activePlans.map((plan) => (
              <GlassCard
                key={plan.id}
                intensity="primary"
                padding="lg"
                hover="glow"
                className="cursor-pointer"
                asChild
              >
                <Link href={`/training/${plan.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.analysis.technique.name} -{' '}
                        {plan.analysis.technique.sport.name}
                      </p>
                    </div>
                    <GlassBadge variant={statusVariants[plan.status]}>
                      {statusLabels[plan.status]}
                    </GlassBadge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {plan.durationDays} dias
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      {plan._count.exercises} ejercicios
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progreso</span>
                      <span>
                        {plan._count.progressLogs} / {plan._count.exercises * plan.durationDays}
                      </span>
                    </div>
                    <div className="h-2 glass-ultralight border-glass rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (plan._count.progressLogs /
                              (plan._count.exercises * plan.durationDays)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Planes Completados
          </h2>
          <div className="grid gap-4">
            {completedPlans.map((plan) => (
              <GlassCard
                key={plan.id}
                intensity="light"
                padding="md"
                hover="lift"
                className="flex items-center gap-4 cursor-pointer"
                asChild
              >
                <Link href={`/training/${plan.id}`}>
                  <div className="flex-1">
                    <h3 className="font-medium">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.analysis.technique.name} • Completado el{' '}
                      {plan.completedAt ? formatDate(plan.completedAt) : 'N/A'}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Other Plans */}
      {otherPlans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Otros Planes</h2>
          <div className="grid gap-4">
            {otherPlans.map((plan) => (
              <GlassCard
                key={plan.id}
                intensity="ultralight"
                padding="md"
                hover="lift"
                className="flex items-center gap-4 cursor-pointer"
                asChild
              >
                <Link href={`/training/${plan.id}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{plan.title}</h3>
                      <GlassBadge variant={statusVariants[plan.status]}>
                        {statusLabels[plan.status]}
                      </GlassBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.analysis.technique.name}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {plans.length === 0 && (
        <GlassCard intensity="light" padding="xl" className="text-center">
          <div className="glass-ultralight border-glass rounded-2xl p-4 w-fit mx-auto mb-4">
            <Dumbbell className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            No tienes planes de entrenamiento
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Primero realiza un analisis de tu tecnica, y luego podras generar un
            plan de entrenamiento personalizado
          </p>
          <GlassButton variant="solid" asChild>
            <Link href="/analyze">Crear Analisis</Link>
          </GlassButton>
        </GlassCard>
      )}
    </div>
  )
}
