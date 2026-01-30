'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Package, Clock, Star } from 'lucide-react'

const stats = [
  { icon: Package, label: 'Raquetas encordadas', value: '500+', color: 'text-primary' },
  { icon: Clock, label: 'Tiempo promedio', value: '24h', color: 'text-blue-500' },
  { icon: Star, label: 'Calificacion', value: '4.8', color: 'text-yellow-500' },
]

export function TrustStats() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <GlassCard key={stat.label} intensity="ultralight" padding="md">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
