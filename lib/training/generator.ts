import { prisma } from '@/lib/prisma'
import { Severity } from '@prisma/client'
import { retrieveRelevantChunks } from '@/lib/rag/retriever'
import { enrichExercisesWithStructuredContent } from '@/lib/training/enrichment'

interface GeneratePlanOptions {
  analysisId: string
  userId: string
  durationWeeks?: number
}

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

interface ExerciseBlueprint {
  name: string
  description: string
  instructions: string
  sets: number | null
  reps: number | null
  durationMins: number | null
  frequency: string
  videoUrl: string | null
  imageUrls: string[]
  issueId: string
}

export async function generateTrainingPlan({
  analysisId,
  userId,
  durationWeeks = 4,
}: GeneratePlanOptions) {
  // Get analysis with issues
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: {
      issues: true,
      technique: {
        include: { sport: true },
      },
      trainingPlan: true,
    },
  })

  if (!analysis) {
    throw new Error('Analisis no encontrado')
  }

  if (analysis.userId !== userId) {
    throw new Error('No autorizado')
  }

  if (analysis.trainingPlan) {
    throw new Error('Ya existe un plan de entrenamiento para este analisis')
  }

  if (analysis.issues.length === 0) {
    throw new Error('No hay problemas detectados para crear un plan')
  }

  // Sort issues by severity
  const sortedIssues = [...analysis.issues].sort(
    (a, b) => SEVERITY_WEIGHTS[b.severity] - SEVERITY_WEIGHTS[a.severity]
  )

  // Get relevant exercise templates
  const exerciseTemplates = await prisma.exerciseTemplate.findMany({
    where: {
      isActive: true,
      OR: [
        { sportSlugs: { has: analysis.technique.sport.slug } },
        { sportSlugs: { isEmpty: true } },
      ],
    },
  })

  // Calculate plan parameters
  const durationDays = durationWeeks * 7
  const difficulty = calculateDifficulty(sortedIssues)

  // Create the plan
  const plan = await prisma.trainingPlan.create({
    data: {
      userId,
      analysisId,
      title: `Plan de mejora: ${analysis.technique.name}`,
      description: `Plan personalizado de ${durationWeeks} semanas basado en tu analisis. Enfoque principal: ${
        analysis.priorityFocus || sortedIssues[0]?.title
      }`,
      durationDays,
      difficulty,
      status: 'ACTIVE',
    },
  })

  // --- Phase A: Build exercise pool from RAG + AI drills + template supplements ---
  const exercisePool: ExerciseBlueprint[] = []

  // RAG: Retrieve real exercises from knowledge base for each issue
  for (const issue of sortedIssues) {
    try {
      const ragChunks = await retrieveRelevantChunks(
        `${issue.title} ${issue.category} ejercicio drill corrección ${analysis.technique.name}`,
        {
          sportSlug: analysis.technique.sport.slug,
          category: ['EXERCISE', 'TRAINING_PLAN'],
          technique: analysis.technique.slug,
          limit: 2,
          threshold: 0.35,
        }
      )

      for (const chunk of ragChunks) {
        exercisePool.push({
          name: extractExerciseName(chunk.content),
          description: chunk.content.substring(0, 300),
          instructions: chunk.content,
          sets: extractNumber(chunk.content, /(\d+)\s*series/i) ?? 3,
          reps: extractNumber(chunk.content, /(\d+)\s*repet/i) ?? 15,
          durationMins: extractNumber(chunk.content, /(\d+)\s*min/i),
          frequency: calculateFrequency(issue.severity),
          videoUrl: null,
          imageUrls: [],
          issueId: issue.id,
        })
      }
    } catch (error) {
      console.warn('RAG exercise retrieval skipped for issue:', issue.id, error)
    }
  }

  for (const issue of sortedIssues) {
    // Skip AI drills if RAG already found exercises for this issue
    const hasRagExercise = exercisePool.some((e) => e.issueId === issue.id)

    // AI-generated drills (SECONDARY source if no RAG exercises)
    for (const drill of hasRagExercise ? [] : issue.drills.slice(0, 2)) {
      // Extract drill name (before the colon if present)
      const drillName = drill.includes(':') ? drill.split(':')[0].trim() : drill
      const drillInstructions = drill.includes(':')
        ? drill.split(':').slice(1).join(':').trim()
        : issue.correction

      exercisePool.push({
        name: drillName,
        description: `Ejercicio para mejorar: ${issue.title}`,
        instructions: drillInstructions,
        sets: 3,
        reps: 15,
        durationMins: null,
        frequency: calculateFrequency(issue.severity),
        videoUrl: null,
        imageUrls: [],
        issueId: issue.id,
      })
    }

    // Template supplements (SECONDARY - max 1 per issue)
    const matchingTemplates = findMatchingTemplates(exerciseTemplates, issue)
    const template = matchingTemplates[0]
    if (template) {
      // Skip if we already have an AI drill with a similar name
      const alreadyHasSimilar = exercisePool.some(
        (e) =>
          e.issueId === issue.id &&
          e.name.toLowerCase().includes(template.name.toLowerCase())
      )
      if (!alreadyHasSimilar) {
        exercisePool.push({
          name: template.name,
          description: `${template.description}\n\nPara corregir: ${issue.title}`,
          instructions: template.instructions,
          sets: template.defaultSets,
          reps: template.defaultReps,
          durationMins: template.defaultDurationMins,
          frequency: calculateFrequency(issue.severity),
          videoUrl: template.videoUrl,
          imageUrls: template.imageUrls,
          issueId: issue.id,
        })
      }
    }

    // Fallback: if no AI drills and no templates, create from correction
    if (!exercisePool.some((e) => e.issueId === issue.id)) {
      exercisePool.push({
        name: `Correccion: ${issue.title}`,
        description: issue.description,
        instructions: issue.correction,
        sets: 3,
        reps: 15,
        durationMins: null,
        frequency: calculateFrequency(issue.severity),
        videoUrl: null,
        imageUrls: [],
        issueId: issue.id,
      })
    }
  }

  // --- Phase B: Distribute exercises across all training days with progression ---
  const trainingDaysPerWeek = Math.min(6, Math.max(3, difficulty + 1))
  const exercisesPerDay = Math.max(2, Math.min(4, Math.ceil(exercisePool.length / trainingDaysPerWeek)))

  // Space training days evenly across the week
  const trainingDayOffsets: number[] = []
  for (let i = 0; i < trainingDaysPerWeek; i++) {
    trainingDayOffsets.push(Math.round((i * 7) / trainingDaysPerWeek))
  }

  const exercisesToCreate: {
    trainingPlanId: string
    name: string
    description: string
    instructions: string
    dayNumber: number
    orderInDay: number
    sets: number | null
    reps: number | null
    durationMins: number | null
    frequency: string
    videoUrl: string | null
    imageUrls: string[]
    issueId?: string
  }[] = []

  for (let week = 1; week <= durationWeeks; week++) {
    for (let dayIdx = 0; dayIdx < trainingDayOffsets.length; dayIdx++) {
      const absoluteDay = (week - 1) * 7 + trainingDayOffsets[dayIdx] + 1
      if (absoluteDay > durationDays) break

      // Filter exercises eligible for this day based on frequency
      const eligible = exercisePool.filter((bp) => {
        if (bp.frequency === 'daily') return true
        if (bp.frequency === '3x_week') {
          return dayIdx % 2 === 0 || dayIdx === trainingDaysPerWeek - 1
        }
        if (bp.frequency === '2x_week') {
          return dayIdx === 0 || dayIdx === Math.floor(trainingDaysPerWeek / 2)
        }
        return true
      })

      if (eligible.length === 0) continue

      // Rotate through eligible exercises, offset by dayIdx to vary each day
      const count = Math.min(exercisesPerDay, eligible.length)
      for (let e = 0; e < count; e++) {
        const poolIdx = (dayIdx + e) % eligible.length
        const blueprint = eligible[poolIdx]
        const { sets, reps, durationMins } = applyProgression(
          { sets: blueprint.sets, reps: blueprint.reps, durationMins: blueprint.durationMins },
          week
        )

        exercisesToCreate.push({
          trainingPlanId: plan.id,
          name: blueprint.name,
          description: blueprint.description,
          instructions: blueprint.instructions,
          dayNumber: absoluteDay,
          orderInDay: e + 1,
          sets,
          reps,
          durationMins,
          frequency: blueprint.frequency,
          videoUrl: blueprint.videoUrl,
          imageUrls: blueprint.imageUrls,
          issueId: blueprint.issueId,
        })
      }
    }
  }

  // Create exercises in batch
  const exercises = await Promise.all(
    exercisesToCreate.map((data) => {
      const { issueId, ...exerciseData } = data
      return prisma.exercise.create({
        data: exerciseData,
      })
    })
  )

  // Enrich exercises with structured step-by-step content
  try {
    await enrichExercisesWithStructuredContent(
      exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        description: ex.description,
        instructions: ex.instructions,
      })),
      analysis.technique.sport.name,
      analysis.technique.name
    )
  } catch (error) {
    console.warn('Exercise enrichment failed, falling back to basic instructions:', error)
  }

  // Create exercise-issue links
  const exerciseIssueLinks = exercisesToCreate
    .map((data, index) => ({
      exerciseId: exercises[index].id,
      issueId: data.issueId,
    }))
    .filter((link) => link.issueId)

  if (exerciseIssueLinks.length > 0) {
    await prisma.exerciseIssue.createMany({
      data: exerciseIssueLinks as { exerciseId: string; issueId: string }[],
    })
  }

  // Return complete plan
  return prisma.trainingPlan.findUnique({
    where: { id: plan.id },
    include: {
      exercises: {
        include: {
          targetIssues: {
            include: { issue: true },
          },
        },
        orderBy: [{ dayNumber: 'asc' }, { orderInDay: 'asc' }],
      },
      analysis: {
        include: {
          technique: true,
        },
      },
    },
  })
}

