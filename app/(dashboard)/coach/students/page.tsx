'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { GlassCard } from '@/components/ui/glass-card'
import { logger } from '@/lib/logger'
import { GlassButton } from '@/components/ui/glass-button'
import { TierBadge } from '@/components/player/TierBadge'
import { GraduationCap, UserPlus, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { SkillTier } from '@prisma/client'

interface Student {
  id: string
  status: string
  student: {
    userId: string
    displayName: string | null
    avatarUrl: string | null
    skillTier: SkillTier
    compositeScore: number | null
    totalAnalyses: number
    totalTechniques: number
    user: { name: string | null; email: string | null }
  }
}

export default function CoachStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  async function fetchStudents() {
    try {
      const res = await fetch('/api/coach/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch {
      logger.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  async function handleInvite() {
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch('/api/coach/students/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentUserId: inviteEmail.trim() }),
      })

      if (res.ok) {
        toast.success('Invitacion enviada')
        setShowInviteModal(false)
        setInviteEmail('')
        fetchStudents()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al invitar alumno')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setInviting(false)
    }
  }

  const statusLabels: Record<string, string> = {
    PENDING_INVITE: 'Invitacion pendiente',
    ACTIVE: 'Activo',
    PAUSED: 'Pausado',
    ENDED: 'Finalizado',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Mis Alumnos</h1>
        </div>
        <GlassButton variant="solid" size="sm" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invitar alumno
        </GlassButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Sin alumnos</p>
            <p className="text-sm mt-1">Invita jugadores para empezar a entrenarlos</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {students.map((s) => {
            const name = s.student.displayName || s.student.user.name || 'Alumno'

            return (
              <GlassCard key={s.id} intensity="light" padding="md" hover="lift" asChild>
                <Link href={`/player/${s.student.userId}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {s.student.avatarUrl ? (
                        <Image src={s.student.avatarUrl} alt="" fill className="object-cover rounded-full" />
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{name}</p>
                        <TierBadge tier={s.student.skillTier} size="sm" />
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.status === 'ACTIVE' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                        }`}>
                          {statusLabels[s.status]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.student.totalAnalyses} analisis | {s.student.totalTechniques} tecnicas | Score: {s.student.compositeScore?.toFixed(1) || '--'}
                      </p>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <GlassCard intensity="medium" padding="lg" className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Invitar alumno</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ingresa el ID del jugador que quieres invitar. Puedes encontrar jugadores en la seccion de{' '}
              <Link href="/matchmaking" className="text-primary hover:underline">emparejamiento</Link> o{' '}
              <Link href="/rankings" className="text-primary hover:underline">rankings</Link>.
            </p>
            <input
              type="text"
              placeholder="ID del jugador"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              className="w-full px-3 py-2 rounded-lg border border-glass bg-background/50 text-sm mb-4"
            />
            <div className="flex gap-3 justify-end">
              <GlassButton variant="ghost" size="sm" onClick={() => setShowInviteModal(false)}>
                Cancelar
              </GlassButton>
              <GlassButton variant="solid" size="sm" onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Enviar invitacion
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
