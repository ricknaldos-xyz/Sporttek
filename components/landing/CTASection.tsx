import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 lg:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Listo para mejorar tu tecnica?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Unete a miles de deportistas que ya estan mejorando su rendimiento
            con SportTech.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/register">
              Comenzar gratis ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Sin tarjeta de credito. Comienza en segundos.
          </p>
        </div>
      </div>
    </section>
  )
}
