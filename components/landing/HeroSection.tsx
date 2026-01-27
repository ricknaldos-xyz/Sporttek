'use client'

import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Star, Swords, Trophy } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh-gradient min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <GlassBadge variant="primary" size="lg">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              Rankings nacionales en vivo
            </GlassBadge>
            <GlassBadge variant="primary" size="lg">
              <Swords className="h-3.5 w-3.5 mr-1.5" />
              Encuentra rivales de tu nivel
            </GlassBadge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Compite. Mejora.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
              Domina.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            La plataforma de ranking, competencia y comunidad para tenistas amateur en Peru.
            Sube videos, recibe tu skill score con IA, sube en el ranking nacional y encuentra rivales de tu nivel.
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

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">+1,500</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Jugadores
                </p>
              </div>
            </GlassCard>
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">+10,000</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Analisis IA
                </p>
              </div>
            </GlassCard>
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Swords className="h-5 w-5 text-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">+500</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Partidos jugados
                </p>
              </div>
            </GlassCard>
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">+50</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Entrenadores
                </p>
              </div>
            </GlassCard>
          </div>
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
