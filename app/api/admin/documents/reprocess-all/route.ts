import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { processDocument } from '@/lib/rag/processor'

export const maxDuration = 300 // 5 minutes

// Reprocess all documents to regenerate embeddings
export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo administradores' }, { status: 403 })
    }

    // Get all completed documents
    const documents = await prisma.document.findMany({
      where: { status: 'COMPLETED' },
      select: { id: true, originalName: true }
    })

    if (documents.length === 0) {
      return NextResponse.json({
        message: 'No hay documentos para reprocesar',
        processed: 0
      })
    }

    logger.debug(`[reprocess] Starting reprocess of ${documents.length} documents`)

    const results: Array<{ name: string; status: string; error?: string }> = []

    // Process documents in parallel batches of 5
    const BATCH_SIZE = 5
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(
        batch.map(async (doc) => {
          logger.debug(`[reprocess] Processing: ${doc.originalName}`)
          try {
            await processDocument(doc.id)
            logger.debug(`[reprocess] ${doc.originalName} completed`)
            return { name: doc.originalName, status: 'OK' } as const
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error)
            logger.error(`[reprocess] ${doc.originalName} failed:`, errorMsg)
            return { name: doc.originalName, status: 'ERROR', error: errorMsg } as const
          }
        })
      )
      results.push(...batchResults)
    }

    const successful = results.filter(r => r.status === 'OK').length
    const failed = results.filter(r => r.status === 'ERROR').length

    return NextResponse.json({
      message: `Reprocesados ${successful}/${documents.length} documentos`,
      processed: successful,
      failed,
      results
    })
  } catch (error) {
    logger.error('[reprocess] Error:', error)
    return NextResponse.json(
      { error: 'Error al reprocesar documentos' },
      { status: 500 }
    )
  }
}
