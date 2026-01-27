'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from './TierBadge'
import { MapPin } from 'lucide-react'
import type { SkillTier } from '@prisma/client'

interface PlayerCardProps {
  userId: string
  displayName: string | null
  avatarUrl: string | null
  tier: SkillTier
  compositeScore: number | null
  region: string | null
  city: string | null
  matchesPlayed?: number
  className?: string
}

export function PlayerCard({
  userId,
  displayName,
  avatarUrl,
  tier,
  compositeScore,
  region,
  city,
  matchesPlayed,
  className,
}: PlayerCardProps) {
  return (
    <GlassCard intensity="light" hover="lift" padding="md" className={cn('block', className)} asChild>
      <Link href={`/player/${userId}`}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName || ''} fill className="object-cover" />
            ) : (
              <span className="text-lg font-bold text-primary">
                {(displayName || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">{displayName || 'Jugador'}</p>
              <TierBadge tier={tier} size="sm" />
            </div>
            {(region || city) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {[city, region].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {/* Score */}
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold tabular-nums">
              {compositeScore !== null ? compositeScore.toFixed(1) : '--'}
            </div>
            {matchesPlayed !== undefined && (
              <p className="text-xs text-muted-foreground">{matchesPlayed} partidos</p>
            )}
          </div>
        </div>
      </Link>
    </GlassCard>
  )
}
