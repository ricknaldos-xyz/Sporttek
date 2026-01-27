'use client'

import { Upload, Brain, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Sube tu video',
    description:
      'Graba tu tecnica desde cualquier angulo con tu movil y sube el video a la plataforma.',
    time: '30 segundos',
  },
  {
    number: 2,
    icon: Brain,
    title: 'Analisis con IA',
    description:
      'Nuestra IA procesa el video e identifica errores especificos en tu movimiento.',
    time: '2-3 minutos',
  },
  {
    number: 3,
    icon: TrendingUp,
    title: 'Mejora con un plan',
    description:
      'Recibe ejercicios personalizados para corregir cada error y perfeccionar tu tecnica.',
    time: 'Inmediato',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Como funciona</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En solo 3 pasos simples, obtendras un analisis profesional de tu
            tecnica y un plan para mejorar.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <GlassCard
                  intensity="light"
                  padding="lg"
                  hover="lift"
                  className="text-center relative z-10"
                >
                  {/* Number badge */}
                  <div className="w-10 h-10 glass-primary border-glass shadow-glass-glow rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 text-primary">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 glass-primary border-glass rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Time badge */}
                  <GlassBadge variant="default" size="sm">
                    {step.time}
                  </GlassBadge>
                </GlassCard>

                {/* Arrow (mobile only, except last) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
