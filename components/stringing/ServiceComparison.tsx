'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Clock, Zap, ArrowRight } from 'lucide-react'

const services = [
  {
    type: 'STANDARD',
    name: 'Estandar',
    icon: Clock,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    price: 'S/ 25.00',
    time: '24-48 horas',
    ideal: 'Sin prisa, mejor precio',
    recommended: true,
  },
  {
    type: 'EXPRESS',
    name: 'Express',
    icon: Zap,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    price: 'S/ 45.00',
    time: 'Mismo dia',
    ideal: 'Torneo o urgencia',
    recommended: false,
  },
]

export function ServiceComparison() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tipos de Servicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => {
          const Icon = svc.icon
          return (
            <Link key={svc.type} href="/encordado/solicitar">
              <GlassCard
                intensity="medium"
                padding="lg"
                hover="lift"
                className="relative h-full"
              >
                {svc.recommended && (
                  <div className="absolute -top-2 right-4">
                    <GlassBadge variant="success" size="sm">Recomendado</GlassBadge>
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${svc.iconBg}`}>
                    <Icon className={`h-6 w-6 ${svc.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{svc.name}</h3>
                    <p className="text-2xl font-bold mt-1">{svc.price}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiempo</span>
                    <span className="font-medium">{svc.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ideal para</span>
                    <span className="font-medium">{svc.ideal}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 text-sm text-primary font-medium">
                  Solicitar <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </GlassCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
