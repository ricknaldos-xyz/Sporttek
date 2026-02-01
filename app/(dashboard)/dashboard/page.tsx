import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Dashboard | SportTek',
  description: 'Tu panel de entrenamiento deportivo. Revisa tus analisis, planes y progreso.',
}
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Video, History, Dumbbell, TrendingUp, ArrowRight, Trophy, Swords, Flame } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { formatRelativeTime } from '@/lib/date-utils'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { EmailVerificationBanner } from '@/components/banners/EmailVerificationBanner'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import { StreakWidget } from '@/components/gamification/StreakWidget'
import { GoalWidget } from '@/components/goals/GoalWidget'
import { RecentBadgesCard } from '@/components/dashboard/RecentBadgesCard'
import { ActivityHeatmap } from '@/components/gamification/ActivityHeatmap'
import { DashboardRankingCard } from '@/components/dashboard/DashboardRankingCard'

async function getStats(userId: string, sportSlug: string) {
  const sportFilter = { technique: { sport: { slug: sportSlug } } }

  const [analysesCount, plansCount, completedPlans, recentAnalyses, user, userSportsCount, userSports] =
    await Promise.all([
      prisma.analysis.count({ where: { userId, ...sportFilter } }),
      prisma.trainingPlan.count({
        where: { userId, analysis: sportFilter },
      }),
      prisma.trainingPlan.count({
        where: { userId, status: 'COMPLETED', analysis: sportFilter },
      }),
      prisma.analysis.findMany({
        where: { userId, ...sportFilter },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          technique: {
            include: { sport: true },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { emailVerified: true, email: true },
      }),
      prisma.userSport.count({ where: { userId } }),
      prisma.userSport.findMany({
        where: { userId },
        include: {
          sport: {
            include: {
              techniques: { select: { id: true } },
            },
          },
        },
      }),
    ])

  return { analysesCount, plansCount, completedPlans, recentAnalyses, user, userSportsCount, userSports, sportSlug }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const cookieStore = await cookies()
  const sportSlug = cookieStore.get('activeSportSlug')?.value || 'tennis'

  const stats = await getStats(session.user.id, sportSlug)

  // Determine user stage for progressive dashboard
  const stage = stats.analysesCount === 0 ? 'new' : stats.analysesCount < 3 ? 'early' : 'active'

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {session.user.name?.split(' ')[0] || 'deportista'}!
        </h1>
        <p className="text-muted-foreground">
          {stage === 'new'
            ? 'Comienza subiendo tu primer video para descubrir tu nivel'
            : stage === 'early'
            ? 'Sigue analizando tu tecnica para mejorar tu skill score'
            : 'Bienvenido a tu panel de entrenamiento'}
        </p>
      </div>

      {/* Email Verification Banner */}
      {stats.user && !stats.user.emailVerified && (
        <EmailVerificationBanner userEmail={stats.user.email} />
      )}

      {/* ========== NEW USER STAGE ========== */}
      {stage === 'new' && (
        <>
          {/* Sport check */}
          {stats.userSportsCount === 0 && (
            <GlassCard intensity="primary" padding="xl" className="text-center">
              <div className="glass-light border-glass rounded-2xl p-4 w-fit mx-auto mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Configura tu deporte</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Antes de analizar tu tecnica, selecciona el deporte que practicas para personalizar tu experiencia.
              </p>
              <GlassButton variant="solid" size="lg" asChild>
                <Link href="/onboarding/sport">Seleccionar deporte</Link>
              </GlassButton>
            </GlassCard>
          )}

          {/* First analysis CTA — hero card */}
          {stats.userSportsCount > 0 && (
            <GlassCard intensity="primary" padding="none" className="overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 p-8 lg:p-12 text-center">
                <div className="glass-light border-glass rounded-2xl p-4 w-fit mx-auto mb-6">
                  <Video className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Sube tu primer video</h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                  Graba 10-30 segundos de tu tecnica con el movil. La IA analizara tu movimiento, detectara errores y te dara un skill score.
                </p>
                <GlassButton variant="solid" size="xl" asChild>
                  <Link href="/analyze">
                    Crear primer analisis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </GlassButton>
                <p className="text-sm text-muted-foreground mt-4">
                  El analisis toma 2-5 minutos
                </p>
              </div>
            </GlassCard>
          )}

          {/* Onboarding Checklist */}
          <OnboardingChecklist
            analysisCount={stats.analysesCount}
            trainingPlanCount={stats.plansCount}
            hasSport={stats.userSportsCount > 0}
          />
        </>
      )}

      {/* ========== EARLY USER STAGE (1-2 analyses) ========== */}
      {stage === 'early' && (
        <>
          {/* Onboarding Checklist */}
          <OnboardingChecklist
            analysisCount={stats.analysesCount}
            trainingPlanCount={stats.plansCount}
            hasSport={stats.userSportsCount > 0}
          />

          {/* Ranking Progress */}
          <DashboardRankingCard />

          {/* Streak Widget */}
          <StreakWidget />

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard
              intensity="primary"
              padding="lg"
              hover="glow"
              className="cursor-pointer"
              asChild
            >
              <Link href="/analyze">
                <div className="glass-light border-glass rounded-xl p-2 w-fit mb-3">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Nuevo Analisis</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Sube otro video para mejorar tu skill score
                </p>
              </Link>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.analysesCount}</h3>
              <p className="text-muted-foreground text-sm">Analisis realizados</p>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.plansCount}</h3>
              <p className="text-muted-foreground text-sm">Planes de entrenamiento</p>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.completedPlans}</h3>
              <p className="text-muted-foreground text-sm">Planes completados</p>
            </GlassCard>
          </div>

          {/* Recent Analyses */}
          <RecentAnalyses analyses={stats.recentAnalyses} />
        </>
      )}

      {/* ========== ACTIVE USER STAGE (3+ analyses) ========== */}
      {stage === 'active' && (
        <>
          {/* Ranking Progress */}
          <DashboardRankingCard />

          {/* Streak Widget */}
          <StreakWidget />

          {/* Goal Widget */}
          <GoalWidget />

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard
              intensity="primary"
              padding="lg"
              hover="glow"
              className="cursor-pointer"
              asChild
            >
              <Link href="/analyze">
                <div className="glass-light border-glass rounded-xl p-2 w-fit mb-3">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Nuevo Analisis</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Sube un video para analizar tu tecnica
                </p>
              </Link>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.analysesCount}</h3>
              <p className="text-muted-foreground text-sm">Analisis realizados</p>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.plansCount}</h3>
              <p className="text-muted-foreground text-sm">Planes de entrenamiento</p>
            </GlassCard>

            <GlassCard intensity="light" padding="lg" hover="lift">
              <div className="glass-ultralight border-glass rounded-xl p-2 w-fit mb-3">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{stats.completedPlans}</h3>
              <p className="text-muted-foreground text-sm">Planes completados</p>
            </GlassCard>
          </div>

          {/* Charts */}
          <DashboardCharts />

          {/* Activity Heatmap */}
          <ActivityHeatmap />

          {/* Recent Badges */}
          <RecentBadgesCard />

          {/* Recent Analyses */}
          <RecentAnalyses analyses={stats.recentAnalyses} />

          {/* Sports Available */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Deportes disponibles</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.userSports.length > 0 ? (
                stats.userSports.map((us) => (
                  <GlassCard
                    key={us.sport.id}
                    intensity={us.sport.slug === stats.sportSlug ? 'primary' : 'light'}
                    padding="md"
                    hover="glow"
                    className="flex items-center gap-4 cursor-pointer"
                    asChild
                  >
                    <Link href={`/analyze?sport=${us.sport.slug}`}>
                      <div className={`w-12 h-12 ${us.sport.slug === stats.sportSlug ? 'glass-primary' : 'glass-ultralight'} border-glass rounded-xl flex items-center justify-center text-2xl`}>
                        {us.sport.icon || us.sport.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{us.sport.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {us.sport.techniques.length} {us.sport.techniques.length === 1 ? 'tecnica' : 'tecnicas'}
                        </p>
                      </div>
                    </Link>
                  </GlassCard>
                ))
              ) : (
                <GlassCard intensity="light" padding="md" className="col-span-full text-center">
                  <p className="text-muted-foreground text-sm">
                    No tienes deportes configurados.{' '}
                    <Link href="/onboarding/sport" className="text-primary underline">Agrega uno</Link>
                  </p>
                </GlassCard>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Extracted component for recent analyses (shared between stages)
function RecentAnalyses({ analyses }: { analyses: Array<{
  id: string
  status: string
  overallScore: number | null
  createdAt: Date
  technique: { name: string; sport: { name: string } }
}> }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Analisis recientes</h2>
        <GlassButton variant="ghost" size="sm" asChild>
          <Link href="/analyses">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </GlassButton>
      </div>

      {analyses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <GlassCard
              key={analysis.id}
              intensity="light"
              padding="md"
              hover="lift"
              className="cursor-pointer"
              asChild
            >
              <Link href={`/analyses/${analysis.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{analysis.technique.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.technique.sport.name}
                    </p>
                  </div>
                  {analysis.overallScore && (
                    <GlassBadge variant="primary">
                      {analysis.overallScore.toFixed(1)}/10
                    </GlassBadge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <GlassBadge
                    variant={
                      analysis.status === 'COMPLETED'
                        ? 'success'
                        : analysis.status === 'PROCESSING'
                        ? 'warning'
                        : analysis.status === 'FAILED'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {analysis.status === 'COMPLETED'
                      ? 'Completado'
                      : analysis.status === 'PROCESSING'
                      ? 'Procesando'
                      : analysis.status === 'FAILED'
                      ? 'Error'
                      : 'Pendiente'}
                  </GlassBadge>
                  <span>{formatRelativeTime(analysis.createdAt)}</span>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard intensity="light" padding="xl" className="text-center">
          <div className="glass-ultralight border-glass rounded-2xl p-4 w-fit mx-auto mb-4">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No tienes analisis aun</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sube tu primer video para comenzar a mejorar tu tecnica
          </p>
          <GlassButton variant="solid" asChild>
            <Link href="/analyze">Crear primer analisis</Link>
          </GlassButton>
        </GlassCard>
      )}
    </div>
  )
}
