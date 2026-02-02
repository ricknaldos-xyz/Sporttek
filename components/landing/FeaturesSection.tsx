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
  ArrowRight,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'

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

// Flatten all features into a single bento grid array
const bentoItems = pillars.flatMap((pillar) =>
  pillar.features.map((feature, idx) => ({
    ...feature,
    pillarBadge: pillar.badge,
    pillarBadgeIcon: pillar.badgeIcon,
    pillarId: pillar.id,
    featureIdx: idx,
  }))
)

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Un ecosistema completo para tu desarrollo deportivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pilares que cubren todo lo que necesitas: desde el analisis de tu tecnica hasta la competencia y la comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {bentoItems.map((item, index) => {
            // Bento layout: first item spans 2 cols, items 2 and 5 are dark
            const isWide = index === 0
            const isDark = index === 2 || index === 5

            return (
              <GlassCard
                key={item.title}
                intensity={isDark ? 'dark' : 'light'}
                padding="xl"
                className={isWide ? 'lg:col-span-2' : ''}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-background/10' : 'bg-primary/10'}`}>
                    <item.icon className={`h-5 w-5 ${isDark ? 'text-background' : 'text-primary'}`} />
                  </div>
                  <GlassButton variant={isDark ? 'ghost' : 'default'} size="icon-circle" className={isDark ? 'bg-background/10 hover:bg-background/20' : ''}>
                    <ArrowRight className={`h-5 w-5 ${isDark ? 'text-background' : ''}`} />
                  </GlassButton>
                </div>

                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {item.pillarBadge}
                </span>
                <h4 className="text-lg font-semibold mt-1 mb-2">{item.title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {item.description}
                </p>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
