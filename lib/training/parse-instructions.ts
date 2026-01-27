import type { StructuredExerciseData } from './types'

export function parseExerciseInstructions(
  instructions: string | null
): StructuredExerciseData | null {
  if (!instructions) return null
  try {
    const parsed = JSON.parse(instructions)
    if (parsed.version === 2 && Array.isArray(parsed.steps)) {
      return parsed as StructuredExerciseData
    }
  } catch {
    // Not structured JSON — plain text from old plans
  }
  return null
}
