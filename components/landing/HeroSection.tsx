'use client'

import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Star, Sparkles } from 'lucide-react'
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
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              +1,000 deportistas activos
            </GlassBadge>
            <GlassBadge variant="primary" size="lg">
              <Star className="h-3.5 w-3.5 mr-1.5 fill-primary" />
              4.9/5 satisfaccion
            </GlassBadge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Perfecciona tu tecnica deportiva con{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
              Inteligencia Artificial
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Sube un video de tu tecnica, obtiene un analisis detallado de
            errores y recibe un plan de entrenamiento personalizado para
            mejorar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <GlassButton variant="solid" size="xl" asChild>
              <Link href="/register">
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GlassButton>
            <GlassButton variant="outline" size="xl" asChild>
              <Link href="#how-it-works">Ver como funciona</Link>
            </GlassButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">+1,500</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Usuarios activos
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
                  Analisis realizados
                </p>
              </div>
            </GlassCard>
            <GlassCard intensity="light" padding="md" hover="lift">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">98%</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Satisfaccion
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Background decoration - animated blobs */}
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
