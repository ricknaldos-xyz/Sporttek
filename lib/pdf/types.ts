export interface AnalysisIssue {
  id: string
  category: string
  title: string
  description: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  correction: string
  drills: string[]
  timestamp: number | null
  frameUrl: string | null
}

export interface AnalysisForPDF {
  id: string
  createdAt: Date
  overallScore: number | null
  summary: string | null
  strengths: string[]
  priorityFocus: string | null
  technique: {
    name: string
    sport: {
      name: string
    }
  }
  issues: AnalysisIssue[]
  user: {
    name: string | null
    playerProfile?: {
      skillTier: string | null
      effectiveScore: number | null
    } | null
  }
  mediaItems: {
    url: string
    type: string
  }[]
}

export const tierLabels: Record<string, string> = {
  PRIMERA_A: '1ra A',
  PRIMERA_B: '1ra B',
  SEGUNDA_A: '2da A',
  SEGUNDA_B: '2da B',
  TERCERA_A: '3ra A',
  TERCERA_B: '3ra B',
  CUARTA_A: '4ta A',
  CUARTA_B: '4ta B',
  QUINTA_A: '5ta A',
  QUINTA_B: '5ta B',
}
