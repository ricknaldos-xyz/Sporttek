'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassInput } from '@/components/ui/glass-input'
import { Loader2, Check, ArrowRight, Sparkles, Trophy, Users, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import confetti from 'canvas-confetti'

interface Sport {
  id: string
  slug: string
  name: string
  icon: string | null
  description: string | null
  isActive: boolean
}

const SPORT_EMOJI: Record<string, string> = {
  tennis: '🎾',
  padel: '🏓',
  pickleball: '🏸',
  futbol: '⚽',
}

export default function OnboardingPage() {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [step, setStep] = useState(1)

  // Step 1: Sport selection
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null)
  const [loadingSports, setLoadingSports] = useState(true)

  // Step 2: Profile
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchSports() {
      try {
        const res = await fetch('/api/sports?all=true')
        if (res.ok) setSports(await res.json())
      } catch (error) {
        logger.error('Failed to fetch sports:', error)
      } finally {
        setLoadingSports(false)
      }
    }
    fetchSports()
  }, [])

  async function handleSportContinue() {
    if (!selectedSportId) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/player/sport-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sportId: selectedSportId }),
      })
      if (!res.ok) {
        const data = await res.json()
        // If sport already added, just advance
        if (data.error?.includes('ya')) {
          setStep(2)
          return
        }
        throw new Error(data.error || 'Error')
      }
      setStep(2)
    } catch (error) {
      toast.error('Error al seleccionar deporte')
      logger.error('Sport selection error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleProfileContinue() {
    setSubmitting(true)
    try {
      if (displayName.trim()) {
        await fetch('/api/player/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: displayName.trim(),
            bio: bio.trim() || undefined,
          }),
        })
      }
      setStep(3)
      // Mark onboarding complete
      await fetch('/api/user/onboarding', { method: 'PATCH' })
      await updateSession()
      // Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (error) {
      toast.error('Error al guardar perfil')
      logger.error('Profile save error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  function handleGoToDashboard(path: string) {
    router.push(path)
    router.refresh()
  }

  // Progress bar
  const progressWidth = `${(step / 3) * 100}%`

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Paso {step} de 3</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full glass-ultralight border-glass overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Step 1: Sport Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Elige tu deporte</h1>
            <p className="text-muted-foreground">
              Selecciona el deporte principal que quieres mejorar.
            </p>
          </div>

          {loadingSports ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sports.filter((s) => s.isActive).map((sport, index) => {
                const emoji = SPORT_EMOJI[sport.slug] ?? '🏅'
                const isSelected = selectedSportId === sport.id
                return (
                  <GlassCard
                    key={sport.id}
                    intensity={isSelected ? 'primary' : 'light'}
                    padding="lg"
                    hover="lift"
                    className={cn(
                      'cursor-pointer transition-all border-2',
                      isSelected ? 'border-primary' : 'border-transparent'
                    )}
                    onClick={() => setSelectedSportId(sport.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{sport.name}</h3>
                          {index === 0 && <GlassBadge variant="success" size="sm">Incluido</GlassBadge>}
                        </div>
                        {sport.description && (
                          <p className="text-sm text-muted-foreground mt-1">{sport.description}</p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}

          <GlassButton
            variant="solid"
            className="w-full"
            disabled={!selectedSportId || submitting}
            onClick={handleSportContinue}
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            Continuar
          </GlassButton>
        </div>
      )}

      {/* Step 2: Profile */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Completa tu perfil</h1>
            <p className="text-muted-foreground">
              Dinos como quieres que te conozcan otros jugadores.
            </p>
          </div>

          <GlassCard intensity="light" padding="lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre de jugador
                </label>
                <GlassInput
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Carlos Tennis Pro"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Asi te veran otros jugadores en rankings y desafios
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bio (opcional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos sobre tu nivel y objetivos..."
                  maxLength={200}
                  rows={3}
                  className="w-full glass-ultralight border-glass rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <GlassButton
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Skip profile, go directly to success
                handleProfileContinue()
              }}
            >
              Omitir
            </GlassButton>
            <GlassButton
              variant="solid"
              className="flex-1"
              disabled={submitting}
              onClick={handleProfileContinue}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Continuar
            </GlassButton>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold">Todo listo!</h1>
            <p className="text-muted-foreground">
              Tu perfil esta configurado. Elige que quieres hacer primero.
            </p>
          </div>

          <div className="grid gap-3">
            <GlassCard
              intensity="light"
              padding="lg"
              hover="lift"
              className="cursor-pointer text-left"
              onClick={() => handleGoToDashboard('/analyze')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Analizar un video</p>
                  <p className="text-sm text-muted-foreground">Sube un video y recibe feedback con IA</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              intensity="light"
              padding="lg"
              hover="lift"
              className="cursor-pointer text-left"
              onClick={() => handleGoToDashboard('/rankings')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-500/10 p-2.5">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">Explorar rankings</p>
                  <p className="text-sm text-muted-foreground">Mira donde estas comparado con otros jugadores</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              intensity="light"
              padding="lg"
              hover="lift"
              className="cursor-pointer text-left"
              onClick={() => handleGoToDashboard('/matchmaking')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-2.5">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Encontrar jugadores</p>
                  <p className="text-sm text-muted-foreground">Busca rivales cerca de ti para jugar</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassButton
            variant="outline"
            className="w-full"
            onClick={() => handleGoToDashboard('/dashboard')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Ir al dashboard
          </GlassButton>
        </div>
      )}
    </div>
  )
}
