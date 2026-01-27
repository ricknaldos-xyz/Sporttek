'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

type VerificationState = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [state, setState] = useState<VerificationState>('loading')
  const [error, setError] = useState<string | null>(null)

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

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } catch {
        setError('Algo salio mal')
        setState('error')
      }
    }

    verifyEmail()
  }, [token, router])

  if (state === 'loading') {
    return (
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verificando email...</h1>
            <p className="text-muted-foreground">
              Espera un momento mientras verificamos tu email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Email verificado</h1>
            <p className="text-muted-foreground mb-6">
              Tu email ha sido verificado exitosamente. Seras redirigido al dashboard en unos segundos.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">
                Ir al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Error de verificacion</h1>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full">
                Ir al Dashboard
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Puedes solicitar un nuevo enlace de verificacion desde tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
