import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Video, ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { formatRelativeTime } from '@/lib/utils'

async function getAnalyses(userId: string) {
  return prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      technique: {
        include: { sport: true },
      },
      variant: true,
      _count: {
        select: { issues: true },
      },
    },
  })
}

export default async function AnalysesPage() {
  const session = await auth()
  if (!session?.user) return null

  const analyses = await getAnalyses(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Analisis</h1>
          <p className="text-muted-foreground">
            Historial de todos tus analisis de tecnica
          </p>
        </div>
        <GlassButton variant="solid" asChild>
          <Link href="/analyze">
            <Video className="mr-2 h-4 w-4" />
            Nuevo Analisis
          </Link>
        </GlassButton>
      </div>

      {analyses.length > 0 ? (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <GlassCard
              key={analysis.id}
              intensity="light"
              padding="lg"
              hover="lift"
              className="flex items-center gap-4 cursor-pointer"
              asChild
            >
              <Link href={`/analyses/${analysis.id}`}>
                <div className="w-16 h-16 glass-primary border-glass rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {analysis.technique.sport.slug === 'tennis' ? '🎾' : '🏅'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{analysis.technique.name}</h3>
                    {analysis.variant && (
                      <span className="text-sm text-muted-foreground">
                        - {analysis.variant.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.technique.sport.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
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
                    {analysis._count.issues > 0 && (
                      <span className="text-muted-foreground">
                        {analysis._count.issues} problema
                        {analysis._count.issues > 1 ? 's' : ''} detectado
                        {analysis._count.issues > 1 ? 's' : ''}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {formatRelativeTime(analysis.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {analysis.overallScore && (
                    <div className="text-center glass-primary border-glass rounded-xl px-3 py-2">
                      <div className="text-2xl font-bold text-primary">
                        {analysis.overallScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">/10</div>
                    </div>
                  )}
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard intensity="light" padding="xl" className="text-center">
          <div className="glass-ultralight border-glass rounded-2xl p-4 w-fit mx-auto mb-4">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tienes analisis aun</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sube tu primer video para que nuestra IA analice tu tecnica y te de
            recomendaciones personalizadas
          </p>
          <GlassButton variant="solid" size="lg" asChild>
            <Link href="/analyze">Crear primer analisis</Link>
          </GlassButton>
        </GlassCard>
      )}
    </div>
  )
}
