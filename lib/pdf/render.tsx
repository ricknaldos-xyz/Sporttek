import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, severityLabels } from './styles'
import type { AnalysisForPDF } from './types'
import { tierLabels } from './types'

// Helper to get severity style
function getSeverityStyle(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return styles.severityCritical
    case 'HIGH':
      return styles.severityHigh
    case 'MEDIUM':
      return styles.severityMedium
    case 'LOW':
      return styles.severityLow
    default:
      return styles.severityMedium
  }
}

// Helper to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Helper to format short date
function formatShortDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-PE', {
    month: 'short',
    day: 'numeric',
  })
}

export async function renderAnalysisPDF(analysis: AnalysisForPDF): Promise<Buffer> {
  const date = formatDate(analysis.createdAt)
  const tier = analysis.user.playerProfile?.skillTier
  const tierLabel = tier ? tierLabels[tier] || tier : null

  // Group issues by category
  const issuesByCategory = analysis.issues.reduce(
    (acc, issue) => {
      const cat = issue.category || 'General'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(issue)
      return acc
    },
    {} as Record<string, typeof analysis.issues>
  )

  const highPriorityCount = analysis.issues.filter(
    (i) => i.severity === 'CRITICAL' || i.severity === 'HIGH'
  ).length

  // Calculate total pages
  const hasTrainingPlan = analysis.trainingPlan && analysis.trainingPlan.exercises.length > 0
  const hasHistory = analysis.previousAnalysis || (analysis.analysisHistory && analysis.analysisHistory.length > 1)

  let totalPages = 2 // Base: summary + issues
  if (hasTrainingPlan) totalPages++
  if (hasHistory) totalPages++

  // Get top 3 exercises for page 3
  const topExercises = hasTrainingPlan
    ? analysis.trainingPlan!.exercises.slice(0, 3)
    : []

  // Calculate score change for page 4
  const previousScore = analysis.previousAnalysis?.overallScore
  const currentScore = analysis.overallScore
  const scoreChange = previousScore && currentScore
    ? currentScore - previousScore
    : null
  const changePercent = previousScore && scoreChange
    ? ((scoreChange / previousScore) * 100).toFixed(1)
    : null

  const doc = (
    <Document>
      {/* PAGE 1: RESUMEN EJECUTIVO */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SportTek</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{date}</Text>
            <Text style={styles.headerId}>ID: {analysis.id.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.sportBadge}>{analysis.technique.sport.name}</Text>
          <Text style={styles.title}>Análisis de {analysis.technique.name}</Text>
          {analysis.user.name && (
            <Text style={styles.subtitle}>{analysis.user.name}</Text>
          )}
        </View>

        {/* Score Cards */}
        <View style={styles.scoreSection}>
          {/* Main Score */}
          <View style={[styles.scoreCard, styles.scoreCardPrimary]}>
            <Text style={[styles.scoreLabel, styles.scoreLabelWhite]}>
              Puntuación General
            </Text>
            <Text style={[styles.scoreValue, styles.scoreValueWhite]}>
              {analysis.overallScore?.toFixed(1) ?? '--'}
            </Text>
            <Text style={[styles.scoreMax, styles.scoreMaxWhite]}>/ 100</Text>
            {tierLabel && (
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>Tier {tierLabel}</Text>
              </View>
            )}
          </View>

          {/* Issues Summary */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Áreas de Mejora</Text>
            <Text style={styles.scoreValue}>{analysis.issues.length}</Text>
            <Text style={styles.scoreMax}>
              {highPriorityCount} prioritarias
            </Text>
          </View>
        </View>

        {/* Summary */}
        {analysis.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Análisis</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{analysis.summary}</Text>
            </View>
          </View>
        )}

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fortalezas Identificadas</Text>
            <View style={styles.strengthsGrid}>
              {analysis.strengths.slice(0, 6).map((strength, idx) => (
                <View key={idx} style={styles.strengthItem}>
                  <Text style={styles.strengthCheck}>✓</Text>
                  <Text style={styles.strengthText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Priority Focus */}
        {analysis.priorityFocus && (
          <View style={styles.priorityBox}>
            <Text style={styles.priorityLabel}>ENFOQUE PRIORITARIO</Text>
            <Text style={styles.priorityText}>{analysis.priorityFocus}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generado por SportTek • sporttek.pe
          </Text>
          <Text style={styles.footerPage}>Página 1 de {totalPages}</Text>
        </View>
      </Page>

      {/* PAGE 2: ANÁLISIS DETALLADO */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SportTek</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Análisis de {analysis.technique.name}</Text>
            <Text style={styles.headerId}>{date}</Text>
          </View>
        </View>

        {/* Issues Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas de Mejora Detalladas</Text>
          <Text style={styles.issuesIntro}>
            A continuación se detallan los aspectos técnicos identificados que puedes trabajar
            para mejorar tu {analysis.technique.name.toLowerCase()}. Están ordenados por prioridad.
          </Text>

          {/* Issues by category */}
          {Object.entries(issuesByCategory).map(([category, issues]) => (
            <View key={category} style={{ marginBottom: 15 }}>
              {issues.map((issue, idx) => (
                <View key={issue.id || idx} style={styles.issueCard}>
                  <View style={styles.issueHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.issueCategory}>{category}</Text>
                      <Text style={styles.issueTitle}>{issue.title}</Text>
                    </View>
                    <Text
                      style={[
                        styles.issueSeverity,
                        getSeverityStyle(issue.severity),
                      ]}
                    >
                      {severityLabels[issue.severity] || issue.severity}
                    </Text>
                  </View>

                  <Text style={styles.issueDescription}>{issue.description}</Text>

                  {issue.correction && (
                    <View style={styles.issueCorrection}>
                      <Text style={styles.issueCorrectionIcon}>💡</Text>
                      <Text style={styles.issueCorrectionText}>{issue.correction}</Text>
                    </View>
                  )}

                  {issue.drills && issue.drills.length > 0 && (
                    <View style={styles.drillsContainer}>
                      <Text style={styles.drillsLabel}>Ejercicios sugeridos:</Text>
                      {issue.drills.slice(0, 3).map((drill, dIdx) => (
                        <Text key={dIdx} style={styles.drillItem}>
                          • {drill}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generado por SportTek • sporttek.pe
          </Text>
          <Text style={styles.footerPage}>Página 2 de {totalPages}</Text>
        </View>
      </Page>

      {/* PAGE 3: PLAN DE ACCIÓN (if training plan exists) */}
      {hasTrainingPlan && (
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>SportTek</Text>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>Plan de Acción</Text>
              <Text style={styles.headerId}>{analysis.technique.name}</Text>
            </View>
          </View>

          {/* Plan Summary */}
          <View style={styles.planSummary}>
            <View style={styles.planSummaryItem}>
              <Text style={styles.planSummaryValue}>{analysis.trainingPlan!.durationDays}</Text>
              <Text style={styles.planSummaryLabel}>días</Text>
            </View>
            <View style={styles.planSummaryItem}>
              <Text style={styles.planSummaryValue}>{analysis.trainingPlan!.exercises.length}</Text>
              <Text style={styles.planSummaryLabel}>ejercicios</Text>
            </View>
            <View style={styles.planSummaryItem}>
              <Text style={styles.planSummaryValue}>Nivel {analysis.trainingPlan!.difficulty}</Text>
              <Text style={styles.planSummaryLabel}>dificultad</Text>
            </View>
          </View>

          {/* Section Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top 3 Ejercicios Recomendados</Text>
            <Text style={styles.issuesIntro}>
              Estos son los ejercicios más importantes para trabajar las áreas de mejora identificadas.
              Realízalos de forma consistente para ver resultados.
            </Text>

            {/* Exercises */}
            {topExercises.map((exercise, idx) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={styles.exerciseNumber}>
                      <Text style={styles.exerciseNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                  </View>
                  <Text style={styles.exerciseFrequency}>{exercise.frequency}</Text>
                </View>

                <Text style={styles.exerciseDescription}>{exercise.description}</Text>

                {exercise.instructions && (
                  <Text style={styles.exerciseInstructions}>{exercise.instructions}</Text>
                )}

                {/* Metrics */}
                <View style={styles.exerciseMetrics}>
                  {exercise.sets && (
                    <View style={styles.exerciseMetric}>
                      <Text style={styles.exerciseMetricLabel}>Series:</Text>
                      <Text style={styles.exerciseMetricValue}>{exercise.sets}</Text>
                    </View>
                  )}
                  {exercise.reps && (
                    <View style={styles.exerciseMetric}>
                      <Text style={styles.exerciseMetricLabel}>Reps:</Text>
                      <Text style={styles.exerciseMetricValue}>{exercise.reps}</Text>
                    </View>
                  )}
                  {exercise.durationMins && (
                    <View style={styles.exerciseMetric}>
                      <Text style={styles.exerciseMetricLabel}>Duración:</Text>
                      <Text style={styles.exerciseMetricValue}>{exercise.durationMins} min</Text>
                    </View>
                  )}
                </View>

                {/* Video QR placeholder */}
                {exercise.videoUrl && (
                  <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                      <Text style={styles.qrText}>QR</Text>
                    </View>
                    <Text style={styles.qrHint}>
                      Escanea para ver el video tutorial de este ejercicio
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notas del Coach</Text>
            <View style={styles.notesLines} />
            <View style={styles.notesLines} />
            <View style={styles.notesLines} />
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              Generado por SportTek • sporttek.pe
            </Text>
            <Text style={styles.footerPage}>Página 3 de {totalPages}</Text>
          </View>
        </Page>
      )}

      {/* PAGE 4: HISTORIAL Y PROGRESO (if previous analysis exists) */}
      {hasHistory && (
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>SportTek</Text>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>Historial de Progreso</Text>
              <Text style={styles.headerId}>{analysis.technique.name}</Text>
            </View>
          </View>

          {/* Intro */}
          <Text style={styles.historyIntro}>
            Compara tu progreso con análisis anteriores de la misma técnica.
            La consistencia en el entrenamiento es clave para mejorar.
          </Text>

          {/* Comparison Cards */}
          {analysis.previousAnalysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comparación con Análisis Anterior</Text>

              <View style={styles.comparisonCard}>
                {/* Previous */}
                <View style={styles.comparisonBox}>
                  <Text style={styles.comparisonLabel}>Anterior</Text>
                  <Text style={styles.comparisonScore}>
                    {analysis.previousAnalysis.overallScore?.toFixed(1) ?? '--'}
                  </Text>
                  <Text style={styles.comparisonDate}>
                    {formatShortDate(analysis.previousAnalysis.createdAt)}
                  </Text>
                </View>

                {/* Current */}
                <View style={[styles.comparisonBox, styles.comparisonBoxCurrent]}>
                  <Text style={[styles.comparisonLabel, styles.comparisonLabelWhite]}>Actual</Text>
                  <Text style={[styles.comparisonScore, styles.comparisonScoreWhite]}>
                    {currentScore?.toFixed(1) ?? '--'}
                  </Text>
                  <Text style={[styles.comparisonDate, styles.comparisonDateWhite]}>
                    {formatShortDate(analysis.createdAt)}
                  </Text>
                  {scoreChange !== null && (
                    <View style={[
                      styles.changeBadge,
                      scoreChange > 0 ? styles.changeBadgePositive :
                      scoreChange < 0 ? styles.changeBadgeNegative :
                      styles.changeBadgeNeutral
                    ]}>
                      <Text style={[
                        styles.changeText,
                        scoreChange > 0 ? styles.changeTextPositive :
                        scoreChange < 0 ? styles.changeTextNegative :
                        styles.changeTextNeutral
                      ]}>
                        {scoreChange > 0 ? '↑' : scoreChange < 0 ? '↓' : '='} {Math.abs(scoreChange).toFixed(1)} pts
                        {changePercent && ` (${scoreChange > 0 ? '+' : ''}${changePercent}%)`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Progress Chart (simple bar representation) */}
          {analysis.analysisHistory && analysis.analysisHistory.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evolución de Puntuación</Text>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Últimos {analysis.analysisHistory.length} análisis</Text>
                <View style={styles.chartArea}>
                  {analysis.analysisHistory.map((hist, idx) => {
                    const score = hist.overallScore ?? 0
                    const maxScore = 100
                    const heightPercent = (score / maxScore) * 100
                    const isLast = idx === analysis.analysisHistory!.length - 1

                    return (
                      <View key={idx} style={{ alignItems: 'center' }}>
                        <View
                          style={[
                            styles.chartBar,
                            isLast ? styles.chartBarCurrent : {},
                            { height: Math.max(heightPercent, 20) }
                          ]}
                        >
                          <Text style={styles.chartBarValue}>
                            {score.toFixed(0)}
                          </Text>
                        </View>
                        <Text style={styles.chartBarLabel}>
                          {formatShortDate(hist.createdAt)}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Insight */}
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>💡 Insight</Text>
            <Text style={styles.insightText}>
              {scoreChange !== null && scoreChange > 0
                ? `¡Excelente progreso! Has mejorado ${scoreChange.toFixed(1)} puntos desde tu último análisis. Sigue trabajando en los ejercicios recomendados para continuar mejorando.`
                : scoreChange !== null && scoreChange < 0
                ? `Tu puntuación bajó ${Math.abs(scoreChange).toFixed(1)} puntos. No te desanimes, esto puede ser normal al trabajar en nuevos aspectos técnicos. Revisa las áreas de mejora y enfócate en la consistencia.`
                : scoreChange === 0
                ? 'Tu puntuación se mantiene estable. Para seguir mejorando, considera aumentar la frecuencia de práctica o trabajar en aspectos técnicos específicos.'
                : 'Sigue analizando tu técnica regularmente para ver tu progreso a lo largo del tiempo. La consistencia es clave para mejorar.'
              }
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              Generado por SportTek • sporttek.pe
            </Text>
            <Text style={styles.footerPage}>Página {hasTrainingPlan ? 4 : 3} de {totalPages}</Text>
          </View>
        </Page>
      )}
    </Document>
  )

  return renderToBuffer(doc)
}
