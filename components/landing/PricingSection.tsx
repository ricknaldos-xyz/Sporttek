import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <section id="pricing" className="py-20 lg:py-32 bg-secondary/30">
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

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative bg-card border rounded-2xl p-6 flex flex-col',
                plan.popular && 'border-primary shadow-lg scale-105'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

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

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? 'default' : 'outline'}
                className="w-full"
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
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
