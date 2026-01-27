import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Tenista amateur',
    content:
      'Despues de solo 2 semanas usando SportTech, mi saque mejoro notablemente. La IA identifico un error en mi lanzamiento que ningun entrenador habia notado antes.',
    rating: 5,
  },
  {
    name: 'Maria L.',
    role: 'Jugadora de club',
    content:
      'Los planes de entrenamiento son increibles. Cada ejercicio esta pensado especificamente para corregir mis errores. He mejorado mi derecha en un mes.',
    rating: 5,
  },
  {
    name: 'Roberto S.',
    role: 'Entrenador personal',
    content:
      'Uso SportTech con mis alumnos. Les ayuda a visualizar sus errores y entender exactamente que deben corregir. Ha transformado mis sesiones de entrenamiento.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de deportistas ya estan mejorando su tecnica con SportTech.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 relative"
            >
              {/* Quote decoration */}
              <div className="absolute -top-3 left-6 text-6xl text-primary/20 font-serif">
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 relative z-10">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
