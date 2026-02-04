'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { GlassInput } from '@/components/ui/glass-input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Target,
  Brain,
  Trophy,
  Swords,
  CheckCircle2,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setHasError(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email o contraseña incorrectos')
        setHasError(true)
        setIsLoading(false)
        return
      }

      toast.success('Bienvenido de vuelta!')
      router.push(callbackUrl)
      router.refresh()
    } catch {
      toast.error('Algo salió mal. Intenta de nuevo.')
      setHasError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="rounded-[var(--radius-card)] overflow-hidden shadow-2xl">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left panel — Green Gradient Branding */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#256F50] via-[#1A5038] to-[#143D2B] text-white relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Top: Logo & Tagline */}
            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-lg mb-8"
              >
                <Target className="h-5 w-5 text-primary" />
                <span className="text-base font-bold text-foreground">SportTek</span>
              </Link>

              <h2 className="text-3xl font-bold leading-tight mb-3">
                Mejora tu técnica,
                <br />
                <span className="italic">compite en el ranking</span>
              </h2>

              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Analiza tu técnica, sube en los rankings y conecta con la comunidad deportiva de Perú.
              </p>
            </div>

            {/* Middle: Value Props */}
            <div className="relative z-10 space-y-4">
              {[
                { icon: Brain, text: 'Análisis IA en 2 minutos' },
                { icon: Trophy, text: 'Rankings nacionales en vivo' },
                { icon: Swords, text: 'Matchmaking inteligente' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>

            {/* Bottom: Testimonial */}
            <div className="relative z-10">
              <div className="bg-white/10 rounded-2xl p-5">
                <Quote className="h-5 w-5 text-white/40 mb-3" />
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  &ldquo;Después de 5 análisis tengo claro mis fortalezas y debilidades. El plan de entrenamiento me da ejercicios nuevos cada semana.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">María L.</p>
                    <p className="text-xs text-white/50">Jugadora de padel · Surco</p>
                  </div>
                </div>
              </div>

              {/* Sports */}
              <div className="flex items-center gap-4 mt-5 text-white/50 text-sm">
                <span>Disponible para</span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <span>🎾</span> Tenis
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <span>🏓</span> Padel
                </span>
              </div>
            </div>
          </div>

          {/* Right panel — Login Form */}
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-background">
            {/* Mobile branding */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SportTek</span>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Análisis IA
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Rankings
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Matchmaking
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Bienvenido de vuelta</h1>
              <p className="text-muted-foreground">
                Inicia sesión para continuar mejorando tu técnica
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={onSubmit}
              className={cn('space-y-5', hasError && 'animate-shake')}
              onAnimationEnd={() => setHasError(false)}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <GlassInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <GlassInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">o</span>
              </div>
            </div>

            {/* Register CTA */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                ¿Nuevo en SportTek?
              </p>
              <Link
                href="/register"
                className="w-full h-11 border border-border bg-transparent text-foreground font-medium rounded-full hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust badges — mobile only */}
            <div className="lg:hidden flex items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
              <span>🎾 Tenis</span>
              <span>🏓 Padel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
