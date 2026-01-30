'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { toast } from 'sonner'

export function CancelSubscriptionButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function handleCancel() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/culqi/portal', { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al cancelar')
      }

      toast.success('Suscripcion cancelada correctamente')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cancelar suscripcion')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <GlassButton
        variant="outline"
        onClick={handleCancel}
        disabled={loading}
        className="border-destructive/50 text-destructive hover:bg-destructive/10"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Cancelando...
          </>
        ) : confirming ? (
          'Confirmar cancelacion'
        ) : (
          'Cancelar suscripcion'
        )}
      </GlassButton>
      {confirming && !loading && (
        <GlassButton
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          Volver
        </GlassButton>
      )}
    </div>
  )
}
