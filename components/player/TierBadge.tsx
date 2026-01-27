'use client'

import { cn } from '@/lib/utils'
import type { SkillTier } from '@prisma/client'

const tierConfig: Record<SkillTier, { label: string; color: string; bg: string }> = {
  UNRANKED: { label: 'Sin clasificar', color: 'text-muted-foreground', bg: 'bg-muted/50' },
  BRONCE: { label: 'Bronce', color: 'text-amber-600', bg: 'bg-amber-100' },
  PLATA: { label: 'Plata', color: 'text-slate-500', bg: 'bg-slate-100' },
  ORO: { label: 'Oro', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  PLATINO: { label: 'Platino', color: 'text-cyan-600', bg: 'bg-cyan-100' },
  DIAMANTE: { label: 'Diamante', color: 'text-violet-600', bg: 'bg-violet-100' },
}

interface TierBadgeProps {
  tier: SkillTier
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TierBadge({ tier, size = 'md', className }: TierBadgeProps) {
  const config = tierConfig[tier]

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        config.bg,
        config.color,
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base',
        className
      )}
    >
      {config.label}
    </span>
  )
}
