'use client'

import { Star, Quote } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Tenista amateur, Lima',
    content:
      'Subi un video de mi saque y la IA detecto que mi lanzamiento era inconsistente. El plan de ejercicios me ayudo a corregirlo en pocas semanas. Muy util.',
    rating: 5,
  },
  {
    name: 'Andrea P.',
    role: 'Jugadora de padel, Miraflores',
    content:
      'Me encanta poder analizar mi bandeja y ver exactamente donde pierdo potencia. El matchmaking me ayudo a encontrar pareja de mi nivel para torneos.',
    rating: 5,
  },
  {
    name: 'Roberto S.',
    role: 'Entrenador, San Isidro',
    content:
      'Lo uso con mis alumnos de tenis y padel para que vean sus errores tecnicos de forma objetiva. El marketplace me permite llegar a mas alumnos.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lo que dicen nuestros primeros usuarios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deportistas y entrenadores que ya estan usando la plataforma para mejorar su rendimiento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <GlassCard
              key={index}
              intensity="light"
              padding="lg"
              hover="lift"
              className="relative"
            >
              {/* Quote decoration */}
              <div className="absolute -top-2 left-4">
                <div className="glass-primary border-glass rounded-full p-2">
                  <Quote className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-warning fill-warning"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-primary border-glass flex items-center justify-center text-primary font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
