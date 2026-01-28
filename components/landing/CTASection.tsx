'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <GlassCard
          intensity="primary"
          padding="none"
          className="max-w-4xl mx-auto text-center overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 p-12 lg:p-16">
            <div className="glass-light border-glass rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Comienza hoy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Listo para mejorar tu tecnica?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Unete a la comunidad de tenistas que ya estan mejorando su
              rendimiento con SportTech.
            </p>
            <GlassButton variant="solid" size="xl" asChild>
              <Link href="/register">
                Comenzar gratis ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </GlassButton>
            <p className="text-sm text-muted-foreground mt-6">
              Sin tarjeta de credito. Comienza en segundos.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
