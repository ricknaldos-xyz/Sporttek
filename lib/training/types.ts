export interface ExerciseStep {
  stepNumber: number
  title: string
  instruction: string
  keyCue: string
  durationSeconds?: number
}

export interface StructuredExerciseData {
  version: 2
  summary: string
  steps: ExerciseStep[]
  keyPoints: string[]
  commonMistakes: string[]
  muscleGroups: string[]
  difficulty: 'principiante' | 'intermedio' | 'avanzado'
  equipmentNeeded: string[]
}