function findMatchingTemplates(
  templates: {
    name: string
    targetAreas: string[]
    category: string
    description: string
    instructions: string
    defaultSets: number | null
    defaultReps: number | null
    defaultDurationMins: number | null
    videoUrl: string | null
    imageUrls: string[]
  }[],
  issue: { category: string; drills: string[] }
) {
  const category = issue.category.toLowerCase()

  // Strict match: template targetArea must exactly equal the issue category
  const strictMatches = templates.filter((t) =>
    t.targetAreas.some((area) => area.toLowerCase() === category)
  )

  if (strictMatches.length > 0) return strictMatches

  // Secondary match: drill name contains template name or vice versa
  const drillNameMatches = templates.filter((t) =>
    issue.drills.some(
      (drill) =>
        drill.toLowerCase().includes(t.name.toLowerCase()) ||
        t.name.toLowerCase().includes(drill.toLowerCase())
    )
  )

  return drillNameMatches
}

function applyProgression(
  base: { sets: number | null; reps: number | null; durationMins: number | null },
  week: number
): { sets: number | null; reps: number | null; durationMins: number | null } {
  const multiplier = 1 + (week - 1) * 0.15
  return {
    sets: base.sets ? Math.round(base.sets * multiplier) : null,
    reps: base.reps ? Math.round(base.reps * multiplier) : null,
    durationMins: base.durationMins ? Math.round(base.durationMins * multiplier) : null,
  }
}

