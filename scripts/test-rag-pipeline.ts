import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import path from 'path'

// Inline imports since we can't use path aliases in scripts
const prisma = new PrismaClient()

async function main() {
  const docsDir = path.join(process.cwd(), 'docs', 'references')
  const testFile = 'Tennis 10s Manual ESP.pdf'
  const filePath = path.join(docsDir, testFile)

  console.log(`\n=== RAG Pipeline Test ===`)
  console.log(`File: ${testFile}`)

  // 1. Read PDF
  console.log('\n1. Reading PDF file...')
  const buffer = await readFile(filePath)
  console.log(`   Size: ${(buffer.length / (1024 * 1024)).toFixed(1)} MB`)

  // 2. Parse PDF
  console.log('\n2. Extracting text from PDF...')
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 })
  const result = await parser.getText()
  const pages = result.pages
    .map((page: { num: number; text: string }) => ({
      pageNumber: page.num,
      text: page.text.trim(),
    }))
    .filter((p: { text: string }) => p.text.length > 0)
  await parser.destroy()
  console.log(`   Pages: ${result.total}`)
  console.log(`   Pages with text: ${pages.length}`)
  console.log(`   Sample (first 200 chars): ${pages[0]?.text.substring(0, 200)}...`)

  // 3. Chunk
  console.log('\n3. Chunking text...')
  const { chunkPages } = await import('../lib/rag/chunker')
  const chunks = chunkPages(pages)
  console.log(`   Chunks created: ${chunks.length}`)

  const categories: Record<string, number> = {}
  for (const c of chunks) {
    categories[c.category] = (categories[c.category] || 0) + 1
  }
  console.log(`   Categories: ${JSON.stringify(categories)}`)

  const techniques: Record<string, number> = {}
  for (const c of chunks) {
    if (c.technique) techniques[c.technique] = (techniques[c.technique] || 0) + 1
  }
  console.log(`   Techniques detected: ${JSON.stringify(techniques)}`)

  // 4. Generate embeddings (test with first 3 chunks only)
  console.log('\n4. Generating embeddings (first 3 chunks)...')
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!.trim())
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

  for (let i = 0; i < Math.min(3, chunks.length); i++) {
    const embResult = await model.embedContent(chunks[i].content)
    console.log(`   Chunk ${i}: ${embResult.embedding.values.length} dimensions, category=${chunks[i].category}, technique=${chunks[i].technique}`)
  }

  // 5. Create document record and process full pipeline
  console.log('\n5. Running full pipeline (create document + process all chunks)...')

  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!adminUser) throw new Error('No admin user found')

  const document = await prisma.document.create({
    data: {
      filename: testFile.replace(/ /g, '-').toLowerCase(),
      originalName: testFile,
      fileUrl: `/uploads/documents/${testFile}`,
      fileSize: buffer.length,
      sportSlug: 'tennis',
      status: 'UPLOADING',
      uploadedById: adminUser.id,
    },
  })
  console.log(`   Document created: ${document.id}`)

  // Process using our processor
  const { processDocument } = await import('../lib/rag/processor')

  // Copy file to expected location for local processing
  const { mkdir, writeFile } = await import('fs/promises')
  const { existsSync } = await import('fs')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, testFile), buffer)

  await processDocument(document.id)

  // 6. Verify
  console.log('\n6. Verifying...')
  const doc = await prisma.document.findUnique({
    where: { id: document.id },
    include: { _count: { select: { chunks: true } } },
  })
  console.log(`   Status: ${doc?.status}`)
  console.log(`   Page count: ${doc?.pageCount}`)
  console.log(`   Chunks stored: ${doc?._count.chunks}`)

  // 7. Test retrieval
  console.log('\n7. Testing retrieval...')
  const queryEmbedding = await model.embedContent('ejercicios para mejorar el saque de tenis')
  const vectorStr = `[${queryEmbedding.embedding.values.join(',')}]`

  const results = await prisma.$queryRawUnsafe<{ content: string; category: string; similarity: number }[]>(`
    SELECT content, category,
           1 - (embedding <=> $1::vector) AS similarity
    FROM document_chunks
    WHERE document_id = $2
    AND embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT 3
  `, vectorStr, document.id)

  for (const r of results) {
    console.log(`\n   [${r.category}] Similarity: ${Number(r.similarity).toFixed(4)}`)
    console.log(`   ${r.content.substring(0, 150)}...`)
  }

  console.log('\n=== Pipeline test completed successfully! ===\n')
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('FAILED:', err)
  process.exit(1)
})
