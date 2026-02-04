'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const plans = [
  {
    id: 'FREE',
    name: 'Gratis',
    subtitle: 'Descubre tu nivel',
    price: 0,
    period: null,
    description: '5 análisis de video, 1 plan de entrenamiento, ranking básico',
    badge: null,
    background: 'light',
    cta: 'Comenzar gratis',
  },
  {
    id: 'PRO',
    name: 'Pro',
    subtitle: 'Compite en serio',
    price: 24.90,
    period: '/mes',
    description: 'Análisis ilimitados, todos los deportes, torneos y matchmaking',
    badge: 'Popular',
    background: 'primary',
    cta: 'Elegir Pro',
  },
  {
    id: 'ELITE',
    name: 'Elite',
    subtitle: 'Entrena como profesional',
    price: 39.90,
    period: '/mes',
    description: 'Todo en Pro + coaching virtual, informes PDF, soporte 24/7',
    badge: 'Premium',
    background: 'image',
    cta: 'Elegir Elite',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Encuentra el plan perfecto para tu{' '}
            <span className="inline-flex items-center gap-2">
              desarrollo
              <span className="inline-block w-10 h-10 rounded-full bg-primary/20 text-2xl flex items-center justify-center">
                🎾
              </span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cambia o cancela cuando quieras
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isPrimary = plan.background === 'primary'
            const isImage = plan.background === 'image'
            const isDark = isPrimary || isImage

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl overflow-hidden transition-all hover:shadow-xl ${
                  isPrimary
                    ? 'bg-[#c8f7c5]'
                    : isImage
                    ? 'bg-cover bg-center'
                    : 'bg-white shadow-lg'
                }`}
                style={
                  isImage
                    ? {
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('/images/tennis-court-bg.jpg')`,
                        backgroundColor: '#1a3d2b',
                      }
                    : undefined
                }
              >
                {/* Top badges row */}
                <div className="flex items-start justify-between p-6 pb-0">
                  {/* Left badge */}
                  {plan.badge && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isImage
                          ? 'bg-white/20 text-white backdrop-blur-sm'
                          : 'bg-foreground/10 text-foreground'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  {!plan.badge && <span />}

                  {/* Right: Social proof */}
                  {(isPrimary || isImage) && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              isImage
                                ? 'bg-white/20 border-white/40 text-white'
                                : 'bg-white border-white text-foreground/60'
                            }`}
                          >
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span
                        className={`text-xs ${
                          isImage ? 'text-white/80' : 'text-foreground/60'
                        }`}
                      >
                        Recomendado
                        <br />
                        por coaches
                      </span>
                    </div>
                  )}
                </div>

                {/* Main content */}
                <div className="p-6 pt-8">
                  {/* Plan name - large */}
                  <h3
                    className={`text-4xl sm:text-5xl font-bold mb-1 ${
                      isImage ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-8 ${
                      isImage ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price pill */}
                  <div className="mb-6">
                    <span
                      className={`inline-flex items-baseline rounded-full px-5 py-2 text-2xl font-bold ${
                        isImage
                          ? 'bg-white text-foreground'
                          : isPrimary
                          ? 'bg-[#256F50] text-white'
                          : 'bg-foreground text-background'
                      }`}
                    >
                      {plan.price === 0 ? (
                        'S/0'
                      ) : (
                        <>
                          S/{plan.price.toFixed(0)}
                        </>
                      )}
                      {plan.period && (
                        <span className="text-sm font-normal ml-1 opacity-70">
                          {plan.period}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed mb-8 ${
                      isImage ? 'text-white/80' : 'text-muted-foreground'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Footer with CTA */}
                <div className="px-6 pb-6">
                  <div
                    className={`flex items-center justify-between pt-4 border-t ${
                      isImage ? 'border-white/20' : 'border-foreground/10'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isImage ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {plan.cta}
                    </span>
                    <Link
                      href="/register"
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                        isImage
                          ? 'bg-white text-foreground'
                          : 'bg-foreground text-background'
                      }`}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Precios en soles peruanos (PEN). Sin compromisos.
        </p>
      </div>
    </section>
  )
}
