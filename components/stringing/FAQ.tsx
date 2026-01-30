'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqItems = [
  {
    question: 'Cuanto tiempo demora el encordado?',
    answer: 'El servicio Estandar tiene un tiempo de entrega de 24-48 horas habiles. El servicio Express se entrega el mismo dia si solicitas antes de las 12pm.',
  },
  {
    question: 'Que pasa si no estoy en casa para el recojo?',
    answer: 'Coordinamos otra fecha de recojo sin costo adicional. Tambien puedes optar por llevar tu raqueta directamente al taller.',
  },
  {
    question: 'Puedo elegir mi propia cuerda?',
    answer: 'Si, tu eliges la cuerda y la tension que deseas. Si no estas seguro, nuestros encordadores pueden recomendarte la mejor opcion segun tu nivel y estilo de juego.',
  },
  {
    question: 'Ofrecen garantia en el encordado?',
    answer: 'Si, ofrecemos 7 dias de garantia en el servicio de encordado. Si la cuerda se rompe dentro de ese periodo por un defecto en el trabajo, lo reencordamos sin costo.',
  },
  {
    question: 'En que distritos tienen cobertura?',
    answer: 'Actualmente cubrimos 48 distritos de Lima Metropolitana incluyendo Miraflores, San Isidro, Surco, La Molina, San Borja y muchos mas. Proximamente en Arequipa, Cusco y Trujillo.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Preguntas Frecuentes</h2>
      </div>
      <div className="space-y-2">
        {faqItems.map((item, index) => (
          <GlassCard
            key={index}
            intensity="light"
            padding="none"
            className="overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-sm pr-4">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-40 pb-4 px-4' : 'max-h-0'
              }`}
            >
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
