import type { ChunkCategory } from '@prisma/client'
import type { ParsedPage } from './pdf-parser'

export interface Chunk {
  content: string
  chunkIndex: number
  pageStart: number | null
  pageEnd: number | null
  category: ChunkCategory
  technique: string | null
  tokenCount: number
}

interface ChunkOptions {
  maxChars?: number
  overlapChars?: number
}

const DEFAULT_MAX_CHARS = 4000 // ~1000 tokens
const DEFAULT_OVERLAP_CHARS = 800 // ~200 tokens

// Spanish keyword patterns for auto-categorization
const EXERCISE_KEYWORDS = [
  'ejercicio', 'repeticiones', 'series', 'drill', 'sets', 'reps',
  'entrenamiento práctico', 'realizar', 'ejecutar', 'repetir',
  'calentamiento', 'estiramiento', 'circuito',
]

const TRAINING_PLAN_KEYWORDS = [
  'plan de entrenamiento', 'semana', 'periodización', 'mesociclo',
  'macrociclo', 'microciclo', 'planificación', 'programa de entrenamiento',
  'fase de preparación', 'fase competitiva',
]

const THEORY_KEYWORDS = [
  'biomecánica', 'biomecanica', 'principio', 'fundamento', 'técnica',
  'tecnica', 'fisiología', 'fisiologia', 'anatomía', 'anatomia',
  'cinética', 'cinetica', 'cinemática', 'cinematica', 'concepto',
]

// Sport technique detection
const TECHNIQUE_KEYWORDS: Record<string, string[]> = {
  serve: ['saque', 'servicio', 'serve', 'toss', 'lanzamiento'],
  forehand: ['derecha', 'forehand', 'drive'],
  backhand: ['revés', 'reves', 'backhand'],
  volley: ['volea', 'volley', 'red'],
  footwork: ['juego de pies', 'footwork', 'desplazamiento', 'movimiento'],
}

export function chunkPages(pages: ParsedPage[], options?: ChunkOptions): Chunk[] {
  const maxChars = options?.maxChars ?? DEFAULT_MAX_CHARS
  const overlapChars = options?.overlapChars ?? DEFAULT_OVERLAP_CHARS

  const chunks: Chunk[] = []
  let chunkIndex = 0

  // Combine all pages into paragraph blocks with page tracking
  const paragraphBlocks: { text: string; page: number }[] = []
  for (const page of pages) {
    const paragraphs = page.text.split(/\n\s*\n/)
    for (const para of paragraphs) {
      const trimmed = para.trim()
      if (trimmed.length > 0) {
        paragraphBlocks.push({ text: trimmed, page: page.pageNumber })
      }
    }
  }

  let currentContent = ''
  let currentPageStart: number | null = null
  let currentPageEnd: number | null = null

  for (let i = 0; i < paragraphBlocks.length; i++) {
    const block = paragraphBlocks[i]

    // If adding this paragraph exceeds maxChars, finalize current chunk
    if (currentContent.length > 0 && currentContent.length + block.text.length + 2 > maxChars) {
      chunks.push(buildChunk(currentContent, chunkIndex++, currentPageStart, currentPageEnd))

      // Apply overlap: keep the tail of the current content
      if (overlapChars > 0 && currentContent.length > overlapChars) {
        currentContent = currentContent.slice(-overlapChars)
        // Keep the page tracking for overlap
        currentPageStart = currentPageEnd
      } else {
        currentContent = ''
        currentPageStart = null
        currentPageEnd = null
      }
    }

    // If a single paragraph exceeds maxChars, split by sentences
    if (block.text.length > maxChars) {
      if (currentContent.length > 0) {
        chunks.push(buildChunk(currentContent, chunkIndex++, currentPageStart, currentPageEnd))
        currentContent = ''
      }

      const sentences = block.text.split(/(?<=[.!?])\s+/)
      let sentenceBuffer = ''
      for (const sentence of sentences) {
        if (sentenceBuffer.length + sentence.length + 1 > maxChars && sentenceBuffer.length > 0) {
          chunks.push(buildChunk(sentenceBuffer, chunkIndex++, block.page, block.page))
          sentenceBuffer = sentenceBuffer.length > overlapChars
            ? sentenceBuffer.slice(-overlapChars)
            : ''
        }
        sentenceBuffer += (sentenceBuffer ? ' ' : '') + sentence
      }
      if (sentenceBuffer.length > 0) {
        currentContent = sentenceBuffer
        currentPageStart = block.page
        currentPageEnd = block.page
      }
      continue
    }

    if (!currentPageStart) currentPageStart = block.page
    currentPageEnd = block.page
    currentContent += (currentContent ? '\n\n' : '') + block.text
  }

  // Finalize last chunk
  if (currentContent.trim().length > 0) {
    chunks.push(buildChunk(currentContent, chunkIndex++, currentPageStart, currentPageEnd))
  }

  return chunks
}

function buildChunk(
  content: string,
  chunkIndex: number,
  pageStart: number | null,
  pageEnd: number | null
): Chunk {
  return {
    content,
    chunkIndex,
    pageStart,
    pageEnd,
    category: detectCategory(content),
    technique: detectTechnique(content),
    tokenCount: Math.ceil(content.length / 4), // rough estimate
  }
}

function detectCategory(text: string): ChunkCategory {
  const lower = text.toLowerCase()

  const exerciseScore = EXERCISE_KEYWORDS.filter((kw) => lower.includes(kw)).length
  const planScore = TRAINING_PLAN_KEYWORDS.filter((kw) => lower.includes(kw)).length
  const theoryScore = THEORY_KEYWORDS.filter((kw) => lower.includes(kw)).length

  const maxScore = Math.max(exerciseScore, planScore, theoryScore)
  if (maxScore === 0) return 'GENERAL'

  if (planScore === maxScore) return 'TRAINING_PLAN'
  if (exerciseScore === maxScore) return 'EXERCISE'
  if (theoryScore === maxScore) return 'THEORY'

  return 'GENERAL'
}

function detectTechnique(text: string): string | null {
  const lower = text.toLowerCase()

  let bestTechnique: string | null = null
  let bestCount = 0

  for (const [technique, keywords] of Object.entries(TECHNIQUE_KEYWORDS)) {
    const count = keywords.filter((kw) => lower.includes(kw)).length
    if (count > bestCount) {
      bestCount = count
      bestTechnique = technique
    }
  }

  return bestCount >= 1 ? bestTechnique : null
}
