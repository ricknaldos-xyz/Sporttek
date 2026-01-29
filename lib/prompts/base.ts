export const JSON_OUTPUT_SCHEMA = `
## INSTRUCCIONES DE ANALISIS

Analiza las imagenes proporcionadas y responde EXCLUSIVAMENTE en formato JSON valido con la siguiente estructura:

\`\`\`json
{
  "overallScore": <numero del 1 al 10>,
  "summary": "<resumen de 2-3 oraciones del analisis general>",
  "strengths": [
    "<fortaleza 1 observada>",
    "<fortaleza 2 observada>"
  ],
  "priorityFocus": "<el area mas critica que el jugador debe trabajar primero>",
  "issues": [
    {
      "category": "<posture|timing|balance|grip|swing|contact|followthrough|footwork|toss>",
      "title": "<titulo corto del problema, maximo 5 palabras>",
      "description": "<descripcion detallada de lo que esta mal y por que afecta el golpe>",
      "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
      "correction": "<instrucciones especificas de como corregir este error>",
      "drills": [
        "<ejercicio correctivo 1>",
        "<ejercicio correctivo 2>"
      ]
    }
  ]
}
\`\`\`

REGLAS IMPORTANTES:
1. Responde SOLO con el JSON, sin texto adicional antes o despues
2. Se especifico y tecnico en las descripciones
3. Los drills deben ser ejercicios practicos y realizables sin equipo especial
4. Si no puedes identificar problemas claros, indica un score alto (8-10) y menos issues
5. Ordena los issues de mayor a menor severidad
6. Minimo 1 issue, maximo 5 issues`

export type PromptBuilder = (
  techniqueSlug: string,
  variantSlug: string | null,
  correctForm: unknown,
  commonErrors: unknown,
  ragContext?: string
) => string
