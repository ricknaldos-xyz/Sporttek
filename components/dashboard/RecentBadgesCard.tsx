'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BadgeCard } from '@/components/gamification/BadgeCard'
import { BadgeDefinition } from '@/lib/badges'
import { BadgeType } from '@prisma/client'
import { Award, ChevronRight } from 'lucide-react'

interface UserBadge {
  id: string
  badgeType: BadgeType
  earnedAt: string
  definition: BadgeDefinition
}

export function RecentBadgesCard() {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBadges() {
      try {
        // Check for new badges
        await fetch('/api/gamification/badges', { method: 'POST' })

        // Fetch all badges
        const response = await fetch('/api/gamification/badges')
        if (response.ok) {
          const data = await response.json()
          setBadges(data.slice(0, 4)) // Only show recent 4
        }
      } catch (error) {
        console.error('Failed to fetch badges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (badges.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <Award className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-medium mb-2">Gana tu primer badge</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Completa actividades para desbloquear badges
        </p>
        <Button variant="outline" asChild>
          <Link href="/analyze">Empezar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Mis Badges
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile/badges">
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge.definition}
            earnedAt={badge.earnedAt}
          />
        ))}
      </div>
    </div>
  )
}
