import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Award, Lock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/date-utils'

export const metadata: Metadata = {
  title: 'Badges | SportTek',
  description: 'Tu coleccion de badges y logros deportivos.',
}

const BADGE_DEFINITIONS: Record<string, { emoji: string; name: string; description: string; category: string }> = {
  FIRST_ANALYSIS: { emoji: '🎯', name: 'Primer Analisis', description: 'Completa tu primer analisis de video', category: 'Progreso' },
  PLAN_COMPLETED: { emoji: '✅', name: 'Plan Completado', description: 'Completa un plan de entrenamiento', category: 'Progreso' },
  IMPROVEMENT: { emoji: '📈', name: 'Mejora Constante', description: 'Mejora tu puntuacion en un analisis', category: 'Progreso' },
  WEEK_PERFECT: { emoji: '⭐', name: 'Semana Perfecta', description: 'Entrena 7 dias seguidos en una semana', category: 'Racha' },
  DEDICATION_30: { emoji: '💪', name: '30 Dias Dedicado', description: 'Completa 30 dias de actividad', category: 'Racha' },
  STREAK_7: { emoji: '🔥', name: 'Racha de 7', description: 'Mantiene una racha de 7 dias', category: 'Racha' },
  STREAK_30: { emoji: '🔥', name: 'Racha de 30', description: 'Mantiene una racha de 30 dias', category: 'Racha' },
  STREAK_100: { emoji: '🌟', name: 'Racha de 100', description: 'Mantiene una racha de 100 dias', category: 'Racha' },
  FIRST_CHALLENGE: { emoji: '⚔️', name: 'Primer Desafio', description: 'Envia o acepta tu primer desafio', category: 'Competencia' },
  FIRST_MATCH: { emoji: '🎾', name: 'Primer Partido', description: 'Juega tu primer partido', category: 'Competencia' },
  TEN_MATCHES: { emoji: '🏅', name: '10 Partidos', description: 'Juega 10 partidos', category: 'Competencia' },
  FIFTY_MATCHES: { emoji: '🏆', name: '50 Partidos', description: 'Juega 50 partidos', category: 'Competencia' },
  FIRST_TOURNAMENT: { emoji: '🏟️', name: 'Primer Torneo', description: 'Participa en tu primer torneo', category: 'Competencia' },
  TOURNAMENT_WINNER: { emoji: '🏆', name: 'Campeon de Torneo', description: 'Gana un torneo', category: 'Competencia' },
  TOURNAMENT_FINALIST: { emoji: '🥈', name: 'Finalista de Torneo', description: 'Llega a la final de un torneo', category: 'Competencia' },
  TIER_QUINTA: { emoji: '🥉', name: 'Quinta Categoria', description: 'Alcanza la categoria Quinta', category: 'Tier' },
  TIER_CUARTA: { emoji: '🥈', name: 'Cuarta Categoria', description: 'Alcanza la categoria Cuarta', category: 'Tier' },
  TIER_TERCERA: { emoji: '🥇', name: 'Tercera Categoria', description: 'Alcanza la categoria Tercera', category: 'Tier' },
  TIER_SEGUNDA: { emoji: '💎', name: 'Segunda Categoria', description: 'Alcanza la categoria Segunda', category: 'Tier' },
  TIER_PRIMERA: { emoji: '👑', name: 'Primera Categoria', description: 'Alcanza la categoria Primera', category: 'Tier' },
  TOP_100_COUNTRY: { emoji: '🇵🇪', name: 'Top 100 Nacional', description: 'Entra al top 100 de tu pais', category: 'Ranking' },
  TOP_10_COUNTRY: { emoji: '🔟', name: 'Top 10 Nacional', description: 'Entra al top 10 de tu pais', category: 'Ranking' },
  NUMBER_ONE_COUNTRY: { emoji: '🏆', name: 'Numero 1 Nacional', description: 'Alcanza el primer puesto nacional', category: 'Ranking' },
  FIRST_FOLLOWER: { emoji: '👥', name: 'Primer Seguidor', description: 'Consigue tu primer seguidor', category: 'Social' },
  CLUB_FOUNDER: { emoji: '🏠', name: 'Fundador de Club', description: 'Crea un club en la comunidad', category: 'Social' },
  COACH_CERTIFIED: { emoji: '🎓', name: 'Coach Certificado', description: 'Verificacion como coach aprobada', category: 'Coach' },
}

const CATEGORIES = ['Progreso', 'Racha', 'Competencia', 'Tier', 'Ranking', 'Social', 'Coach']

export default async function BadgesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId: session.user.id },
    orderBy: { earnedAt: 'desc' },
  })

  const earnedTypes = new Set(earnedBadges.map((b) => b.badgeType))
  const totalEarned = earnedBadges.length
  const totalBadges = Object.keys(BADGE_DEFINITIONS).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Badges y Logros</h1>
          <p className="text-muted-foreground">
            {totalEarned} de {totalBadges} badges desbloqueados
          </p>
        </div>
        <GlassBadge variant="primary" size="lg">
          <Award className="h-4 w-4 mr-1.5" />
          {totalEarned}/{totalBadges}
        </GlassBadge>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${(totalEarned / totalBadges) * 100}%` }}
        />
      </div>

      {/* Badges by category */}
      {CATEGORIES.map((category) => {
        const badgesInCategory = Object.entries(BADGE_DEFINITIONS).filter(
          ([, def]) => def.category === category
        )
        if (badgesInCategory.length === 0) return null

        return (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {badgesInCategory.map(([type, def]) => {
                const earned = earnedBadges.find((b) => b.badgeType === type)
                const isLocked = !earned

                return (
                  <GlassCard
                    key={type}
                    intensity={isLocked ? 'ultralight' : 'light'}
                    padding="md"
                    hover={isLocked ? 'none' : 'glow'}
                    className={isLocked ? 'opacity-50 grayscale' : ''}
                  >
                    <div className="text-center">
                      <div className="relative inline-block">
                        <span className="text-4xl">{def.emoji}</span>
                        {isLocked && (
                          <div className="absolute -bottom-1 -right-1 glass-medium border-glass rounded-full p-1">
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mt-2">{def.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {def.description}
                      </p>
                      {earned && (
                        <p className="text-xs text-primary mt-2">
                          {formatRelativeTime(earned.earnedAt)}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
