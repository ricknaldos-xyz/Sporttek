'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Target,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  RefreshCw,
} from 'lucide-react'

type VerificationState = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [state, setState] = useState<VerificationState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Error al verificar el email')
          setState('error')
          return
        }

        setState('success')
      } catch {
        setError('Algo salio mal')
        setState('error')
      }
    }

    verifyEmail()
  }, [token])

  // Countdown + redirect on success
  useEffect(() => {
    if (state !== 'success') return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state, router])

  // Loading state
  if (state === 'loading') {
    return (
      <div className="w-full max-w-lg">
        <GlassCard intensity="medium" padding="none" className="overflow-hidden">
          <div className="p-8 sm:p-10">
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="glass-primary border-glass rounded-xl p-2 shadow-glass-glow">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">SportTek</span>
            </Link>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verificando email...</h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Espera un momento mientras verificamos tu direccion de email.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="w-full max-w-lg">
        <GlassCard intensity="medium" padding="none" className="overflow-hidden">
          <div className="p-8 sm:p-10">
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="glass-primary border-glass rounded-xl p-2 shadow-glass-glow">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">SportTek</span>
            </Link>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/15 border border-success/25 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Email verificado</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Tu email ha sido verificado exitosamente. Ya puedes disfrutar de todas las funciones de SportTek.
              </p>

              <GlassButton variant="solid" className="w-full h-12 text-base" asChild>
                <Link href="/dashboard">
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GlassButton>

              <p className="text-xs text-muted-foreground mt-4">
                Redirigiendo automaticamente en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Error state
  return (
    <div className="w-full max-w-lg">
      <GlassCard intensity="medium" padding="none" className="overflow-hidden">
        <div className="p-8 sm:p-10">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="glass-primary border-glass rounded-xl p-2 shadow-glass-glow">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">SportTek</span>
          </Link>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/15 border border-destructive/25 rounded-2xl flex items-center justify-center mb-5">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Error de verificacion</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              {error}
            </p>

            {/* Tips */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Que puedes hacer</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Solicita un nuevo enlace desde tu perfil</span>
                </li>
                <li className="flex items-start gap-2">
                  <MailCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Verifica que hayas usado el enlace mas reciente</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <GlassButton variant="solid" className="w-full h-12 text-base" asChild>
                <Link href="/dashboard">
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GlassButton>
              <GlassButton variant="ghost" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a iniciar sesion
                </Link>
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
