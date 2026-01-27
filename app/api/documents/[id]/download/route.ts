import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const document = await prisma.document.findUnique({ where: { id } })
  if (!document) {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
  }

  // Build absolute URL for redirect (fileUrl may be relative for local uploads)
  const redirectUrl = document.fileUrl.startsWith('http')
    ? document.fileUrl
    : new URL(document.fileUrl, _request.nextUrl.origin).toString()

  return NextResponse.redirect(redirectUrl)
}
