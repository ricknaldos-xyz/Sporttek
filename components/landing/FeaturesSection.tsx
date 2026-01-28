'use client'

import { Brain, Target, Trophy, Swords, Medal, Users } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const features = [
  {
    icon: Brain,
    title: 'Analisis con IA avanzada',
    description:
      'Sube un video de tu tecnica y nuestra IA identifica errores especificos que un ojo humano podria pasar por alto.',
  },
  {
    icon: Target,
    title: 'Planes de entrenamiento',
    description:
      'Recibe ejercicios personalizados basados en los errores detectados, con instrucciones paso a paso y progresion semanal.',
  },
  {
    icon: Trophy,
    title: 'Rankings nacionales',
    description:
      'Compite por tu posicion en el ranking peruano. Tu skill score se calcula con IA y sube de tier: Bronce, Plata, Oro, Platino, Diamante.',
  },
  {
    icon: Swords,
    title: 'Matchmaking',
    description:
      'Encuentra rivales de tu nivel para jugar partidos reales. El sistema sugiere oponentes basado en tu skill score y ubicacion.',
  },
  {
    icon: Medal,
    title: 'Torneos',
    description:
      'Participa en torneos organizados por la comunidad. Registrate, compite y sube en el ranking con cada victoria.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description:
      'Conecta con otros tenistas. Sigue jugadores, comparte logros, comenta analisis y forma parte de la comunidad tenistica peruana.',
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
            SportTech combina tecnologia de vanguardia con metodologia deportiva
            para ofrecerte la mejor experiencia de entrenamiento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
