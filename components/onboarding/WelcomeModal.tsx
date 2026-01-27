'use client'

import { useEffect, useState } from 'react'
import { GlassButton } from '@/components/ui/glass-button'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Video, Target, Dumbbell, TrendingUp, X } from 'lucide-react'

interface WelcomeModalProps {
  userName?: string
}

export function WelcomeModal({ userName }: WelcomeModalProps) {
  const { showWelcomeModal, setShowWelcomeModal, startTour } = useOnboardingStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !showWelcomeModal) {
    return null
  }

  function handleStartTour() {
    setShowWelcomeModal(false)
    startTour()
  }

  function handleSkip() {
    setShowWelcomeModal(false)
  }

  const features = [
    {
      icon: Video,
      title: 'Sube tu video',
      description: 'Captura tu tecnica deportiva',
    },
    {
      icon: Target,
      title: 'Analisis con IA',
      description: 'Recibe feedback detallado',
    },
    {
      icon: Dumbbell,
      title: 'Plan personalizado',
      description: 'Ejercicios para mejorar',
    },
    {
      icon: TrendingUp,
      title: 'Sigue tu progreso',
      description: 'Mide tu mejora',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative glass-heavy border-glass-strong rounded-2xl shadow-glass-xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="glass-primary px-6 py-8 text-center">
          <div className="text-5xl mb-4">🎾</div>
          <h2 className="text-2xl font-bold mb-2">
            Bienvenido{userName ? `, ${userName}` : ''}!
          </h2>
          <p className="text-muted-foreground">
            Mejora tu tecnica deportiva con el poder de la inteligencia artificial
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 p-3 rounded-xl glass-ultralight border-glass"
              >
                <feature.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <GlassButton onClick={handleStartTour} variant="solid" className="w-full">
              Comenzar tour guiado
            </GlassButton>
            <GlassButton onClick={handleSkip} variant="ghost" className="w-full">
              Explorar por mi cuenta
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  )
}
