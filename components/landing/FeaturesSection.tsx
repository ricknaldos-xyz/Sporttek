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
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'

const pillars = [
  {
    id: 'mejora',
    badge: 'Mejora',
    badgeIcon: TrendingUp,
    title: 'Mejora tu tecnica con inteligencia artificial',
    description:
      'Sube un video de tu golpe y recibe un analisis profesional en minutos. La IA detecta errores especificos y genera planes de entrenamiento personalizados para corregirlos.',
    features: [
      {
        icon: Brain,
        title: 'Análisis IA de video',
        description:
          'Detección de errores en saque, derecha, revés, volea y bandeja con precisión profesional.',
      },
      {
        icon: Target,
        title: 'Planes personalizados',
        description:
          'Ejercicios diarios basados en tus errores, con progresión semanal y seguimiento.',
      },
    ],
  },
  {
    id: 'compite',
    badge: 'Compite',
    badgeIcon: Trophy,
    title: 'Compite y sube en el ranking nacional',
    description:
      'Sistema de rankings por pais, tier y grupo de edad. Participa en torneos con brackets reales, gana badges y mantiene rachas de entrenamiento para subir de categoria.',
    features: [
      {
        icon: Trophy,
        title: 'Rankings multi-categoría',
        description:
          'Rankings por país, skill tier, grupo de edad y globales. Periodos semanal, mensual e histórico.',
      },
      {
        icon: Medal,
        title: 'Torneos organizados',
        description:
          'Eliminación simple, doble y round robin. Brackets con seeding, restricciones por tier y edad.',
      },
    ],
  },
  {
    id: 'conecta',
    badge: 'Conecta',
    badgeIcon: Users,
    title: 'Conecta con coaches, canchas y comunidad',
    description:
      'Encuentra entrenadores certificados, reserva canchas, compra equipamiento y conecta con otros deportistas. Todo el ecosistema deportivo en un solo lugar.',
    features: [
      {
        icon: GraduationCap,
        title: 'Coach Marketplace',
        description:
          'Coaches verificados con certificaciones, reviews, precios y gestión de alumnos.',
      },
      {
        icon: MapPin,
        title: 'Reserva de canchas',
        description:
          'Canchas de tenis y padel con disponibilidad en tiempo real y pago integrado.',
      },
    ],
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Un ecosistema completo para tu desarrollo deportivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pilares que cubren todo lo que necesitas: desde el analisis de tu tecnica hasta la competencia y la comunidad.
          </p>
        </div>

        <div className="space-y-20 max-w-6xl mx-auto">
          {pillars.map((pillar, pillarIndex) => (
            <div key={pillar.id}>
              {/* Pillar header */}
              <div className={`flex flex-col ${pillarIndex % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-start`}>
                {/* Left/Right: Description */}
                <div className="lg:w-5/12 lg:sticky lg:top-24">
                  <GlassBadge variant="primary" size="lg" className="mb-4">
                    <pillar.badgeIcon className="h-3.5 w-3.5 mr-1.5" />
                    {pillar.badge}
                  </GlassBadge>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Right/Left: Feature cards */}
                <div className="lg:w-7/12 grid gap-4">
                  {pillar.features.map((feature) => (
                    <GlassCard
                      key={feature.title}
                      intensity="light"
                      padding="lg"
                      hover="glow"
                      className="group"
                    >
                      <div className="glass-primary border-glass rounded-xl w-12 h-12 flex items-center justify-center mb-4 group-hover:shadow-glass-glow transition-all duration-[var(--duration-normal)]">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-base font-semibold mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
