import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Mi Perfil de Jugador | SportTek',
  description: 'Tu perfil de jugador con Skill Score, radar de tecnicas y estadisticas de partidos.',
}
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { SkillScoreDisplay } from '@/components/player/SkillScoreDisplay'
import { TechniqueRadarChart } from '@/components/player/TechniqueRadarChart'
import { Pencil, MapPin, Calendar, Hand, Trophy, Target } from 'lucide-react'
import Link from 'next/link'
import { ProfileRankingGuide } from '@/components/player/ProfileRankingGuide'

export default async function PlayerProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Read active sport from cookie (set by SportContext via localStorage)
  const cookieStore = await cookies()
  const sportSlug = cookieStore.get('activeSportSlug')?.value || 'tennis'

  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      sportProfiles: {
        where: { sport: { slug: sportSlug } },
        include: {
          sport: { select: { name: true, slug: true } },
          techniqueScores: {
            include: {
              technique: {
                select: { id: true, name: true, slug: true },
              },
            },
            orderBy: { bestScore: 'desc' },
          },
        },
        take: 1,
      },
      techniqueScores: {
        include: {
          technique: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { bestScore: 'desc' },
      },
    },
  })

  if (!profile) {
    redirect('/profile/player/edit')
  }

  // Use sport-specific data if available, fall back to profile-level
  const sportProfile = profile.sportProfiles[0]
  const compositeScore = sportProfile?.compositeScore ?? profile.compositeScore
  const skillTier = sportProfile?.skillTier ?? profile.skillTier
  const totalAnalyses = sportProfile?.totalAnalyses ?? profile.totalAnalyses
  const totalTechniques = sportProfile?.totalTechniques ?? profile.totalTechniques
  const countryRank = sportProfile?.countryRank ?? profile.countryRank
  const matchElo = sportProfile?.matchElo ?? profile.matchElo
  const matchesPlayed = sportProfile?.matchesPlayed ?? profile.matchesPlayed
  const matchesWon = sportProfile?.matchesWon ?? profile.matchesWon
  const techniqueScores = sportProfile?.techniqueScores ?? profile.techniqueScores
  const sportName = sportProfile?.sport.name ?? 'Tenis'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi Perfil de Jugador</h1>
          <p className="text-sm text-muted-foreground">{sportName}</p>
        </div>
        <GlassButton variant="outline" size="sm" asChild>
          <Link href="/profile/player/edit">
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </GlassButton>
      </div>

      {/* Score + Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skill Score Card */}
        <GlassCard intensity="light" padding="lg" className="md:col-span-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Skill Score</h3>
          <SkillScoreDisplay score={compositeScore} tier={skillTier} techniquesAnalyzed={totalTechniques} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="glass-ultralight rounded-xl p-3 text-center">
              <p className="text-lg font-bold">{totalAnalyses}</p>
              <p className="text-xs text-muted-foreground">Analisis</p>
            </div>
            <div className="glass-ultralight rounded-xl p-3 text-center">
              <p className="text-lg font-bold">{totalTechniques}</p>
              <p className="text-xs text-muted-foreground">Tecnicas</p>
            </div>
          </div>
          {countryRank && (
            <div className="mt-3 glass-ultralight rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">#{countryRank}</span>
              </div>
              <p className="text-xs text-muted-foreground">Ranking Peru</p>
            </div>
          )}
        </GlassCard>

        {/* Profile Info Card */}
        <GlassCard intensity="light" padding="lg" className="md:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                {(profile.displayName || '?').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.displayName || 'Jugador'}</h2>
              {profile.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
              <div className="flex flex-wrap gap-3 mt-2">
                {(profile.region || profile.city) && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {[profile.city, profile.region].filter(Boolean).join(', ')}
                  </span>
                )}
                {profile.yearsPlaying && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {profile.yearsPlaying} anos jugando
                  </span>
                )}
                {profile.dominantHand && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hand className="h-3 w-3" />
                    {profile.dominantHand === 'right' ? 'Diestro' : 'Zurdo'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.playStyle && (
              <div className="glass-ultralight rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Estilo</p>
                <p className="text-sm font-medium mt-0.5">{profile.playStyle}</p>
              </div>
            )}
            {profile.backhandType && (
              <div className="glass-ultralight rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Reves</p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.backhandType === 'one-handed' ? 'A 1 mano' : 'A 2 manos'}
                </p>
              </div>
            )}
            {profile.ageGroup && (
              <div className="glass-ultralight rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Grupo de edad</p>
                <p className="text-sm font-medium mt-0.5">{profile.ageGroup}</p>
              </div>
            )}
            <div className="glass-ultralight rounded-xl p-3">
              <p className="text-xs text-muted-foreground">ELO</p>
              <p className="text-sm font-medium mt-0.5">{matchElo}</p>
            </div>
          </div>

          {/* Match Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="glass-ultralight rounded-xl p-3 text-center">
              <p className="text-lg font-bold">{matchesPlayed}</p>
              <p className="text-xs text-muted-foreground">Partidos</p>
            </div>
            <div className="glass-ultralight rounded-xl p-3 text-center">
              <p className="text-lg font-bold">{matchesWon}</p>
              <p className="text-xs text-muted-foreground">Ganados</p>
            </div>
            <div className="glass-ultralight rounded-xl p-3 text-center">
              <p className="text-lg font-bold">{profile.followersCount}</p>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Ranking Guide for unranked users */}
      {skillTier === 'UNRANKED' && (
        <ProfileRankingGuide
          techniqueScores={techniqueScores.map(ts => ({
            technique: { name: ts.technique.name, slug: ts.technique.slug },
            bestScore: ts.bestScore ?? 0,
          }))}
          skillTier={skillTier}
        />
      )}

      {/* Technique Radar Chart */}
      <GlassCard intensity="light" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Radar de Tecnicas</h3>
        </div>
        <TechniqueRadarChart data={techniqueScores} />
      </GlassCard>

      {/* Technique Scores Table */}
      {techniqueScores.length > 0 && (
        <GlassCard intensity="light" padding="lg">
          <h3 className="font-semibold mb-4">Desglose por Tecnica</h3>
          <div className="space-y-3">
            {techniqueScores.map((ts) => (
              <div key={ts.id} className="flex items-center gap-4 glass-ultralight rounded-xl p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{ts.technique.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ts.analysisCount} analisis
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">{ts.bestScore != null ? ts.bestScore.toFixed(1) : '--'}</p>
                  <p className="text-xs text-muted-foreground">
                    Prom: {ts.averageScore != null ? ts.averageScore.toFixed(1) : '--'}
                  </p>
                </div>
                {/* Score bar */}
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${ts.bestScore ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
