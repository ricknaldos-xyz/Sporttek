'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgress } from '@/hooks/useProgress'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'

interface ExerciseItemProps {
  exercise: {
    id: string
    name: string
    description: string
    instructions: string | null
    sets: number | null
    reps: number | null
    durationMins: number | null
    frequency: string
    targetIssues: Array<{
      issue: { title: string }
    }>
    progressLogs: Array<{ id: string }>
  }
  trainingPlanId: string
}

export function ExerciseItem({ exercise, trainingPlanId }: ExerciseItemProps) {
  const [isCompleted, setIsCompleted] = useState(exercise.progressLogs.length > 0)
  const { toggleExercise, isLoading } = useProgress(trainingPlanId)

  function handleToggle() {
    const newCompleted = !isCompleted
    setIsCompleted(newCompleted)
    toggleExercise(exercise.id, newCompleted, {
      setsCompleted: exercise.sets || undefined,
      repsCompleted: exercise.reps || undefined,
      durationMins: exercise.durationMins || undefined,
    })
  }

  return (
    <div
      className={cn(
        'p-5 transition-all duration-[var(--duration-normal)]',
        isCompleted && 'bg-success/5'
      )}
    >
      <div className="flex items-start gap-4">
        <GlassButton
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            isCompleted
              ? 'bg-success/20 text-success hover:bg-success/30'
              : 'glass-ultralight border-glass hover:glass-light'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </GlassButton>
        <div className="flex-1">
          <h4 className={cn('font-medium', isCompleted && 'line-through text-muted-foreground')}>
            {exercise.name}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {exercise.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            {exercise.sets && (
              <GlassBadge variant="default">
                {exercise.sets} series
              </GlassBadge>
            )}
            {exercise.reps && (
              <GlassBadge variant="default">
                {exercise.reps} repeticiones
              </GlassBadge>
            )}
            {exercise.durationMins && (
              <GlassBadge variant="default">
                {exercise.durationMins} minutos
              </GlassBadge>
            )}
            <GlassBadge variant="primary">
              {exercise.frequency === 'daily'
                ? 'Diario'
                : exercise.frequency === '3x_week'
                ? '3x semana'
                : '2x semana'}
            </GlassBadge>
          </div>

          {exercise.instructions && (
            <div className="mt-3 p-3 glass-ultralight border-glass rounded-xl">
              <p className="text-sm">{exercise.instructions}</p>
            </div>
          )}

          {exercise.targetIssues.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">
                Corrige:{' '}
                {exercise.targetIssues
                  .map((ti) => ti.issue.title)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
