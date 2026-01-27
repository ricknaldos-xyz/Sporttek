import { Upload, Brain, TrendingUp } from 'lucide-react'

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
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border" />

            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <div className="bg-card border border-border rounded-xl p-6 text-center relative z-10">
                  {/* Number badge */}
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>

                  {/* Time badge */}
                  <span className="inline-block text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                    {step.time}
                  </span>
                </div>

                {/* Arrow (mobile only, except last) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-border" />
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
