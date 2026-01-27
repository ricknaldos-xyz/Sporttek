'use client'

import { useEffect, useState } from 'react'
import { Flame, Snowflake, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserStreak {
  id: string
  currentStreak: number
  longestStreak: number
  lastActivityAt: string | null
  freezesAvailable: number
}

interface StreakWidgetProps {
  compact?: boolean
}

export function StreakWidget({ compact = false }: StreakWidgetProps) {
  const [streak, setStreak] = useState<UserStreak | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAtRisk, setIsAtRisk] = useState(false)

  useEffect(() => {
    async function fetchStreak() {
      try {
        const response = await fetch('/api/gamification/streak')
        if (response.ok) {
          const data = await response.json()
          setStreak(data)

          // Check if streak is at risk (no activity today and has a streak)
          if (data.lastActivityAt && data.currentStreak > 0) {
            const lastActivity = new Date(data.lastActivityAt)
            const today = new Date()
            lastActivity.setHours(0, 0, 0, 0)
            today.setHours(0, 0, 0, 0)

            if (lastActivity.getTime() < today.getTime()) {
              setIsAtRisk(true)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch streak:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [])

  if (loading) {
    return (
      <div
        className={cn(
          'bg-muted/50 rounded-lg animate-pulse',
          compact ? 'h-10 w-20' : 'h-24 w-full'
        )}
      />
    )
  }

  if (!streak) {
    return null
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          isAtRisk
            ? 'bg-orange-100 text-orange-700'
            : streak.currentStreak > 0
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Flame
          className={cn(
            'h-4 w-4',
            streak.currentStreak > 0 && 'animate-pulse'
          )}
        />
        <span className="font-semibold">{streak.currentStreak}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl p-4 border',
        isAtRisk
          ? 'bg-orange-50 border-orange-200'
          : streak.currentStreak > 0
          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
          : 'bg-muted/50 border-border'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              isAtRisk
                ? 'bg-orange-100'
                : streak.currentStreak > 0
                ? 'bg-primary/20'
                : 'bg-muted'
            )}
          >
            <Flame
              className={cn(
                'h-6 w-6',
                isAtRisk
                  ? 'text-orange-600'
                  : streak.currentStreak > 0
                  ? 'text-primary animate-pulse'
                  : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Racha actual</p>
            <p className="text-2xl font-bold">
              {streak.currentStreak} {streak.currentStreak === 1 ? 'dia' : 'dias'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>Mejor: {streak.longestStreak}</span>
          </div>
          {streak.freezesAvailable > 0 && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Snowflake className="h-4 w-4" />
              <span>{streak.freezesAvailable} freeze</span>
            </div>
          )}
        </div>
      </div>

      {isAtRisk && (
        <p className="text-sm text-orange-700 mt-3">
          Tu racha esta en riesgo. Completa una actividad hoy para mantenerla.
        </p>
      )}
    </div>
  )
}
