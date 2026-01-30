'use client'

import { ChevronDown } from 'lucide-react'
import { useSport } from '@/contexts/SportContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SPORT_EMOJI } from '@/lib/navigation'

export function SidebarSportSelector() {
  const { activeSport, userSports, setActiveSport, isLoading } = useSport()

  if (isLoading) {
    return (
      <div className="mx-3 mb-2 h-10 rounded-xl glass-light border-glass animate-pulse" />
    )
  }

  if (!activeSport) return null

  const emoji = SPORT_EMOJI[activeSport.slug] ?? '🏅'
  const hasMultipleSports = userSports.length > 1

  if (!hasMultipleSports) {
    return (
      <div className="mx-3 mb-2 flex items-center gap-2 px-3 py-2.5 rounded-xl glass-primary border-glass text-sm font-semibold">
        <span className="text-lg">{emoji}</span>
        <span>{activeSport.name}</span>
      </div>
    )
  }

  return (
    <div className="mx-3 mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl glass-primary border-glass text-sm font-semibold hover:shadow-glass transition-all duration-[var(--duration-normal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className="text-lg">{emoji}</span>
            <span>{activeSport.name}</span>
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[232px] glass-medium border-glass">
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
                <span className="text-lg">{sportEmoji}</span>
                <span>{sport.name}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
