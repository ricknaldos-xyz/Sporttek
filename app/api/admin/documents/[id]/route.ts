import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { id } = await params

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        _count: { select: { chunks: true } },
        uploadedBy: { select: { name: true, email: true } },
      },
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Document get error:', error)
    return NextResponse.json({ error: 'Error al obtener documento' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { id } = await params

    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    // Delete from blob storage if applicable
    if (document.fileUrl && !document.fileUrl.startsWith('/uploads/') && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { del } = await import('@vercel/blob')
        await del(document.fileUrl)
      } catch (e) {
        console.error('Failed to delete blob:', e)
      }
    }

    // Delete document (chunks cascade)
    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json({ error: 'Error al eliminar documento' }, { status: 500 })
  }
}
