'use client'

import { Upload, Brain, Trophy } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Sube tu video',
    description:
      'Graba 10-30 segundos de tu técnica con el móvil y súbelo. Tenis o padel.',
  },
  {
    number: 2,
    icon: Brain,
    title: 'Recibe tu análisis IA',
    description:
      'En 2-5 minutos la IA detecta errores, te asigna un skill score y genera tu plan de entrenamiento.',
  },
  {
    number: 3,
    icon: Trophy,
    title: 'Compite y mejora',
    description:
      'Tu score alimenta el ranking nacional. Participa en torneos, encuentra rivales y sube de categoría.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tu camino en SportTek</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Desde tu primer video hasta competir en el ranking nacional. Asi es la experiencia completa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-6xl font-bold text-foreground/[0.06] mb-4">
                {String(step.number).padStart(2, '0')}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
