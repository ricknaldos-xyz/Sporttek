'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface RetryAnalysisButtonProps {
  analysisId: string
  retryCount: number
  maxRetries?: number
}

export function RetryAnalysisButton({
  analysisId,
  retryCount,
  maxRetries = 3,
}: RetryAnalysisButtonProps) {
  const router = useRouter()
  const [isRetrying, setIsRetrying] = useState(false)

  const canRetry = retryCount < maxRetries

  async function handleRetry() {
    if (!canRetry) {
      toast.error('Se ha alcanzado el maximo de reintentos')
      return
    }

    setIsRetrying(true)

    try {
      // Reset the analysis status
      const retryResponse = await fetch(`/api/analyze/${analysisId}/retry`, {
        method: 'POST',
      })

      if (!retryResponse.ok) {
        const data = await retryResponse.json()
        toast.error(data.error || 'Error al reintentar')
        setIsRetrying(false)
        return
      }

      // Trigger processing
      const processResponse = await fetch(`/api/analyze/${analysisId}/process`, {
        method: 'POST',
      })

      if (!processResponse.ok) {
        toast.error('Error al procesar el analisis')
        setIsRetrying(false)
        return
      }

      toast.success('Analisis reintentado exitosamente')
      router.refresh()
    } catch {
      toast.error('Algo salio mal')
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleRetry}
        disabled={isRetrying || !canRetry}
        variant="outline"
      >
        {isRetrying ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Reintentando...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar analisis
          </>
        )}
      </Button>
      {retryCount > 0 && (
        <span className="text-sm text-muted-foreground">
          Intentos: {retryCount}/{maxRetries}
        </span>
      )}
    </div>
  )
}
