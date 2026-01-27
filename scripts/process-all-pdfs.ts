import { PrismaClient } from '@prisma/client'
import { readFile, mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { processDocument } from '../lib/rag/processor'

const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!adminUser) throw new Error('No admin user')

  const docsDir = path.join(process.cwd(), 'docs', 'references')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })

  const files = [
    { name: '2026-rulebook-chapter-7_the-competition_19dec25.pdf', sport: 'tennis' },
    { name: 'Teaching+Tennis+Skills.pdf', sport: 'tennis' },
    { name: 'manual.pdf', sport: 'tennis' },
  ]

  for (const file of files) {
    const existing = await prisma.document.findFirst({ where: { originalName: file.name } })
    if (existing) {
      console.log('Skip (already exists):', file.name)
      continue
    }

    console.log('\nProcessing:', file.name)
    const buffer = await readFile(path.join(docsDir, file.name))
    console.log('  Size:', (buffer.length / (1024 * 1024)).toFixed(1), 'MB')

    // Copy to uploads dir
    await writeFile(path.join(uploadDir, file.name), buffer)

    const doc = await prisma.document.create({
      data: {
        filename: file.name.replace(/ /g, '-').toLowerCase(),
        originalName: file.name,
        fileUrl: `/uploads/documents/${file.name}`,
        fileSize: buffer.length,
        sportSlug: file.sport,
        status: 'UPLOADING',
        uploadedById: adminUser.id,
      },
    })
    console.log('  Document ID:', doc.id)

    try {
      await processDocument(doc.id)
      const result = await prisma.document.findUnique({
        where: { id: doc.id },
        include: { _count: { select: { chunks: true } } },
      })
      console.log('  Status:', result?.status, '| Pages:', result?.pageCount, '| Chunks:', result?._count.chunks)
    } catch (err) {
      console.error('  FAILED:', err instanceof Error ? err.message : err)
    }
  }

  // Summary
  console.log('\n=== Summary ===')
  const docs = await prisma.document.findMany({ include: { _count: { select: { chunks: true } } } })
  for (const d of docs) {
    console.log(`${d.originalName} | ${d.status} | ${d.pageCount} pages | ${d._count.chunks} chunks`)
  }
  const totalChunks = await prisma.documentChunk.count()
  console.log('Total chunks:', totalChunks)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
