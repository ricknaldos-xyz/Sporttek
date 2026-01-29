'use client'

import { ChevronDown } from 'lucide-react'
import { useSport } from '@/contexts/SportContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlassButton } from '@/components/ui/glass-button'
import { cn } from '@/lib/utils'

const SPORT_EMOJI: Record<string, string> = {
  tennis: '🎾',
  padel: '🏓',
  pickleball: '🏸',
  futbol: '⚽',
}

export function SportSelectorPill() {
  const { activeSport, userSports, setActiveSport, isLoading } = useSport()

  if (isLoading || !activeSport) return null

  const emoji = SPORT_EMOJI[activeSport.slug] ?? '🏅'
  const hasMultipleSports = userSports.length > 1

  if (!hasMultipleSports) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light border-glass text-sm font-medium">
        <span>{emoji}</span>
        <span>{activeSport.name}</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GlassButton variant="ghost" size="sm" className="rounded-full gap-1.5 px-3">
          <span>{emoji}</span>
          <span className="text-sm font-medium">{activeSport.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </GlassButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 glass-medium border-glass">
        {userSports.map((sport) => {
          const sportEmoji = SPORT_EMOJI[sport.slug] ?? '🏅'
          const isActive = sport.id === activeSport.id
          return (
            <DropdownMenuItem
              key={sport.id}
              onClick={() => setActiveSport(sport)}
              className={cn(
                'cursor-pointer gap-2',
                isActive && 'bg-primary/10 text-primary'
              )}
            >
              <span>{sportEmoji}</span>
              <span>{sport.name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
