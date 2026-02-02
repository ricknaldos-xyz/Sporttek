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
    preferredPosition: 'right' as const,
  },
  {
    target: '[data-tour="analyses"]',
    title: 'Historial de analisis',
    description: 'Aqui puedes ver todos tus analisis anteriores y su progreso.',
    preferredPosition: 'right' as const,
  },
  {
    target: '[data-tour="training"]',
    title: 'Planes de entrenamiento',
    description: 'Genera planes personalizados basados en tus analisis para mejorar tu tecnica.',
    preferredPosition: 'right' as const,
  },
  {
    target: '[data-tour="rankings"]',
    title: 'Rankings',
    description: 'Compite con otros jugadores y sube en el ranking de tu zona y nivel.',
    preferredPosition: 'right' as const,
  },
  {
    target: '[data-tour="profile"]',
    title: 'Tu perfil',
    description: 'Configura tus preferencias, deporte y gestiona tu cuenta aqui.',
    preferredPosition: 'bottom' as const,
  },
]

function getResponsivePosition(
  targetRect: DOMRect,
  preferred: 'right' | 'bottom',
  tooltipWidth: number
): 'right' | 'bottom' | 'top' | 'left' {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // On mobile (< 1024px), prefer top/bottom positions
  if (viewportWidth < 1024) {
    // If target is in bottom half, show tooltip above
    if (targetRect.top > viewportHeight / 2) {
      return 'top'
    }
    return 'bottom'
  }

  // On desktop, check if right position fits
  if (preferred === 'right' && targetRect.right + tooltipWidth + 20 < viewportWidth) {
    return 'right'
  }

  // Fallback to bottom
  return 'bottom'
}

export function OnboardingTour() {
  const { isTourActive, tourStep, nextTourStep, previousTourStep, endTour } =
    useOnboardingStore()
  const [mounted, setMounted] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [position, setPosition] = useState<'right' | 'bottom' | 'top' | 'left'>('right')

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
      setPosition(getResponsivePosition(rect, step.preferredPosition, 300))

      // Scroll into view if needed
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isTourActive, tourStep])

  // Update position on resize
  useEffect(() => {
    if (!isTourActive || tourStep === null) return

    function handleResize() {
      const step = tourSteps[tourStep!]
      if (!step) return
      const target = document.querySelector(step.target)
      if (target) {
        const rect = target.getBoundingClientRect()
        setTargetRect(rect)
        setPosition(getResponsivePosition(rect, step.preferredPosition, 300))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isTourActive, tourStep])

  if (!mounted || !isTourActive || tourStep === null || !targetRect) {
    return null
  }

  const currentStep = tourSteps[tourStep]
  if (!currentStep) return null

  const isFirst = tourStep === 0
  const isLast = tourStep === tourSteps.length - 1
  const tooltipWidth = Math.min(300, window.innerWidth - 32)
  const padding = 12

  // Calculate tooltip position based on responsive position
  let tooltipStyle: React.CSSProperties = { width: tooltipWidth }

  switch (position) {
    case 'right':
      tooltipStyle = {
        ...tooltipStyle,
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translateY(-50%)',
      }
      break
    case 'bottom':
      tooltipStyle = {
        ...tooltipStyle,
        top: targetRect.bottom + padding,
        left: Math.max(16, Math.min(
          targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - 16
        )),
      }
      break
    case 'top':
      tooltipStyle = {
        ...tooltipStyle,
        bottom: window.innerHeight - targetRect.top + padding,
        left: Math.max(16, Math.min(
          targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - 16
        )),
      }
      break
    case 'left':
      tooltipStyle = {
        ...tooltipStyle,
        top: targetRect.top + targetRect.height / 2,
        right: window.innerWidth - targetRect.left + padding,
        transform: 'translateY(-50%)',
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
        style={tooltipStyle}
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
