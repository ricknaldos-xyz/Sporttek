'use client'

import { GlassBadge } from '@/components/ui/glass-badge'

const POPULAR_STRINGS = [
  'Yonex Poly Tour Pro 125',
  'Luxilon ALU Power 125',
  'Babolat RPM Blast 125',
  'Tecnifibre Black Code 125',
  'Wilson NXT 130',
]

interface PopularStringsProps {
  selected: string
  onSelect: (name: string) => void
}

export function PopularStrings({ selected, onSelect }: PopularStringsProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Cuerdas populares</p>
      <div className="flex flex-wrap gap-2">
        {POPULAR_STRINGS.map((name) => (
          <button key={name} onClick={() => onSelect(name)}>
            <GlassBadge
              variant={selected === name ? 'primary' : 'outline'}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
            >
              {name}
            </GlassBadge>
          </button>
        ))}
      </div>
    </div>
  )
}
