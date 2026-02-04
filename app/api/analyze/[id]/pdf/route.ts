import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderAnalysisPDF } from '@/lib/pdf'
import type { AnalysisForPDF } from '@/lib/pdf'

export const maxDuration = 30 // 30 seconds for PDF generation

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        technique: {
          include: { sport: true },
        },
        issues: {
          orderBy: [
            { severity: 'asc' }, // CRITICAL first (alphabetically first)
            { category: 'asc' },
          ],
        },
        user: {
          select: {
            name: true,
            playerProfile: {
              select: {
                skillTier: true,
                effectiveScore: true,
              },
            },
          },
        },
        mediaItems: {
          select: {
            url: true,
            type: true,
          },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      )
    }

    if (analysis.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (analysis.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'El análisis aún no está completo' },
        { status: 400 }
      )
    }

    // Transform data for PDF
    const analysisForPDF: AnalysisForPDF = {
      id: analysis.id,
      createdAt: analysis.createdAt,
      overallScore: analysis.overallScore,
      summary: analysis.summary,
      strengths: analysis.strengths || [],
      priorityFocus: analysis.priorityFocus,
      technique: {
        name: analysis.technique.name,
        sport: {
          name: analysis.technique.sport.name,
        },
      },
      issues: analysis.issues.map((issue) => ({
        id: issue.id,
        category: issue.category,
        title: issue.title,
        description: issue.description,
        severity: issue.severity as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
        correction: issue.correction,
        drills: issue.drills || [],
        timestamp: issue.timestamp,
        frameUrl: issue.frameUrl,
      })),
      user: {
        name: analysis.user.name,
        playerProfile: analysis.user.playerProfile,
      },
      mediaItems: analysis.mediaItems,
    }

    // Generate PDF
    const pdfBuffer = await renderAnalysisPDF(analysisForPDF)

    // Generate filename
    const techniqueName = analysis.technique.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const dateStr = new Date(analysis.createdAt)
      .toISOString()
      .split('T')[0]
    const filename = `sporttek-${techniqueName}-${dateStr}.pdf`

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer)

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Error al generar el PDF. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}
