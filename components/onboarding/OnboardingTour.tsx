'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { GlassButton } from '@/components/ui/glass-button'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const tourSteps = [
  {
    target: '[data-tour="new-analysis"]',
    title: 'Crea un nuevo analisis',
    description: 'Sube un video o imagen de tu tecnica para recibir feedback detallado con IA.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="analyses"]',
    title: 'Historial de analisis',
    description: 'Aqui puedes ver todos tus analisis anteriores y su progreso.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="training"]',
    title: 'Planes de entrenamiento',
    description: 'Genera planes personalizados basados en tus analisis para mejorar tu tecnica.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="profile"]',
    title: 'Tu perfil',
    description: 'Configura tus preferencias y gestiona tu cuenta aqui.',
    position: 'bottom' as const,
  },
]

export function OnboardingTour() {
  const { isTourActive, tourStep, nextTourStep, previousTourStep, endTour } =
    useOnboardingStore()
  const [mounted, setMounted] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isTourActive || tourStep === null) {
      setTargetRect(null)
      return
    }

    const step = tourSteps[tourStep]
    if (!step) return

    const target = document.querySelector(step.target)
    if (target) {
      const rect = target.getBoundingClientRect()
      setTargetRect(rect)

      // Scroll into view if needed
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isTourActive, tourStep])

  if (!mounted || !isTourActive || tourStep === null || !targetRect) {
    return null
  }

  const currentStep = tourSteps[tourStep]
  if (!currentStep) return null

  const isFirst = tourStep === 0
  const isLast = tourStep === tourSteps.length - 1

  // Calculate tooltip position
  let tooltipStyle: React.CSSProperties = {}
  const padding = 12
  const tooltipWidth = 300

  switch (currentStep.position) {
    case 'right':
      tooltipStyle = {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translateY(-50%)',
      }
      break
    case 'bottom':
      tooltipStyle = {
        top: targetRect.bottom + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      }
      break
  }

  const content = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with spotlight */}
      <div className="absolute inset-0 bg-black/50" onClick={endTour}>
        {/* Spotlight hole */}
        <div
          className="absolute bg-transparent ring-4 ring-primary rounded-lg shadow-glass-glow"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), var(--glass-shadow-glow)',
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        className="absolute glass-heavy border-glass-strong rounded-xl shadow-glass-xl p-4 z-10"
        style={{ ...tooltipStyle, width: tooltipWidth }}
      >
        <button
          onClick={endTour}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="font-semibold mb-2 pr-6">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {currentStep.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === tourStep ? 'bg-primary' : 'glass-ultralight border-glass'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {!isFirst && (
              <GlassButton variant="ghost" size="sm" onClick={previousTourStep}>
                <ChevronLeft className="h-4 w-4" />
              </GlassButton>
            )}
            <GlassButton variant="solid" size="sm" onClick={isLast ? endTour : nextTourStep}>
              {isLast ? 'Finalizar' : 'Siguiente'}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
