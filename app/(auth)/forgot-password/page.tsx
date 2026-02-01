'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassCard } from '@/components/ui/glass-card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Loader2,
  ArrowLeft,
  Mail,
  CheckCircle,
  Target,
  ArrowRight,
  KeyRound,
  Shield,
  Clock,
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al enviar el email')
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
    } catch {
      toast.error('Algo salio mal')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg">
        <GlassCard intensity="medium" padding="none" className="overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="glass-primary border-glass rounded-xl p-2 shadow-glass-glow">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">SportTek</span>
            </Link>

            {/* Success state */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/15 border border-success/25 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Revisa tu email</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Si existe una cuenta con <strong className="text-foreground">{email}</strong>, recibiras un enlace para restablecer tu contrasena.
              </p>

              {/* Tips */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">No recibes el email?</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Espera unos minutos y revisa tu bandeja</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Revisa la carpeta de spam o correo no deseado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <KeyRound className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Verifica que el email sea el correcto</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <GlassButton
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Intentar con otro email
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

  return (
    <div className="w-full max-w-lg">
      <GlassCard intensity="medium" padding="none" className="overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="glass-primary border-glass rounded-xl p-2 shadow-glass-glow">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">SportTek</span>
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Recuperar contrasena</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              Ingresa tu email y te enviaremos un enlace para crear una nueva contrasena
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email de tu cuenta</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <GlassInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <GlassButton
              type="submit"
              variant="solid"
              className="w-full h-12 text-base"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar enlace de recuperacion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </GlassButton>
          </form>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6 mb-6 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>El enlace expira en 1 hora por seguridad</span>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-glass" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background/80 backdrop-blur-sm px-3 text-muted-foreground">
                o
              </span>
            </div>
          </div>

          {/* Back to login */}
          <GlassButton variant="outline" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesion
            </Link>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
