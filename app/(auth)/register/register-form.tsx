'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassCard } from '@/components/ui/glass-card'
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
  { icon: Brain, text: 'Analisis IA de tu tecnica en 2 minutos' },
  { icon: Trophy, text: 'Rankings nacionales y por categoria' },
  { icon: Swords, text: 'Matchmaking y desafios con rivales' },
  { icon: Video, text: 'Planes de entrenamiento personalizados' },
]

const COACH_FEATURES = [
  { icon: GraduationCap, text: 'Perfil verificado en el marketplace' },
  { icon: Shield, text: 'Gestiona alumnos y sesiones' },
  { icon: Zap, text: 'Herramientas de analisis para clientes' },
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
      toast.error('Las contrasenas no coinciden')
      setIsLoading(false)
      return
    }

    if (!allPasswordChecks) {
      toast.error('La contrasena no cumple los requisitos')
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
      toast.error('Algo salio mal')
      setIsLoading(false)
    }
  }

  function handleStep1() {
    if (!name.trim()) {
      toast.error('Ingresa tu nombre')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Ingresa un email valido')
      return
    }
    setStep(2)
  }

  return (
    <div className="w-full max-w-5xl">
      <GlassCard intensity="medium" padding="none" className="overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          {/* Left panel — Branding & Features */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

            {/* Top: Logo */}
            <div className="relative z-10">
              <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-2.5">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold">SportTek</span>
              </Link>

              <h2 className="text-2xl font-bold leading-tight mb-3">
                {accountType === 'PLAYER' ? (
                  <>
                    Lleva tu juego al
                    <br />
                    <span className="text-primary">siguiente nivel</span>
                  </>
                ) : (
                  <>
                    Haz crecer tu
                    <br />
                    <span className="text-primary">carrera como coach</span>
                  </>
                )}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                {accountType === 'PLAYER'
                  ? 'Unete a la comunidad de deportistas que mejoran su tecnica con inteligencia artificial.'
                  : 'Conecta con jugadores activos y ofrece tus servicios en la plataforma deportiva de Peru.'}
              </p>
            </div>

            {/* Middle: Features */}
            <div className="relative z-10 space-y-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                {accountType === 'PLAYER' ? 'Como jugador tendras' : 'Como coach tendras'}
              </p>
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Bottom: Stats & Sports */}
            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-slate-500">Jugadores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2 min</p>
                  <p className="text-xs text-slate-500">Analisis IA</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Gratis</p>
                  <p className="text-xs text-slate-500">Para empezar</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span>Disponible para</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span>🎾</span> Tenis
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span>🏓</span> Padel
                </span>
              </div>
            </div>
          </div>

          {/* Right panel — Registration Form */}
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            {/* Mobile branding */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="glass-primary border-glass rounded-xl p-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold">SportTek</span>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Gratis
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Analisis IA
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
                  : 'Crea una contrasena segura'}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors',
                'bg-primary text-primary-foreground'
              )}>
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
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-glass bg-glass-light text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          accountType === 'PLAYER' ? 'bg-primary/20' : 'bg-muted'
                        )}>
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Jugador</p>
                          <p className="text-xs text-muted-foreground">Mejora tu tecnica</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('COACH')}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
                          accountType === 'COACH'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-glass bg-glass-light text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          accountType === 'COACH' ? 'bg-primary/20' : 'bg-muted'
                        )}>
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Entrenador</p>
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

                  <GlassButton
                    type="button"
                    variant="solid"
                    className="w-full h-12 text-base"
                    onClick={handleStep1}
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GlassButton>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contrasena</Label>
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
                          { key: 'uppercase', label: 'Mayuscula' },
                          { key: 'lowercase', label: 'Minuscula' },
                          { key: 'number', label: 'Numero' },
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
                    <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
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
                      <p className="text-xs text-destructive">Las contrasenas no coinciden</p>
                    )}
                    {passwordsMatch && (
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Contrasenas coinciden
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <GlassButton
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      Atras
                    </GlassButton>
                    <GlassButton
                      type="submit"
                      variant="solid"
                      className="flex-[2] h-12 text-base"
                      disabled={isLoading || !allPasswordChecks || !passwordsMatch}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </GlassButton>
                  </div>
                </>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background/80 backdrop-blur-sm px-3 text-muted-foreground">
                  o
                </span>
              </div>
            </div>

            {/* Login CTA */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Ya tienes una cuenta?
              </p>
              <GlassButton variant="outline" className="w-full" asChild>
                <Link href="/login">
                  Iniciar sesion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GlassButton>
            </div>

            {/* Mobile sport badges */}
            <div className="lg:hidden flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
              <span>🎾 Tenis</span>
              <span>🏓 Padel</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
