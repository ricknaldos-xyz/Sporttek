import { StyleSheet } from '@react-pdf/renderer'

// Brand colors
export const colors = {
  primary: '#256F50',
  primaryLight: '#c8f7c5',
  primaryDark: '#1a5038',
  black: '#1a1a1a',
  gray: '#666666',
  grayLight: '#999999',
  grayUltraLight: '#f5f5f5',
  white: '#ffffff',
  severityCritical: '#b91c1c',
  severityCriticalBg: '#fee2e2',
  severityHigh: '#c2410c',
  severityHighBg: '#ffedd5',
  severityMedium: '#b45309',
  severityMediumBg: '#fef3c7',
  severityLow: '#047857',
  severityLowBg: '#d1fae5',
}

export const styles = StyleSheet.create({
  // Page
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
    fontSize: 10,
    color: colors.black,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerDate: {
    fontSize: 10,
    color: colors.gray,
  },
  headerId: {
    fontSize: 8,
    color: colors.grayLight,
    marginTop: 2,
  },

  // Title section
  titleSection: {
    marginBottom: 25,
  },
  sportBadge: {
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.gray,
  },

  // Score section
  scoreSection: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.grayUltraLight,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  scoreCardPrimary: {
    backgroundColor: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.gray,
    marginBottom: 8,
  },
  scoreLabelWhite: {
    color: colors.white,
    opacity: 0.8,
  },
  scoreValue: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  scoreValueWhite: {
    color: colors.white,
  },
  scoreMax: {
    fontSize: 14,
    color: colors.grayLight,
    marginTop: 2,
  },
  scoreMaxWhite: {
    color: colors.white,
    opacity: 0.7,
  },

  // Tier badge
  tierBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  tierText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayUltraLight,
  },

  // Summary box
  summaryBox: {
    backgroundColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    color: colors.black,
    lineHeight: 1.6,
  },

  // Strengths
  strengthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    maxWidth: '48%',
  },
  strengthCheck: {
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    marginRight: 6,
    fontSize: 12,
  },
  strengthText: {
    fontSize: 9,
    color: colors.primaryDark,
    flex: 1,
  },

  // Priority focus
  priorityBox: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  priorityLabel: {
    fontSize: 9,
    color: colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },

  // Issues (Page 2)
  issueCard: {
    backgroundColor: colors.grayUltraLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    flex: 1,
    marginRight: 10,
  },
  issueSeverity: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  severityCritical: {
    backgroundColor: colors.severityCriticalBg,
    color: colors.severityCritical,
  },
  severityHigh: {
    backgroundColor: colors.severityHighBg,
    color: colors.severityHigh,
  },
  severityMedium: {
    backgroundColor: colors.severityMediumBg,
    color: colors.severityMedium,
  },
  severityLow: {
    backgroundColor: colors.severityLowBg,
    color: colors.severityLow,
  },
  issueCategory: {
    fontSize: 8,
    color: colors.grayLight,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 10,
    color: colors.gray,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  issueCorrection: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 10,
  },
  issueCorrectionIcon: {
    color: colors.primary,
    marginRight: 8,
    fontSize: 12,
  },
  issueCorrectionText: {
    fontSize: 9,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 1.4,
  },

  // Drills
  drillsContainer: {
    marginTop: 8,
  },
  drillsLabel: {
    fontSize: 8,
    color: colors.grayLight,
    marginBottom: 4,
  },
  drillItem: {
    fontSize: 9,
    color: colors.gray,
    marginLeft: 10,
    marginBottom: 2,
  },

  // Page 3: Action Plan
  exerciseCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  exerciseName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    flex: 1,
  },
  exerciseFrequency: {
    fontSize: 9,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  exerciseDescription: {
    fontSize: 10,
    color: colors.gray,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  exerciseInstructions: {
    fontSize: 9,
    color: colors.black,
    lineHeight: 1.5,
    backgroundColor: colors.grayUltraLight,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  exerciseMetrics: {
    flexDirection: 'row',
    gap: 15,
  },
  exerciseMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseMetricLabel: {
    fontSize: 8,
    color: colors.grayLight,
    marginRight: 4,
  },
  exerciseMetricValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grayUltraLight,
  },
  qrPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: colors.grayUltraLight,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  qrText: {
    fontSize: 8,
    color: colors.grayLight,
  },
  qrHint: {
    fontSize: 9,
    color: colors.gray,
    flex: 1,
  },
  planSummary: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planSummaryItem: {
    alignItems: 'center',
  },
  planSummaryValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
  },
  planSummaryLabel: {
    fontSize: 9,
    color: colors.primary,
    marginTop: 2,
  },
  notesSection: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 15,
  },
  notesTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray,
    marginBottom: 10,
  },
  notesLines: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayUltraLight,
    height: 20,
    marginBottom: 5,
  },

  // Page 4: History
  historyIntro: {
    fontSize: 10,
    color: colors.gray,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  comparisonCard: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  comparisonBox: {
    flex: 1,
    backgroundColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  comparisonBoxCurrent: {
    backgroundColor: colors.primary,
  },
  comparisonLabel: {
    fontSize: 9,
    color: colors.gray,
    marginBottom: 8,
  },
  comparisonLabelWhite: {
    color: colors.white,
    opacity: 0.8,
  },
  comparisonScore: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
  },
  comparisonScoreWhite: {
    color: colors.white,
  },
  comparisonDate: {
    fontSize: 8,
    color: colors.grayLight,
    marginTop: 4,
  },
  comparisonDateWhite: {
    color: colors.white,
    opacity: 0.7,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
  },
  changeBadgePositive: {
    backgroundColor: colors.severityLowBg,
  },
  changeBadgeNegative: {
    backgroundColor: colors.severityCriticalBg,
  },
  changeBadgeNeutral: {
    backgroundColor: colors.grayUltraLight,
  },
  changeText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  changeTextPositive: {
    color: colors.severityLow,
  },
  changeTextNegative: {
    color: colors.severityCritical,
  },
  changeTextNeutral: {
    color: colors.gray,
  },
  chartContainer: {
    backgroundColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 15,
  },
  chartArea: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 40,
    backgroundColor: colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  chartBarCurrent: {
    backgroundColor: colors.primaryDark,
  },
  chartBarValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  chartBarLabel: {
    fontSize: 7,
    color: colors.grayLight,
    marginTop: 5,
    textAlign: 'center',
  },
  insightBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 15,
  },
  insightTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 10,
    color: colors.primary,
    lineHeight: 1.5,
  },
  noHistoryBox: {
    backgroundColor: colors.grayUltraLight,
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
  },
  noHistoryText: {
    fontSize: 11,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 10,
  },
  noHistoryHint: {
    fontSize: 9,
    color: colors.grayLight,
    textAlign: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.grayUltraLight,
  },
  footerText: {
    fontSize: 8,
    color: colors.grayLight,
  },
  footerPage: {
    fontSize: 8,
    color: colors.gray,
  },

  // Page 2 specific
  issuesIntro: {
    fontSize: 10,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 1.5,
  },
})

export const severityStyles: Record<string, object> = {
  CRITICAL: styles.severityCritical,
  HIGH: styles.severityHigh,
  MEDIUM: styles.severityMedium,
  LOW: styles.severityLow,
}

export const severityLabels: Record<string, string> = {
  CRITICAL: 'Crítico',
  HIGH: 'Alto',
  MEDIUM: 'Medio',
  LOW: 'Bajo',
}
