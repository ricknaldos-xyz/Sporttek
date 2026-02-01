'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from '@/components/player/TierBadge'
import { TrendingUp, Loader2 } from 'lucide-react'
import { useSport } from '@/contexts/SportContext'

interface TrendingPlayer {
  userId: string
  displayName: string | null
  avatarUrl: string | null
  skillTier: string
  rank: number
  previousRank: number
  change: number
  effectiveScore: number
}

function TrendingPlayersInner() {
  const { activeSport } = useSport()
  const [players, setPlayers] = useState<TrendingPlayer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrending = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true)
        const slug = activeSport?.slug || 'tennis'
        const res = await fetch(
          `/api/rankings/trending?sport=${slug}&country=PE&limit=10`,
          { signal }
        )
        if (!res.ok) throw new Error('Failed to fetch trending')
        const data: TrendingPlayer[] = await res.json()
        setPlayers(data)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setPlayers([])
      } finally {
        setLoading(false)
      }
    },
    [activeSport?.slug]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchTrending(controller.signal)
    return () => controller.abort()
  }, [fetchTrending])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!players || players.length === 0) return null

  return (
    <GlassCard intensity="light" padding="md">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-semibold">Tendencia</h3>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2">
        {players.map((player) => (
          <Link
            key={player.userId}
            href={`/player/${player.userId}`}
            className="flex flex-col items-center gap-1 min-w-[80px] group"
          >
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {player.avatarUrl ? (
                <Image
                  src={player.avatarUrl}
                  alt={player.displayName || ''}
                  width={32}
                  height={32}
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-xs font-bold text-primary">
                  {(player.displayName || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name */}
            <p className="text-xs font-medium truncate max-w-[100px] group-hover:text-primary transition-colors">
              {player.displayName || 'Jugador'}
            </p>

            {/* Tier */}
            <TierBadge tier={player.skillTier as any} size="sm" />

            {/* Change badge */}
            <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full px-2 py-0.5">
              +{player.change}
            </span>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}

export const TrendingPlayers = React.memo(TrendingPlayersInner)
