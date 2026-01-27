'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { CheckCircle, Circle, ChevronRight, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingChecklistProps {
  analysisCount: number
  trainingPlanCount: number
}

export function OnboardingChecklist({
  analysisCount,
  trainingPlanCount,
}: OnboardingChecklistProps) {
  const { steps, completeStep } = useOnboardingStore()
  const [mounted, setMounted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-complete steps based on actual user data
  useEffect(() => {
    if (analysisCount > 0) {
      completeStep('first-analysis')
      completeStep('review-results')
    }
    if (trainingPlanCount > 0) {
      completeStep('training-plan')
    }
  }, [analysisCount, trainingPlanCount, completeStep])

  if (!mounted) {
    return null
  }

  const completedCount = steps.filter((s) => s.completed).length
  const allCompleted = completedCount === steps.length
  const progress = (completedCount / steps.length) * 100

  // Don't show if dismissed or all steps completed
  if (isDismissed || allCompleted) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Primeros pasos</h3>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-border">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-4 px-5 py-3 transition-colors',
              step.completed ? 'bg-muted/30' : 'hover:bg-muted/50'
            )}
          >
            {step.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'font-medium text-sm',
                  step.completed && 'text-muted-foreground line-through'
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {step.description}
              </p>
            </div>
            {!step.completed && step.href && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={step.href}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
