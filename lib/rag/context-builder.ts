import type { RetrievedChunk } from './retriever'

const CATEGORY_LABELS: Record<string, string> = {
  THEORY: 'Fundamentos Teóricos',
  EXERCISE: 'Ejercicios de Referencia',
  TRAINING_PLAN: 'Planes de Entrenamiento de Referencia',
  GENERAL: 'Material de Referencia',
}

export function buildRagContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return ''

  const grouped: Record<string, RetrievedChunk[]> = {}
  for (const chunk of chunks) {
    const cat = chunk.category || 'GENERAL'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(chunk)
  }

  let context = '\n\n## CONTEXTO DE REFERENCIA (Material de entrenamiento profesional)\n\n'

  // Order: theory first, then exercises, then plans, then general
  const order = ['THEORY', 'EXERCISE', 'TRAINING_PLAN', 'GENERAL']
  for (const cat of order) {
    const catChunks = grouped[cat]
    if (!catChunks || catChunks.length === 0) continue

    context += `### ${CATEGORY_LABELS[cat] || cat}\n`
    for (const chunk of catChunks) {
      const source = chunk.pageStart
        ? `[Fuente: ${chunk.documentFilename}, p.${chunk.pageStart}]`
        : `[Fuente: ${chunk.documentFilename}]`
      context += `---\n${chunk.content}\n${source}\n\n`
    }
  }

  context += `\nUSA este material de referencia para enriquecer tu análisis con fundamentos teóricos y ejercicios reales cuando sea relevante. Prioriza ejercicios del material de referencia sobre ejercicios genéricos.\n`

  return context
}
