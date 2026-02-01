'use client'

import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Search, X } from 'lucide-react'

const tierOptions = [
  { value: '', label: 'Todos' },
  { value: 'PRIMERA_A,PRIMERA_B', label: '1ra' },
  { value: 'SEGUNDA_A,SEGUNDA_B', label: '2da' },
  { value: 'TERCERA_A,TERCERA_B', label: '3ra' },
  { value: 'CUARTA_A,CUARTA_B', label: '4ta' },
  { value: 'QUINTA_A,QUINTA_B', label: '5ta' },
]

const periodOptions = [
  { value: 'all', label: 'Todo', enabled: true },
  { value: 'month', label: 'Mensual', enabled: false },
  { value: 'week', label: 'Semanal', enabled: false },
]

interface RankingFiltersProps {
  tierFilter: string
  onTierChange: (tier: string) => void
  periodFilter: string
  onPeriodChange: (period: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function RankingFilters({
  tierFilter,
  onTierChange,
  periodFilter,
  onPeriodChange,
  searchQuery,
  onSearchChange,
}: RankingFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tierOptions.map((option) => (
          <GlassButton
            key={option.value}
            variant={tierFilter === option.value ? 'solid' : 'outline'}
            size="sm"
            onClick={() => onTierChange(option.value)}
          >
            {option.label}
          </GlassButton>
        ))}

        <div className="w-px bg-glass-border-light mx-1 self-stretch" />

        {periodOptions.map((option) => (
          <GlassButton
            key={option.value}
            variant={periodFilter === option.value ? 'solid' : 'outline'}
            size="sm"
            onClick={() => option.enabled && onPeriodChange(option.value)}
            disabled={!option.enabled}
            className={!option.enabled ? 'opacity-50' : ''}
          >
            {option.label}
            {!option.enabled && (
              <GlassBadge variant="default" size="sm" className="ml-1 text-[10px]">
                Pronto
              </GlassBadge>
            )}
          </GlassButton>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar jugador"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-glass-light border border-glass text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar busqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
