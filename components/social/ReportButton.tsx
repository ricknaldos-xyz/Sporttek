'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Flag, X, Loader2 } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { toast } from 'sonner'

interface ReportButtonProps {
  targetId: string
  targetType: 'profile' | 'comment' | 'match_rating' | 'feed_item'
  ownerId?: string
  size?: 'sm' | 'md'
}

const REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'INAPPROPRIATE', label: 'Contenido inapropiado' },
  { value: 'HARASSMENT', label: 'Acoso' },
  { value: 'FAKE_PROFILE', label: 'Perfil falso' },
  { value: 'OTHER', label: 'Otro' },
] as const

export function ReportButton({ targetId, targetType, ownerId, size = 'sm' }: ReportButtonProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Hide for own content or unauthenticated users
  if (!session?.user || session.user.id === ownerId) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/social/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, targetType, reason, description: description.trim() || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error')
      }
      toast.success('Reporte enviado. Gracias por ayudar.')
      setIsOpen(false)
      setReason('')
      setDescription('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar reporte')
    } finally {
      setSubmitting(false)
    }
  }

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-foreground/5"
        aria-label="Reportar"
      >
        <Flag className={iconSize} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm glass-medium border-glass rounded-2xl p-5 shadow-glass-glow" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-semibold mb-3">Reportar contenido</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                      reason === r.value ? 'glass-primary border-primary border' : 'glass-ultralight border-glass border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{r.label}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripcion adicional (opcional)"
                maxLength={500}
                rows={2}
                className="w-full glass-ultralight border-glass rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <div className="flex gap-2">
                <GlassButton type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Cancelar
                </GlassButton>
                <GlassButton type="submit" variant="solid" className="flex-1" disabled={!reason || submitting}>
                  {submitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  Enviar
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
