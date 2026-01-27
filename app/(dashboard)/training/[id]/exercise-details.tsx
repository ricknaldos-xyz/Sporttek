'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Dumbbell, Target } from 'lucide-react'
import { GlassBadge } from '@/components/ui/glass-badge'
import type { StructuredExerciseData } from '@/lib/training/types'

interface ExerciseDetailsProps {
  data: StructuredExerciseData
}

export function ExerciseDetails({ data }: ExerciseDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="space-y-4"
    >
      {/* Key Points */}
      {data.keyPoints.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" />
            Puntos Clave
          </h5>
          <ul className="space-y-1.5">
            {data.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {data.commonMistakes.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            Errores Comunes
          </h5>
          <ul className="space-y-1.5">
            {data.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Equipment & Muscle Groups */}
      <div className="flex flex-wrap gap-4">
        {data.equipmentNeeded.length > 0 && data.equipmentNeeded[0] !== 'ninguno' && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Dumbbell className="h-3.5 w-3.5" />
              Equipo
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {data.equipmentNeeded.map((eq, i) => (
                <GlassBadge key={i} variant="default">{eq}</GlassBadge>
              ))}
            </div>
          </div>
        )}

        {data.muscleGroups.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              Grupos Musculares
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {data.muscleGroups.map((mg, i) => (
                <GlassBadge key={i} variant="primary">{mg}</GlassBadge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
