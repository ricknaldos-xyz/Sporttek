import { Brain, Target, Dumbbell, TrendingUp, History, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Analisis con IA avanzada',
    description:
      'Nuestra inteligencia artificial identifica errores especificos en tu tecnica que un ojo humano podria pasar por alto.',
  },
  {
    icon: Target,
    title: 'Planes personalizados',
    description:
      'Recibe ejercicios adaptados a tu nivel y objetivos especificos para corregir cada error detectado.',
  },
  {
    icon: Dumbbell,
    title: 'Multiples deportes',
    description:
      'Tenis disponible hoy, con golf, basketball y futbol llegando proximamente a la plataforma.',
  },
  {
    icon: TrendingUp,
    title: 'Seguimiento de progreso',
    description:
      'Visualiza tu mejora con graficos y metricas detalladas que muestran tu evolucion en el tiempo.',
  },
  {
    icon: History,
    title: 'Historial completo',
    description:
      'Accede a todos tus analisis anteriores para comparar tu evolucion y ver cuanto has mejorado.',
  },
  {
    icon: Zap,
    title: 'Feedback instantaneo',
    description:
      'Obtiene resultados en minutos, no dias. Analiza tu tecnica y recibe recomendaciones al instante.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Todo lo que necesitas para mejorar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SportTech combina tecnologia de vanguardia con metodologia deportiva
            para ofrecerte la mejor experiencia de entrenamiento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
