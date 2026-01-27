import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('1. Enabling pgvector extension...')
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector')
    console.log('   Done.')

    console.log('2. Adding embedding column (vector 768)...')
    await prisma.$executeRawUnsafe('ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS embedding vector(768)')
    console.log('   Done.')

    console.log('3. Creating HNSW index...')
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
        ON document_chunks
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64)
    `)
    console.log('   Done.')

    console.log('\npgvector setup completed successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
