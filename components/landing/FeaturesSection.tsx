'use client'

import {
  Brain,
  Target,
  Trophy,
  Swords,
  Medal,
  Users,
  GraduationCap,
  ShoppingBag,
  Wrench,
  MapPin,
  Flame,
  Flag,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const features = [
  {
    icon: Brain,
    title: 'Analisis con IA',
    description:
      'Sube un video de tu tecnica y nuestra IA identifica errores especificos en tu saque, derecha, reves o volea con precision profesional.',
  },
  {
    icon: Target,
    title: 'Planes de entrenamiento',
    description:
      'Recibe ejercicios personalizados basados en los errores detectados, con progresion semanal y seguimiento de mejora.',
  },
  {
    icon: Flame,
    title: 'Gamificacion',
    description:
      'Gana badges, mantiene tu racha de entrenamiento y sube de tier: Bronce, Plata, Oro, Platino y Diamante.',
  },
  {
    icon: Trophy,
    title: 'Rankings nacionales',
    description:
      'Compite por tu posicion en el ranking peruano. Tu skill score se calcula con IA y se actualiza con cada analisis.',
  },
  {
    icon: Swords,
    title: 'Matchmaking',
    description:
      'Encuentra rivales de tu nivel basado en tu ELO score y ubicacion. Envia desafios y coordina partidos.',
  },
  {
    icon: Medal,
    title: 'Torneos',
    description:
      'Participa en torneos organizados por la comunidad. Registrate, compite en brackets y sube en el ranking.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description:
      'Conecta con otros deportistas. Sigue jugadores, comparte logros, publica en el feed y comenta analisis.',
  },
  {
    icon: GraduationCap,
    title: 'Coach Marketplace',
    description:
      'Encuentra entrenadores certificados cerca de ti. Revisa perfiles, especialidades, precios y reserva sesiones.',
  },
  {
    icon: ShoppingBag,
    title: 'Tienda',
    description:
      'Compra raquetas, cuerdas, accesorios y equipamiento deportivo directamente desde la plataforma.',
  },
  {
    icon: Wrench,
    title: 'Encordado',
    description:
      'Encuentra talleres de encordado cercanos, compara precios y tipos de cuerda, y solicita el servicio.',
  },
  {
    icon: MapPin,
    title: 'Canchas',
    description:
      'Descubre canchas de tenis, padel y pickleball cerca de ti con detalles de ubicacion, superficie y horarios.',
  },
  {
    icon: Flag,
    title: 'Metas personales',
    description:
      'Define objetivos de entrenamiento, establece metas medibles y monitorea tu progreso a lo largo del tiempo.',
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
            Todo lo que necesitas para mejorar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa que combina IA, entrenamiento personalizado,
            competencia y comunidad para tu desarrollo deportivo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              intensity="light"
              padding="lg"
              hover="glow"
              className="group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="glass-primary border-glass rounded-xl w-14 h-14 flex items-center justify-center mb-5 group-hover:shadow-glass-glow transition-all duration-[var(--duration-normal)]">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
