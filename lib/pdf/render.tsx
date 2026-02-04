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

export async function renderAnalysisPDF(analysis: AnalysisForPDF): Promise<Buffer> {
  const date = new Date(analysis.createdAt).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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

  const totalPages = 2
  const highPriorityCount = analysis.issues.filter(
    (i) => i.severity === 'CRITICAL' || i.severity === 'HIGH'
  ).length

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
    </Document>
  )

  return renderToBuffer(doc)
}
