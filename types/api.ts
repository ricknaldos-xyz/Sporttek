// Shared API response types

// Pagination wrapper type used by paginated API endpoints
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Common API error response
export interface ApiError {
  error: string
  details?: unknown
}

// User-related types (matching what the session provides)
export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
  subscription: string
  accountType: string
  hasPlayerProfile: boolean
  hasCoachProfile: boolean
}

// Player profile summary included in API responses for matches, challenges, etc.
export interface PlayerProfileSummary {
  userId: string
  displayName: string | null
  avatarUrl: string | null
  skillTier: string | null
  compositeScore?: number | null
  user: {
    name: string | null
    image: string | null
  }
}

// Analysis response shape (from POST /api/analyze and GET /api/analyze)
export interface AnalysisResponse {
  id: string
  userId: string
  techniqueId: string
  variantId: string | null
  status: string
  technique: {
    id: string
    name: string
    sport: {
      id: string
      name: string
      slug: string
    }
  }
  variant: {
    id: string
    name: string
  } | null
  mediaItems?: {
    id: string
    type: 'VIDEO' | 'IMAGE'
    url: string
    filename: string
    fileSize: number
    angle?: string | null
  }[]
  _count?: {
    issues: number
  }
  createdAt: string
  updatedAt: string
}

// Match response shape (from GET /api/matches)
export interface MatchResponse {
  id: string
  player1Id: string
  player2Id: string
  score: string | null
  sets: { p1: number; p2: number }[]
  venue: string | null
  playedAt: string
  player1Confirmed: boolean
  player2Confirmed: boolean
  player1: PlayerProfileSummary
  player2: PlayerProfileSummary
  createdAt: string
  updatedAt: string
}

// Challenge response shape (from GET /api/challenges)
export interface ChallengeResponse {
  id: string
  challengerId: string
  challengedId: string
  status: string
  proposedDate: string | null
  proposedTime: string | null
  proposedVenue: string | null
  message: string | null
  expiresAt: string
  challenger: PlayerProfileSummary
  challenged: PlayerProfileSummary
  createdAt: string
  updatedAt: string
}

// Tournament response shape (from GET /api/tournaments)
export interface TournamentResponse {
  id: string
  name: string
  slug: string
  description: string | null
  format: string
  status: string
  maxPlayers: number
  minTier: string | null
  maxTier: string | null
  ageGroup: string | null
  venue: string | null
  city: string | null
  country: string | null
  registrationEnd: string
  startDate: string
  organizer: {
    displayName: string | null
    avatarUrl: string | null
  }
  _count: {
    participants: number
  }
  createdAt: string
  updatedAt: string
}
