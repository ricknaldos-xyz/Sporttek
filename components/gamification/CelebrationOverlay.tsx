'use client'

import { useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { GlassButton } from '@/components/ui/glass-button'
import { useCelebrationStore } from '@/stores/celebrationStore'
import { BADGE_DEFINITIONS } from '@/lib/badges'
import { X } from 'lucide-react'

export function CelebrationOverlay() {
  const { currentCelebration, dismissCelebration } = useCelebrationStore()

  const triggerConfetti = useCallback(() => {
    // Fire confetti from both sides
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.2, y: 0.7 },
    })

    fire(0.2, {
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.8, y: 0.7 },
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.7 },
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.7 },
    })
  }, [])

  useEffect(() => {
    if (currentCelebration) {
      triggerConfetti()
    }
  }, [currentCelebration, triggerConfetti])

  if (!currentCelebration) {
    return null
  }

  const badgeDefinition = currentCelebration.badgeType
    ? BADGE_DEFINITIONS[currentCelebration.badgeType]
    : null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismissCelebration}
      />

      {/* Modal */}
      <div className="relative glass-heavy border-glass-strong rounded-2xl shadow-glass-xl max-w-sm w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={dismissCelebration}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="glass-primary px-6 py-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {currentCelebration.icon ||
              (badgeDefinition?.icon ?? '🎉')}
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentCelebration.title}</h2>
          <p className="text-muted-foreground">{currentCelebration.message}</p>
        </div>

        {badgeDefinition && (
          <div className="px-6 py-4 glass-ultralight text-center">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${badgeDefinition.color}`}
            >
              {badgeDefinition.name}
            </span>
          </div>
        )}

        <div className="px-6 py-4">
          <GlassButton onClick={dismissCelebration} variant="solid" className="w-full">
            Continuar
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