function calculateDifficulty(issues: { severity: Severity }[]): number {
  if (issues.length === 0) return 1

  const avgSeverity =
    issues.reduce((sum, i) => sum + SEVERITY_WEIGHTS[i.severity], 0) /
    issues.length

  return Math.min(5, Math.max(1, Math.round(avgSeverity)))
}

function calculateFrequency(severity: Severity): string {
  switch (severity) {
    case 'CRITICAL':
    case 'HIGH':
      return 'daily'
    case 'MEDIUM':
      return '3x_week'
    case 'LOW':
      return '2x_week'
  }
}

function extractExerciseName(text: string): string {
  // Try to extract a title-like first line
  const firstLine = text.split('\n')[0].trim()
  // Remove numbering like "1.", "1)", "- "
  const cleaned = firstLine.replace(/^[\d]+[.)]\s*/, '').replace(/^[-•]\s*/, '')
  // Cap at 60 chars
  if (cleaned.length > 0 && cleaned.length <= 60) return cleaned
  if (cleaned.length > 60) return cleaned.substring(0, 57) + '...'
  return 'Ejercicio de referencia'
}

function extractNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern)
  if (match) {
    const num = parseInt(match[1], 10)
    if (!isNaN(num) && num > 0 && num < 1000) return num
  }
  return null
}
