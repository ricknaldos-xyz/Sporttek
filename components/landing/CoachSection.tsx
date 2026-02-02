'use client'

import Link from 'next/link'
import {
  GraduationCap,
  Users,
  Star,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
  DollarSign,
  ClipboardList,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Perfil verificado',
    description: 'Sistema de verificacion con certificaciones, anos de experiencia y especialidades visibles para los jugadores.',
  },
  {
    icon: Users,
    title: 'Gestion de alumnos',
    description: 'Administra invitaciones, solicitudes y el estado de cada alumno. Pausa o finaliza relaciones facilmente.',
  },
  {
    icon: ClipboardList,
    title: 'Asigna planes de entrenamiento',
    description: 'Crea y asigna planes personalizados a tus alumnos basados en sus analisis de video con IA.',
  },
  {
    icon: Star,
    title: 'Reviews y reputacion',
    description: 'Acumula resenas verificadas de tus alumnos. Tu rating promedio se muestra en tu perfil publico.',
  },
  {
    icon: DollarSign,
    title: 'Define tus tarifas',
    description: 'Establece tu precio por hora y recibe pagos directamente a traves de la plataforma.',
  },
  {
    icon: TrendingUp,
    title: 'Llega a mas alumnos',
    description: 'Los jugadores te encuentran por deporte, ubicacion, especialidad y rango de precios en el marketplace.',
  },
]

export function CoachSection() {
  return (
    <section id="coaches" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Main pitch */}
            <div className="lg:w-5/12">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Monetiza tu expertise deportivo
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Unete al marketplace de coaches verificados. Gestiona alumnos, asigna planes de entrenamiento basados en IA, acumula reviews y llega a deportistas que buscan mejorar.
              </p>
              <GlassButton variant="default" size="lg" asChild>
                <Link href="/register?type=coach">
                  Registrarme como coach
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </GlassButton>
            </div>

            {/* Right: Benefits grid */}
            <div className="lg:w-7/12 grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <GlassCard
                  key={benefit.title}
                  intensity="light"
                  padding="lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
