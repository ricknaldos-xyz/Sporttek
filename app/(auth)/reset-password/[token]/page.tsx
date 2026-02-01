'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassCard } from '@/components/ui/glass-card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Target,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Check,
  X,
} from 'lucide-react'

const PASSWORD_CHECKS = [
  { key: 'length', label: 'Min. 8 caracteres', test: (p: string) => p.length >= 8 },
  { key: 'upper', label: 'Una mayuscula', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'Una minuscula', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'Un numero', test: (p: string) => /[0-9]/.test(p) },
]

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params.token as string

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const allChecksPassed = PASSWORD_CHECKS.every((c) => c.test(password))
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const canSubmit = allChecksPassed && passwordsMatch && !isLoading

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al restablecer la contrasena')
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast.success('Contrasena actualizada exitosamente')
    } catch {
      setError('Algo salio mal')
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (isSuccess) {
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
              <h1 className="text-2xl font-bold mb-2">Contrasena actualizada</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Tu contrasena ha sido restablecida exitosamente. Ya puedes iniciar sesion con tu nueva contrasena.
              </p>

              <div className="space-y-3">
                <GlassButton variant="solid" className="w-full h-12 text-base" asChild>
                  <Link href="/login">
                    Iniciar sesion
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </GlassButton>
                <GlassButton variant="ghost" className="w-full" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                  </Link>
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Error state (expired/used/invalid token)
  if (error && (error.includes('expirado') || error.includes('utilizado') || error.includes('no encontrado'))) {
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
              <h1 className="text-2xl font-bold mb-2">Enlace invalido</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                {error}
              </p>

              <div className="space-y-3">
                <GlassButton variant="solid" className="w-full h-12 text-base" asChild>
                  <Link href="/forgot-password">
                    Solicitar nuevo enlace
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

  // Form state
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
            <h1 className="text-2xl font-bold mb-2">Crear nueva contrasena</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              Ingresa tu nueva contrasena. Asegurate de que sea segura y facil de recordar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contrasena</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <GlassInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password checks */}
            {password.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {PASSWORD_CHECKS.map((check) => {
                  const passed = check.test(password)
                  return (
                    <div
                      key={check.key}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        passed ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {passed ? (
                        <Check className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>{check.label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <GlassInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs flex items-center gap-1.5 ${passwordsMatch ? 'text-success' : 'text-destructive'}`}>
                  {passwordsMatch ? (
                    <><Check className="h-3.5 w-3.5" /> Las contrasenas coinciden</>
                  ) : (
                    <><X className="h-3.5 w-3.5" /> Las contrasenas no coinciden</>
                  )}
                </p>
              )}
            </div>

            {/* Generic error */}
            {error && !error.includes('expirado') && !error.includes('utilizado') && !error.includes('no encontrado') && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <GlassButton
              type="submit"
              variant="solid"
              className="w-full h-12 text-base"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  Actualizar contrasena
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </GlassButton>
          </form>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6 mb-6 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Tu contrasena se almacena de forma segura y encriptada</span>
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
