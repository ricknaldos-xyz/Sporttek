'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { TierBadge } from '@/components/player/TierBadge'
import { PlayerCard } from '@/components/player/PlayerCard'
import { Trophy, Medal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { SkillTier } from '@prisma/client'

interface RankingPlayer {
  rank: number
  userId: string
  displayName: string | null
  avatarUrl: string | null
  region: string | null
  city: string | null
  skillTier: SkillTier
  compositeScore: number | null
  effectiveScore: number | null
  countryRank: number | null
  matchesPlayed: number
  matchesWon: number
}

interface MyPosition {
  compositeScore: number | null
  effectiveScore: number | null
  skillTier: SkillTier
  countryRank: number | null
  totalInCountry: number
  totalInTier: number
}

const TIER_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'DIAMANTE', label: 'Diamante' },
  { value: 'PLATINO', label: 'Platino' },
  { value: 'ORO', label: 'Oro' },
  { value: 'PLATA', label: 'Plata' },
  { value: 'BRONCE', label: 'Bronce' },
]

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingPlayer[]>([])
  const [myPosition, setMyPosition] = useState<MyPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tierFilter, setTierFilter] = useState('')

  useEffect(() => {
    fetchRankings()
    fetchMyPosition()
  }, [page, tierFilter])

  async function fetchRankings() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        country: 'PE',
        page: page.toString(),
        limit: '20',
      })
      if (tierFilter) params.set('skillTier', tierFilter)

      const res = await fetch(`/api/rankings?${params}`)
      const data = await res.json()
      setRankings(data.rankings)
      setTotalPages(data.pagination.totalPages)
    } catch {
      console.error('Failed to fetch rankings')
    } finally {
      setLoading(false)
    }
  }

  async function fetchMyPosition() {
    try {
      const res = await fetch('/api/rankings/my-position')
      if (res.ok) {
        const data = await res.json()
        setMyPosition(data)
      }
    } catch {
      // User might not have a profile yet
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-7 w-7 text-yellow-500" />
        <h1 className="text-2xl font-bold">Rankings Peru</h1>
      </div>

      {/* My Position Card */}
      {myPosition && myPosition.skillTier !== 'UNRANKED' && (
        <GlassCard intensity="primary" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tu posicion</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold">
                  #{myPosition.countryRank || '--'}
                </span>
                <TierBadge tier={myPosition.skillTier} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                de {myPosition.totalInCountry} jugadores en Peru
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold tabular-nums">
                {myPosition.effectiveScore?.toFixed(1) || '--'}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TIER_FILTERS.map((filter) => (
          <GlassButton
            key={filter.value}
            variant={tierFilter === filter.value ? 'solid' : 'outline'}
            size="sm"
            onClick={() => { setTierFilter(filter.value); setPage(1) }}
          >
            {filter.label}
          </GlassButton>
        ))}
      </div>

      {/* Rankings Table */}
      <GlassCard intensity="light" padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay jugadores clasificados aun
          </div>
        ) : (
          <div className="divide-y divide-glass-border-light">
            {rankings.map((player) => (
              <div
                key={player.userId}
                className="flex items-center gap-4 px-5 py-3 hover:glass-ultralight transition-all"
              >
                {/* Rank */}
                <div className="w-10 text-center flex-shrink-0">
                  {player.rank <= 3 ? (
                    <Medal className={`h-6 w-6 mx-auto ${
                      player.rank === 1 ? 'text-yellow-500' :
                      player.rank === 2 ? 'text-slate-400' :
                      'text-amber-600'
                    }`} />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {player.rank}
                    </span>
                  )}
                </div>

                {/* Player Info */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-primary">
                      {(player.displayName || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {player.displayName || 'Jugador'}
                    </p>
                    <TierBadge tier={player.skillTier} size="sm" />
                  </div>
                  {player.region && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[player.city, player.region].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold tabular-nums">
                    {player.effectiveScore?.toFixed(1) || '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {player.matchesPlayed} partidos
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </GlassButton>
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </GlassButton>
        </div>
      )}
    </div>
  )
}
