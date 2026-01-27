interface PlanIssue {
  id: string
  title: string
  category: string
  severity: string
  description: string
  correction: string
  drills: string[]
}

export function buildPlanGenerationPrompt(
  sportName: string,
  techniqueName: string,
  issues: PlanIssue[],
  ragContext: string
): string {
  const issuesList = issues
    .map(
      (issue, i) =>
        `${i + 1}. [ID: ${issue.id}] "${issue.title}" (${issue.severity})
   Categoría: ${issue.category}
   Descripción: ${issue.description}
   Corrección sugerida: ${issue.correction}
   Ejercicios sugeridos: ${issue.drills.length > 0 ? issue.drills.join('; ') : 'ninguno'}`
    )
    .join('\n\n')

  const ragSection =
    ragContext.length > 0
      ? `\n## MATERIAL DE REFERENCIA (usa como inspiración, NO copies nombres textualmente)\n\n${ragContext}\n`
      : ''

  return `Eres un entrenador deportivo experto en ${sportName}, especializado en la técnica de ${techniqueName}.

Tu tarea es diseñar un conjunto de ejercicios correctivos para un atleta basándote en los problemas detectados en su análisis de técnica.

## PROBLEMAS DETECTADOS EN EL ANÁLISIS

${issuesList}
${ragSection}
## INSTRUCCIONES

Genera un JSON array con 8 a 12 ejercicios ÚNICOS y DIVERSOS que aborden los problemas listados arriba.

Responde EXCLUSIVAMENTE con el JSON array, sin texto adicional:

\`\`\`json
[
  {
    "name": "Nombre descriptivo del ejercicio (5-60 caracteres)",
    "description": "Descripción de 1-2 oraciones explicando qué hace el ejercicio y por qué ayuda",
    "instructions": "Instrucciones detalladas de cómo ejecutar el ejercicio paso a paso",
    "targetIssueIds": ["id-del-issue-1"],
    "sets": 3,
    "reps": 12,
    "durationMins": null,
    "frequency": "daily",
    "category": "strength"
  }
]
\`\`\`

## REGLAS OBLIGATORIAS

1. MÍNIMO 8 ejercicios, MÁXIMO 12
2. Cada problema (issue) debe tener AL MENOS 2 ejercicios que lo trabajen
3. Los problemas de severidad CRITICAL/HIGH deben tener más ejercicios que LOW/MEDIUM
4. Los nombres deben ser nombres REALES de ejercicios deportivos en español (ej: "Rotación externa con banda", "Shadow swing de derecha", "Plancha lateral con rotación")
5. NUNCA uses fragmentos de oraciones como nombre — deben ser títulos claros y concisos
6. Incluye VARIEDAD de categorías:
   - "strength" (fuerza muscular)
   - "mobility" (flexibilidad y rango de movimiento)
   - "drill" (práctica técnica específica del deporte)
   - "coordination" (coordinación y propiocepción)
   - "warmup" (calentamiento activo)
7. frequency debe ser: "daily", "3x_week", o "2x_week"
8. sets y reps son para ejercicios de fuerza/repetición. Para ejercicios de duración, usa durationMins en lugar de reps
9. Los targetIssueIds deben ser IDs exactos de los problemas listados arriba
10. Las instrucciones deben ser lo suficientemente detalladas para que el atleta pueda ejecutar el ejercicio sin ayuda adicional
11. Usa los "ejercicios sugeridos" de cada issue como INSPIRACIÓN, pero genera nombres y descripciones propias
12. Todo el contenido debe estar en español`
}
