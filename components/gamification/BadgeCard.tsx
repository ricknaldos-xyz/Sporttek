'use client'

import { cn } from '@/lib/utils'
import { BadgeDefinition } from '@/lib/badges'
import { formatDate } from '@/lib/utils'

interface BadgeCardProps {
  badge: BadgeDefinition
  earnedAt?: Date | string
  isLocked?: boolean
}

export function BadgeCard({ badge, earnedAt, isLocked = false }: BadgeCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl p-4 border transition-all',
        isLocked
          ? 'bg-muted/30 border-border opacity-50 grayscale'
          : badge.color + ' border-transparent'
      )}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold text-sm">{badge.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
        {earnedAt && !isLocked && (
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(new Date(earnedAt))}
          </p>
        )}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl">🔒</div>
        </div>
      )}
    </div>
  )
}
