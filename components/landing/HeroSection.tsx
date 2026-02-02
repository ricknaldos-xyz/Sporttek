'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { StatsCounter } from '@/components/landing/StatsCounter'

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex items-center">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Tu carrera deportiva en{' '}
            <span className="text-primary">una sola plataforma</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Sube un video de tu técnica y recibe tu análisis IA en minutos.
            Descubre tu nivel, compite en el ranking y mejora con un plan personalizado.
          </p>

          {/* Single CTA */}
          <div className="flex items-center justify-center mb-6">
            <GlassButton variant="default" size="xl" asChild>
              <Link href="/register">
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GlassButton>
          </div>

          <p className="text-sm text-muted-foreground mb-16">
            Sin tarjeta de crédito. Comienza en segundos.
          </p>

          {/* Stats — real data from API */}
          <StatsCounter />
        </div>
      </div>
    </section>
  )
}
