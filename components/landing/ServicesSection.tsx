'use client'

import Link from 'next/link'
import {
  ShoppingBag,
  Wrench,
  MapPin,
  Swords,
  ArrowRight,
  Package,
  Clock,
  CreditCard,
  Users,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'

const services = [
  {
    id: 'tienda',
    icon: ShoppingBag,
    title: 'Tienda deportiva',
    description:
      'Raquetas, pelotas, grips, bolsos y accesorios de las mejores marcas. Envío a todo el país con seguimiento en tiempo real.',
    features: [
      { icon: Package, text: 'Productos verificados' },
      { icon: CreditCard, text: 'Pago seguro integrado' },
    ],
    href: '/tienda',
    cta: 'Ver productos',
    dark: false,
    wide: true,
  },
  {
    id: 'encordado',
    icon: Wrench,
    title: 'Servicio de encordado',
    description:
      'Elige marca, modelo, tensión y tipo de cuerda. Recojo a domicilio o entrega en taller. Seguimiento del estado de tu raqueta.',
    features: [
      { icon: Clock, text: 'Express 24h disponible' },
      { icon: MapPin, text: 'Recojo a domicilio' },
    ],
    href: '/encordado',
    cta: 'Solicitar encordado',
    dark: true,
    wide: false,
  },
  {
    id: 'canchas',
    icon: MapPin,
    title: 'Reserva de canchas',
    description:
      'Canchas de tenis y padel cerca de ti. Filtra por superficie, techado y horario. Pago online y confirmación instantánea.',
    features: [
      { icon: Clock, text: 'Disponibilidad en tiempo real' },
      { icon: CreditCard, text: 'Reserva y paga online' },
    ],
    href: '/courts',
    cta: 'Buscar canchas',
    dark: false,
    wide: false,
  },
  {
    id: 'matchmaking',
    icon: Swords,
    title: 'Encuentra rivales',
    description:
      'El sistema te sugiere jugadores de tu nivel basándose en tu ELO y ubicación. Envía desafíos, coordina partidos y registra resultados.',
    features: [
      { icon: Users, text: 'Matching por nivel y zona' },
      { icon: Swords, text: 'Desafíos 1v1 y dobles' },
    ],
    href: '/matchmaking',
    cta: 'Buscar rivales',
    dark: true,
    wide: true,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tienda, encordado, canchas y matchmaking. El ecosistema completo para que solo te preocupes por jugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {services.map((service) => (
            <GlassCard
              key={service.id}
              intensity={service.dark ? 'dark' : 'light'}
              padding="lg"
              className={service.wide ? 'md:col-span-2' : ''}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${service.dark ? 'bg-background/10' : 'bg-primary/10'}`}>
                    <service.icon className={`h-5 w-5 ${service.dark ? 'text-background' : 'text-primary'}`} />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${service.dark ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  {service.features.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-2 text-sm">
                      <feature.icon className={`h-4 w-4 ${service.dark ? 'text-background/50' : 'text-primary'}`} />
                      <span className={service.dark ? 'text-background/70' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <Link
                    href={service.href}
                    className={`text-sm font-medium transition-colors ${service.dark ? 'text-background hover:text-background/80' : 'hover:text-primary'}`}
                  >
                    {service.cta}
                  </Link>
                  <GlassButton
                    variant={service.dark ? 'ghost' : 'default'}
                    size="icon-circle"
                    className={service.dark ? 'bg-background/10 hover:bg-background/20' : ''}
                    asChild
                  >
                    <Link href={service.href}>
                      <ArrowRight className={`h-5 w-5 ${service.dark ? 'text-background' : ''}`} />
                    </Link>
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
