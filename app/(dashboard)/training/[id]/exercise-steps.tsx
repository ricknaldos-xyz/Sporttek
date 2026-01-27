'use client'

import { motion } from 'framer-motion'
import type { ExerciseStep } from '@/lib/training/types'

interface ExerciseStepsProps {
  steps: ExerciseStep[]
}

export function ExerciseSteps({ steps }: ExerciseStepsProps) {
  return (
    <div className="relative pl-8 space-y-4">
      {/* Vertical connector line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

      {steps.map((step, index) => (
        <motion.div
          key={step.stepNumber}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
          className="relative"
        >
          {/* Step number circle */}
          <div className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{step.stepNumber}</span>
          </div>

          <div className="space-y-1">
            <h5 className="text-sm font-semibold">{step.title}</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.instruction}
            </p>
            {step.keyCue && (
              <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-xs font-medium text-primary">{step.keyCue}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
