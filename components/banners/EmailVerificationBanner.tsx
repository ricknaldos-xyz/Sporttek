'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Mail, X, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface EmailVerificationBannerProps {
  userEmail: string
}

export function EmailVerificationBanner({ userEmail }: EmailVerificationBannerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isResent, setIsResent] = useState(false)

  async function handleResendVerification() {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al enviar el email')
        return
      }

      setIsResent(true)
      toast.success('Email de verificacion enviado')
    } catch {
      toast.error('Algo salio mal')
    } finally {
      setIsLoading(false)
    }
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-amber-800">
            Verifica tu email
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            Por favor verifica tu email ({userEmail}) para acceder a todas las funciones.
            {isResent && (
              <span className="flex items-center gap-1 mt-1 text-green-700">
                <CheckCircle className="h-4 w-4" />
                Email enviado. Revisa tu bandeja de entrada.
              </span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isLoading || isResent}
              className="bg-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : isResent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Enviado
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Reenviar email
                </>
              )}
            </Button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-600 hover:text-amber-800 flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
