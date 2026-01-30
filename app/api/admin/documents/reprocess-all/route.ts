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

    // Process each document sequentially
    for (const doc of documents) {
      logger.debug(`[reprocess] Processing: ${doc.originalName}`)
      try {
        await processDocument(doc.id)
        results.push({ name: doc.originalName, status: 'OK' })
        logger.debug(`[reprocess] ✓ ${doc.originalName} completed`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        results.push({ name: doc.originalName, status: 'ERROR', error: errorMsg })
        logger.error(`[reprocess] ✗ ${doc.originalName} failed:`, errorMsg)
      }
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
