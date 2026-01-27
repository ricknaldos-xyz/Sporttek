'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { TierBadge } from '@/components/player/TierBadge'
import { Flag, Check, X, Loader2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import type { SkillTier } from '@prisma/client'

interface ChallengePlayer {
  userId: string
  displayName: string | null
  avatarUrl: string | null
  skillTier: SkillTier
  compositeScore: number | null
  user: { name: string | null; image: string | null }
}

interface Challenge {
  id: string
  challengerId: string
  challengedId: string
  status: string
  proposedDate: string | null
  proposedTime: string | null
  proposedVenue: string | null
  message: string | null
  expiresAt: string
  createdAt: string
  challenger: ChallengePlayer
  challenged: ChallengePlayer
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [actioning, setActioning] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [tab])

  async function fetchChallenges() {
    setLoading(true)
    try {
      const res = await fetch(`/api/challenges?type=${tab}`)
      if (res.ok) {
        const data = await res.json()
        setChallenges(data)
      }
    } catch {
      console.error('Failed to fetch challenges')
    } finally {
      setLoading(false)
    }
  }

  async function respondToChallenge(id: string, action: 'accept' | 'decline' | 'cancel') {
    setActioning(id)
    try {
      const res = await fetch(`/api/challenges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        toast.success(
          action === 'accept' ? 'Desafio aceptado!' :
          action === 'decline' ? 'Desafio rechazado' : 'Desafio cancelado'
        )
        fetchChallenges()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error')
      }
    } catch {
      toast.error('Error al procesar')
    } finally {
      setActioning(null)
    }
  }

  const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente',
    ACCEPTED: 'Aceptado',
    DECLINED: 'Rechazado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Completado',
    EXPIRED: 'Expirado',
  }

  const statusColor: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-100',
    ACCEPTED: 'text-green-600 bg-green-100',
    DECLINED: 'text-red-600 bg-red-100',
    CANCELLED: 'text-slate-500 bg-slate-100',
    COMPLETED: 'text-blue-600 bg-blue-100',
    EXPIRED: 'text-slate-400 bg-slate-100',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Flag className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Desafios</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <GlassButton
          variant={tab === 'received' ? 'solid' : 'outline'}
          size="sm"
          onClick={() => setTab('received')}
        >
          Recibidos
        </GlassButton>
        <GlassButton
          variant={tab === 'sent' ? 'solid' : 'outline'}
          size="sm"
          onClick={() => setTab('sent')}
        >
          Enviados
        </GlassButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : challenges.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center text-muted-foreground">
            <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay desafios</p>
            <p className="text-sm mt-1">
              {tab === 'received' ? 'Aun no has recibido desafios' : 'Aun no has enviado desafios'}
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const opponent = tab === 'received' ? challenge.challenger : challenge.challenged
            const opponentName = opponent.displayName || opponent.user.name || 'Jugador'

            return (
              <GlassCard key={challenge.id} intensity="light" padding="md">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {opponent.avatarUrl || opponent.user.image ? (
                      <img src={opponent.avatarUrl || opponent.user.image || ''} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {opponentName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{opponentName}</p>
                      <TierBadge tier={opponent.skillTier} size="sm" />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[challenge.status]}`}>
                        {statusLabel[challenge.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      {challenge.proposedVenue && <span>{challenge.proposedVenue}</span>}
                      {challenge.proposedDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(challenge.proposedDate).toLocaleDateString('es-PE')}
                          {challenge.proposedTime && ` ${challenge.proposedTime}`}
                        </span>
                      )}
                      {challenge.message && <span>&quot;{challenge.message}&quot;</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  {challenge.status === 'PENDING' && (
                    <div className="flex gap-2 flex-shrink-0">
                      {tab === 'received' ? (
                        <>
                          <GlassButton
                            variant="solid"
                            size="sm"
                            onClick={() => respondToChallenge(challenge.id, 'accept')}
                            disabled={actioning === challenge.id}
                          >
                            {actioning === challenge.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </GlassButton>
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={() => respondToChallenge(challenge.id, 'decline')}
                            disabled={actioning === challenge.id}
                          >
                            <X className="h-4 w-4" />
                          </GlassButton>
                        </>
                      ) : (
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => respondToChallenge(challenge.id, 'cancel')}
                          disabled={actioning === challenge.id}
                        >
                          Cancelar
                        </GlassButton>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
