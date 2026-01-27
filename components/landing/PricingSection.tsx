'use client'

import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    description: 'Para comenzar',
    price: 0,
    features: [
      '3 analisis por mes',
      '1 plan de entrenamiento activo',
      'Acceso a Tenis',
      'Soporte por email',
    ],
    cta: 'Comenzar gratis',
    popular: false,
  },
  {
    id: 'PRO',
    name: 'Pro',
    description: 'Para deportistas serios',
    price: 19.99,
    features: [
      'Analisis ilimitados',
      'Planes de entrenamiento ilimitados',
      'Acceso a todos los deportes',
      'Historial completo',
      'Soporte prioritario',
    ],
    cta: 'Elegir Pro',
    popular: true,
  },
  {
    id: 'ELITE',
    name: 'Elite',
    description: 'Para profesionales',
    price: 49.99,
    features: [
      'Todo en Pro',
      'Analisis en video HD',
      'Comparacion de progreso avanzada',
      'Exportar informes PDF',
      'Sesiones de coaching virtual',
      'Soporte 24/7',
    ],
    cta: 'Elegir Elite',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planes y precios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Puedes cambiar
            o cancelar en cualquier momento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <GlassCard
              key={plan.id}
              intensity={plan.popular ? 'primary' : 'light'}
              padding="none"
              hover={plan.popular ? 'glow' : 'lift'}
              className={cn(
                'relative flex flex-col overflow-hidden',
                plan.popular && 'md:scale-105 shadow-glass-glow'
              )}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <GlassBadge variant="primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Popular
                  </GlassBadge>
                </div>
              )}

              <div className="p-6 pb-0">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${plan.price.toFixed(2)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/mes</span>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="glass-primary border-glass rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <GlassButton
                  asChild
                  variant={plan.popular ? 'solid' : 'outline'}
                  className="w-full"
                >
                  <Link href="/register">{plan.cta}</Link>
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Sin tarjeta de credito para el plan gratuito. Los precios estan en
          USD.
        </p>
      </div>
    </section>
  )
}
