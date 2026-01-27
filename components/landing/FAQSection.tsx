'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
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
    question: 'Puedo cancelar mi suscripcion en cualquier momento?',
    answer:
      'Si, puedes cancelar tu suscripcion en cualquier momento desde tu perfil. No hay compromisos a largo plazo ni penalizaciones por cancelacion. Tu acceso continua hasta el final del periodo de facturacion.',
  },
  {
    question: 'Que deportes estan disponibles?',
    answer:
      'Actualmente ofrecemos analisis para Tenis, con soporte para 4 tecnicas diferentes (saque, derecha, reves, volea). Estamos trabajando para agregar Golf, Basketball y Futbol proximamente.',
  },
  {
    question: 'Como funcionan los planes de entrenamiento?',
    answer:
      'Basado en los errores identificados en tu analisis, nuestra IA genera un plan de ejercicios personalizados. Cada ejercicio incluye instrucciones detalladas, repeticiones recomendadas y videos de referencia para que puedas practicar correctamente.',
  },
  {
    question: 'Es seguro mi video?',
    answer:
      'Tus videos se almacenan de forma segura y privada en servidores encriptados. Solo tu puedes acceder a ellos. Cumplimos con todas las normativas de proteccion de datos y nunca compartimos tu contenido con terceros.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas mas comunes sobre SportTech.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-4 text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
