'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <GlassCard intensity="light" padding="lg" className="max-w-md w-full text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
        <h2 className="font-semibold text-xl mb-2">Algo salio mal</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Ocurrio un error inesperado. Intenta de nuevo.
        </p>
        <GlassButton variant="solid" onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Intentar de nuevo
        </GlassButton>
      </GlassCard>
    </div>
  )
}
