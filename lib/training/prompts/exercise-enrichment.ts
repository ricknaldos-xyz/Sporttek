export function buildExerciseEnrichmentPrompt(
  exercises: Array<{ name: string; description: string; instructions: string }>,
  sportName: string,
  techniqueName: string
): string {
  const exerciseList = exercises
    .map(
      (e, i) => `${i + 1}. Nombre: ${e.name}
   Descripcion: ${e.description}
   Instrucciones: ${e.instructions.substring(0, 500)}`
    )
    .join('\n\n')

  return `Eres un entrenador deportivo experto en ${sportName}, especializado en ${techniqueName}.

Para cada ejercicio a continuacion, genera instrucciones detalladas paso a paso que permitan a un atleta entender EXACTAMENTE como ejecutar cada ejercicio.

Ejercicios:

${exerciseList}

Responde con un JSON array donde cada elemento tiene esta estructura exacta:
[
  {
    "exerciseIndex": 0,
    "summary": "resumen de 1-2 oraciones del ejercicio",
    "steps": [
      {
        "stepNumber": 1,
        "title": "titulo corto del paso (2-4 palabras)",
        "instruction": "instruccion detallada de que hacer en este paso",
        "keyCue": "frase clave corta de coaching para recordar"
      }
    ],
    "keyPoints": ["punto tecnico clave 1", "punto tecnico clave 2"],
    "commonMistakes": ["error comun que los atletas cometen"],
    "muscleGroups": ["grupo muscular principal"],
    "difficulty": "principiante|intermedio|avanzado",
    "equipmentNeeded": ["equipo necesario"]
  }
]

REGLAS:
1. Cada ejercicio debe tener entre 3 y 6 pasos secuenciales
2. Los keyCues deben ser frases cortas y memorables (maximo 8 palabras)
3. Incluye 2-4 keyPoints y 1-3 commonMistakes por ejercicio
4. Si no se necesita equipo especial, usa ["ninguno"]
5. El exerciseIndex corresponde al orden de los ejercicios (empieza en 0)
6. Responde SOLO con el JSON array, sin texto adicional
7. Todo el contenido debe estar en espanol`
}
