import { getGeminiClient } from '@/lib/gemini/client'

const EMBEDDING_MODEL = 'text-embedding-004'
const BATCH_SIZE = 20

export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL })
  const result = await model.embedContent(text)
  return result.embedding.values
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL })
  const results: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (text) => {
        const result = await model.embedContent(text)
        return result.embedding.values
      })
    )
    results.push(...batchResults)
  }

  return results
}
