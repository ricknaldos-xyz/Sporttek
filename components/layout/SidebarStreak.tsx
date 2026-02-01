'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakData {
  currentStreak: number
  lastActivityAt: string | null
}

export function SidebarStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/gamification/streak')
        if (res.ok) {
          const data = await res.json()
          setStreak(data)
        }
      } catch {
        // silently fail
      }
    }
    fetchStreak()
  }, [])

  if (!streak) return null

  const today = new Date().toDateString()
  const lastActivity = streak.lastActivityAt ? new Date(streak.lastActivityAt).toDateString() : null
  const isActiveToday = lastActivity === today
  const isAtRisk = streak.currentStreak > 0 && !isActiveToday

  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
        isAtRisk
          ? 'glass-ultralight border border-warning/30 text-warning'
          : streak.currentStreak > 0
          ? 'glass-ultralight text-primary'
          : 'text-muted-foreground'
      )}
    >
      <Flame className={cn(
        'h-4 w-4',
        streak.currentStreak > 0 && isActiveToday && 'text-primary',
        isAtRisk && 'text-warning animate-pulse'
      )} />
      <span>
        {streak.currentStreak > 0
          ? `${streak.currentStreak} dia${streak.currentStreak === 1 ? '' : 's'} de racha`
          : 'Sin racha activa'}
      </span>
      {isAtRisk && (
        <span className="ml-auto text-[10px] text-warning font-semibold">!</span>
      )}
    </Link>
  )
}
