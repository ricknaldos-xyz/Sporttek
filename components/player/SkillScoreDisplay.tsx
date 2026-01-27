'use client'

import { cn } from '@/lib/utils'
import { TierBadge } from './TierBadge'
import type { SkillTier } from '@prisma/client'

interface SkillScoreDisplayProps {
  score: number | null
  tier: SkillTier
  className?: string
}

export function SkillScoreDisplay({ score, tier, className }: SkillScoreDisplayProps) {
  if (score === null || tier === 'UNRANKED') {
    return (
      <div className={cn('text-center', className)}>
        <div className="text-4xl font-bold text-muted-foreground">--</div>
        <TierBadge tier="UNRANKED" size="sm" className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          Analiza 3+ tecnicas para obtener tu score
        </p>
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    BRONCE: 'text-amber-600',
    PLATA: 'text-slate-500',
    ORO: 'text-yellow-600',
    PLATINO: 'text-cyan-600',
    DIAMANTE: 'text-violet-600',
  }

  return (
    <div className={cn('text-center', className)}>
      <div className={cn('text-5xl font-bold tabular-nums', tierColors[tier] || 'text-foreground')}>
        {score.toFixed(1)}
      </div>
      <TierBadge tier={tier} size="md" className="mt-2" />
    </div>
  )
}
