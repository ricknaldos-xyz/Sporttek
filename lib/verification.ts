import { prisma } from '@/lib/prisma'

export interface VideoVerificationResult {
  hasValidMetadata: boolean
  recordedRecently: boolean
  isOriginalFile: boolean
  verificationScore: number
}

/**
 * Verify video metadata for anti-cheat.
 * In a production system, this would use ffprobe or a media processing service
 * to extract EXIF/metadata. For now, we implement the scoring framework.
 */
export function verifyVideoMetadata(metadata: {
  hasMetadata: boolean
  recordedAt: Date | null
  deviceInfo: string | null
}): VideoVerificationResult {
  let score = 0
  const checks = {
    hasValidMetadata: false,
    recordedRecently: false,
    isOriginalFile: false,
  }

  // Check 1: Has valid metadata
  if (metadata.hasMetadata) {
    checks.hasValidMetadata = true
    score += 30
  }

  // Check 2: Recorded recently (within 7 days)
  if (metadata.recordedAt) {
    const daysSinceRecording = Math.floor(
      (Date.now() - metadata.recordedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceRecording <= 7) {
      checks.recordedRecently = true
      score += 40
    } else if (daysSinceRecording <= 30) {
      score += 20
    }
  }

  // Check 3: Device info present (suggests original file)
  if (metadata.deviceInfo) {
    checks.isOriginalFile = true
    score += 30
  }

  return {
    ...checks,
    verificationScore: score,
  }
}

/**
 * Create or update verification record for an analysis.
 */
export async function createVerification(
  analysisId: string,
  result: VideoVerificationResult
): Promise<void> {
  await prisma.analysisVerification.upsert({
    where: { analysisId },
    create: {
      analysisId,
      verificationScore: result.verificationScore,
      hasMetadata: result.hasValidMetadata,
      status: result.verificationScore >= 60 ? 'VERIFIED' : 'PENDING_REVIEW',
    },
    update: {
      verificationScore: result.verificationScore,
      hasMetadata: result.hasValidMetadata,
      status: result.verificationScore >= 60 ? 'VERIFIED' : 'PENDING_REVIEW',
    },
  })
}

/**
 * Process peer review votes. If 2/3 reject, flag the analysis.
 */
export async function processPeerReviews(verificationId: string): Promise<void> {
  const verification = await prisma.analysisVerification.findUnique({
    where: { id: verificationId },
    include: { peerReviews: true },
  })

  if (!verification || verification.peerReviews.length < 3) return

  const approvals = verification.peerReviews.filter((r) => r.approved).length
  const rejections = verification.peerReviews.filter((r) => !r.approved).length

  let status: 'VERIFIED' | 'FLAGGED' | 'REJECTED' | 'PENDING_REVIEW' = 'PENDING_REVIEW'

  if (rejections >= 2) {
    status = 'FLAGGED'
  } else if (approvals >= 2) {
    status = 'VERIFIED'
  }

  await prisma.analysisVerification.update({
    where: { id: verificationId },
    data: {
      status,
      peerReviewCount: verification.peerReviews.length,
      peerApprovals: approvals,
      peerRejections: rejections,
      reviewedAt: new Date(),
    },
  })
}
