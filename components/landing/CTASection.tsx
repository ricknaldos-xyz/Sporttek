'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 border-t border-border/40">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Tu desarrollo deportivo empieza aqui
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Analisis IA, rankings, torneos, coaches, canchas y comunidad.
          Todo lo que necesitas para tenis y padel en una sola plataforma.
        </p>

        <GlassButton variant="default" size="xl" asChild>
          <Link href="/register">
            Comenzar gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </GlassButton>

        <p className="text-sm text-muted-foreground mt-6">
          Sin tarjeta de credito. Comienza en segundos.
        </p>
      </div>
    </section>
  )
}
