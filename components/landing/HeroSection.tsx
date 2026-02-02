'use client'

import Link from 'next/link'
import { ArrowRight, Brain, Trophy, Swords } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { StatsCounter } from '@/components/landing/StatsCounter'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh-gradient min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <GlassBadge variant="primary" size="lg">
              <Brain className="h-3.5 w-3.5 mr-1.5" />
              Analisis IA en 2 min
            </GlassBadge>
            <GlassBadge variant="primary" size="lg">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              Rankings nacionales Peru
            </GlassBadge>
            <GlassBadge variant="primary" size="lg">
              <Swords className="h-3.5 w-3.5 mr-1.5" />
              Torneos con brackets reales
            </GlassBadge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Tu carrera deportiva en{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
              una sola plataforma
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Sube un video de tu técnica y recibe tu análisis IA en minutos.
            Descubre tu nivel, compite en el ranking y mejora con un plan personalizado.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <GlassButton variant="solid" size="xl" asChild>
              <Link href="/register?type=player">
                Soy Jugador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GlassButton>
            <GlassButton variant="outline" size="xl" asChild>
              <Link href="/register?type=coach">
                Soy Entrenador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GlassButton>
          </div>

          <p className="text-sm text-muted-foreground mb-16">
            Gratis — sin tarjeta de crédito
          </p>

          {/* Stats — real data from API */}
          <StatsCounter />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-success/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </section>
  )
}
