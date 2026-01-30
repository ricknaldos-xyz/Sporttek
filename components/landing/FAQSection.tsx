'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Que tipo de videos puedo subir?',
    answer:
      'Puedes subir videos en formato MP4, MOV o WebM. Recomendamos grabar en posicion horizontal, con buena iluminacion, y desde un angulo que muestre claramente tu tecnica. La duracion ideal es de 10-30 segundos.',
  },
  {
    question: 'Cuanto tiempo tarda el analisis?',
    answer:
      'El analisis con IA generalmente tarda entre 2-5 minutos dependiendo de la longitud del video y la complejidad de la tecnica analizada.',
  },
  {
    question: 'Que deportes estan disponibles?',
    answer:
      'Actualmente ofrecemos analisis para Tenis (saque, derecha, reves, volea), Padel y Pickleball. El plan gratuito incluye acceso a Tenis, mientras que los planes Pro y Elite incluyen todos los deportes. Pronto agregaremos mas deportes como futbol.',
  },
  {
    question: 'Como funciona el ranking?',
    answer:
      'Cada analisis que completas contribuye a tu skill score, calculado por nuestra IA. Segun tu puntaje, subes de tier: Bronce, Plata, Oro, Platino y Diamante. El ranking nacional muestra a los mejores jugadores de Peru por deporte.',
  },
  {
    question: 'Como encuentro rivales para jugar?',
    answer:
      'La seccion de Matchmaking te sugiere rivales de tu nivel basandose en tu ELO score y ubicacion. Puedes enviar desafios y coordinar partidos directamente desde la plataforma.',
  },
  {
    question: 'Que es el Coach Marketplace?',
    answer:
      'Es un directorio de entrenadores verificados donde puedes encontrar coaches por deporte, ubicacion, especialidad y rango de precios. Los entrenadores pueden ofrecer sus servicios y los jugadores pueden contactarlos directamente.',
  },
  {
    question: 'Puedo cancelar mi suscripcion en cualquier momento?',
    answer:
      'Si, puedes cancelar tu suscripcion en cualquier momento desde tu perfil. No hay compromisos a largo plazo ni penalizaciones por cancelacion. Tu acceso continua hasta el final del periodo de facturacion.',
  },
  {
    question: 'Es seguro mi video?',
    answer:
      'Tus videos se almacenan de forma segura y privada. Solo tu puedes acceder a ellos. Nunca compartimos tu contenido con terceros.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas mas comunes sobre la plataforma.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <GlassCard
              key={index}
              intensity={openIndex === index ? 'medium' : 'light'}
              padding="none"
              className="overflow-hidden transition-all duration-[var(--duration-normal)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:glass-ultralight transition-all duration-[var(--duration-normal)] rounded-2xl"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <div
                  className={cn(
                    'glass-primary border-glass rounded-full p-1.5 transition-transform duration-[var(--duration-normal)]',
                    openIndex === index && 'rotate-180'
                  )}
                >
                  <ChevronDown className="h-4 w-4 text-primary" />
                </div>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-[var(--duration-slow)] ease-[var(--ease-liquid)]',
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
