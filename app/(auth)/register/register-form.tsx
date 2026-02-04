'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { GlassInput } from '@/components/ui/glass-input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Loader2,
  User,
  GraduationCap,
  CheckCircle2,
  Circle,
  Target,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCircle,
  ArrowRight,
  Brain,
  Trophy,
  Swords,
  Zap,
  Shield,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLAYER_FEATURES = [
  { icon: Brain, text: 'Análisis IA de tu técnica en 2 minutos' },
  { icon: Trophy, text: 'Rankings nacionales y por categoría' },
  { icon: Swords, text: 'Matchmaking y desafíos con rivales' },
  { icon: Video, text: 'Planes de entrenamiento personalizados' },
]

const COACH_FEATURES = [
  { icon: GraduationCap, text: 'Perfil verificado en el marketplace' },
  { icon: Shield, text: 'Gestiona alumnos y sesiones' },
  { icon: Zap, text: 'Herramientas de análisis para clientes' },
  { icon: Trophy, text: 'Visibilidad ante jugadores activos' },
]

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState<'PLAYER' | 'COACH'>(
    typeParam === 'coach' ? 'COACH' : 'PLAYER'
  )
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const allPasswordChecks = Object.values(passwordChecks).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const features = accountType === 'PLAYER' ? PLAYER_FEATURES : COACH_FEATURES

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (!allPasswordChecks) {
      toast.error('La contraseña no cumple los requisitos')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, accountType }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al registrarse')
        setIsLoading(false)
        return
      }

      toast.success('Cuenta creada exitosamente!')

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        router.push('/login')
        return
      }

      router.push('/dashboard')
    } catch {
      toast.error('Algo salió mal')
      setIsLoading(false)
    }
  }

  function handleStep1() {
    if (!name.trim()) {
      toast.error('Ingresa tu nombre')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Ingresa un email válido')
      return
    }
    setStep(2)
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="rounded-[var(--radius-card)] overflow-hidden shadow-2xl">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          {/* Left panel — Green Gradient Branding */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#256F50] via-[#1A5038] to-[#143D2B] text-white relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Top: Logo */}
            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-lg mb-8"
              >
                <Target className="h-5 w-5 text-primary" />
                <span className="text-base font-bold text-foreground">SportTek</span>
              </Link>

              <h2 className="text-3xl font-bold leading-tight mb-3">
                {accountType === 'PLAYER' ? (
                  <>
                    Lleva tu juego al
                    <br />
                    <span className="italic">siguiente nivel</span>
                  </>
                ) : (
                  <>
                    Haz crecer tu
                    <br />
                    <span className="italic">carrera como coach</span>
                  </>
                )}
              </h2>

              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                {accountType === 'PLAYER'
                  ? 'Únete a la comunidad de deportistas que mejoran su técnica con inteligencia artificial.'
                  : 'Conecta con jugadores activos y ofrece tus servicios en la plataforma deportiva de Perú.'}
              </p>
            </div>

            {/* Middle: Features */}
            <div className="relative z-10 space-y-4">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">
                {accountType === 'PLAYER' ? 'Como jugador tendrás' : 'Como coach tendrás'}
              </p>
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>

            {/* Bottom: Stats & Sports */}
            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/50">Jugadores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2 min</p>
                  <p className="text-xs text-white/50">Análisis IA</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Gratis</p>
                  <p className="text-xs text-white/50">Para empezar</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/50 text-sm">
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

          {/* Right panel — Registration Form */}
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-background">
            {/* Mobile branding */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SportTek</span>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Gratis
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Análisis IA
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Rankings
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Crear cuenta</h1>
              <p className="text-muted-foreground text-sm">
                {step === 1
                  ? 'Elige tu perfil y completa tus datos'
                  : 'Crea una contraseña segura'}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                1
              </div>
              <div className={cn(
                'h-0.5 flex-1 rounded-full transition-colors',
                step === 2 ? 'bg-primary' : 'bg-muted'
              )} />
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors',
                step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                2
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Account Type Selector */}
                  <div className="space-y-2">
                    <Label>Tipo de cuenta</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType('PLAYER')}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
                          accountType === 'PLAYER'
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-secondary/30 hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                          accountType === 'PLAYER' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}>
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={cn('text-sm font-semibold', accountType === 'PLAYER' ? 'text-primary' : 'text-foreground')}>Jugador</p>
                          <p className="text-xs text-muted-foreground">Mejora tu técnica</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('COACH')}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
                          accountType === 'COACH'
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-secondary/30 hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                          accountType === 'COACH' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}>
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={cn('text-sm font-semibold', accountType === 'COACH' ? 'text-primary' : 'text-foreground')}>Entrenador</p>
                          <p className="text-xs text-muted-foreground">Gestiona alumnos</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <GlassInput
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Tu nombre"
                        required
                        disabled={isLoading}
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStep1}
                    className="w-full h-12 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <GlassInput
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

                    {/* Password strength indicators */}
                    {password && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                        {[
                          { key: 'length', label: '8+ caracteres' },
                          { key: 'uppercase', label: 'Mayúscula' },
                          { key: 'lowercase', label: 'Minúscula' },
                          { key: 'number', label: 'Número' },
                        ].map(({ key, label }) => {
                          const passed = passwordChecks[key as keyof typeof passwordChecks]
                          return (
                            <div key={key} className="flex items-center gap-1.5 text-xs">
                              {passed
                                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                : <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              }
                              <span className={passed ? 'text-emerald-500' : 'text-muted-foreground'}>
                                {label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <GlassInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        className={cn(
                          'pl-10 pr-10',
                          confirmPassword && !passwordsMatch && 'border-destructive/50'
                        )}
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
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                    )}
                    {passwordsMatch && (
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Contraseñas coinciden
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                      className="flex-1 h-12 border border-border bg-transparent text-foreground font-medium rounded-full hover:bg-secondary transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !allPasswordChecks || !passwordsMatch}
                      className="flex-[2] h-12 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
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

            {/* Login CTA */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                ¿Ya tienes una cuenta?
              </p>
              <Link
                href="/login"
                className="w-full h-11 border border-border bg-transparent text-foreground font-medium rounded-full hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                Iniciar sesión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile sport badges */}
            <div className="lg:hidden flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
              <span>🎾 Tenis</span>
              <span>🏓 Padel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
