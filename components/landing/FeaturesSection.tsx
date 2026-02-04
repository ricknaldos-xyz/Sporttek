'use client'

import {
  Brain,
  Target,
  Trophy,
  Medal,
  Users,
  GraduationCap,
  MapPin,
  TrendingUp,
  Check,
} from 'lucide-react'

const pillars = [
  {
    number: '01',
    badge: 'Mejora',
    icon: TrendingUp,
    title: 'Mejora tu técnica con IA',
    description:
      'Sube un video y recibe análisis profesional en minutos. La IA detecta errores y genera planes personalizados.',
    features: [
      { icon: Brain, text: 'Análisis de saque, derecha, revés, volea y bandeja' },
      { icon: Target, text: 'Planes de entrenamiento con progresión semanal' },
    ],
    color: 'primary',
  },
  {
    number: '02',
    badge: 'Compite',
    icon: Trophy,
    title: 'Sube en el ranking nacional',
    description:
      'Rankings por país, tier y edad. Torneos con brackets reales y badges de logros.',
    features: [
      { icon: Trophy, text: 'Rankings semanal, mensual e histórico' },
      { icon: Medal, text: 'Torneos con seeding y restricciones por nivel' },
    ],
    color: 'dark',
  },
  {
    number: '03',
    badge: 'Conecta',
    icon: Users,
    title: 'Coaches, canchas y comunidad',
    description:
      'Entrenadores certificados, reserva de canchas y matchmaking con jugadores de tu nivel.',
    features: [
      { icon: GraduationCap, text: 'Coaches verificados con reviews y precios' },
      { icon: MapPin, text: 'Canchas con disponibilidad en tiempo real' },
    ],
    color: 'primary',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Ecosistema
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Todo lo que necesitas para crecer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pilares que cubren tu desarrollo deportivo completo
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar) => {
            const isDark = pillar.color === 'dark'

            return (
              <div
                key={pillar.number}
                className={`rounded-3xl p-8 transition-all hover:shadow-xl ${
                  isDark
                    ? 'bg-foreground text-background'
                    : 'bg-white shadow-lg'
                }`}
              >
                {/* Number & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-5xl font-bold ${isDark ? 'text-background/20' : 'text-foreground/10'}`}>
                    {pillar.number}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDark
                      ? 'bg-background/10 text-background'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {pillar.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  isDark
                    ? 'bg-background/10'
                    : 'bg-primary/10'
                }`}>
                  <pillar.icon className={`h-6 w-6 ${isDark ? 'text-background' : 'text-primary'}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {pillar.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                  {pillar.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isDark
                          ? 'bg-background/20'
                          : 'bg-primary/10'
                      }`}>
                        <Check className={`h-3 w-3 ${isDark ? 'text-background' : 'text-primary'}`} />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-background/80' : 'text-foreground'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
