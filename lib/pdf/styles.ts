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
