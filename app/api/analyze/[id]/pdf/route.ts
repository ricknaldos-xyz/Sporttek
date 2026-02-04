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

    // Fetch analysis with all related data including training plan and history
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
        // Page 3: Training Plan
        trainingPlan: {
          include: {
            exercises: {
              orderBy: [
                { dayNumber: 'asc' },
                { orderInDay: 'asc' },
              ],
              take: 10, // Limit to first 10 exercises
            },
          },
        },
        // Page 4: Previous analysis for comparison
        previousAnalysis: {
          select: {
            id: true,
            createdAt: true,
            overallScore: true,
            technique: {
              select: { name: true },
            },
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

    // Fetch analysis history (last 5 analyses of the same technique)
    const analysisHistory = await prisma.analysis.findMany({
      where: {
        userId: session.user.id,
        techniqueId: analysis.techniqueId,
        status: 'COMPLETED',
        createdAt: { lte: analysis.createdAt },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        createdAt: true,
        overallScore: true,
      },
    })

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
      // Page 3: Training Plan
      trainingPlan: analysis.trainingPlan
        ? {
            id: analysis.trainingPlan.id,
            title: analysis.trainingPlan.title,
            description: analysis.trainingPlan.description,
            durationDays: analysis.trainingPlan.durationDays,
            difficulty: analysis.trainingPlan.difficulty,
            exercises: analysis.trainingPlan.exercises.map((ex) => ({
              id: ex.id,
              name: ex.name,
              description: ex.description,
              instructions: ex.instructions,
              sets: ex.sets,
              reps: ex.reps,
              durationMins: ex.durationMins,
              frequency: ex.frequency,
              videoUrl: ex.videoUrl,
            })),
          }
        : null,
      // Page 4: History
      previousAnalysis: analysis.previousAnalysis
        ? {
            id: analysis.previousAnalysis.id,
            createdAt: analysis.previousAnalysis.createdAt,
            overallScore: analysis.previousAnalysis.overallScore,
            technique: {
              name: analysis.previousAnalysis.technique.name,
            },
          }
        : null,
      analysisHistory:
        analysisHistory.length > 1
          ? analysisHistory.map((h) => ({
              createdAt: h.createdAt,
              overallScore: h.overallScore,
            }))
          : undefined,
    }

    // Generate PDF
    const pdfBuffer = await renderAnalysisPDF(analysisForPDF)

    // Generate filename
    const techniqueName = analysis.technique.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const dateStr = new Date(analysis.createdAt).toISOString().split('T')[0]
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
