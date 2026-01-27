import Link from 'next/link'
import { ArrowRight, Users, BarChart3, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium">
              +1,000 deportistas activos
            </span>
            <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary" />
              4.9/5 satisfaccion
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Perfecciona tu tecnica deportiva con{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Inteligencia Artificial
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Sube un video de tu tecnica, obtiene un analisis detallado de errores
            y recibe un plan de entrenamiento personalizado para mejorar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/register">
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="#how-it-works">Ver como funciona</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl sm:text-3xl font-bold">+1,500</span>
              </div>
              <p className="text-sm text-muted-foreground">Usuarios activos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-2xl sm:text-3xl font-bold">+10,000</span>
              </div>
              <p className="text-sm text-muted-foreground">Analisis realizados</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span className="text-2xl sm:text-3xl font-bold">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Satisfaccion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
