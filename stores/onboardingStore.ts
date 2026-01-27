import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  href?: string
}

interface OnboardingState {
  showWelcomeModal: boolean
  tourStep: number | null
  isTourActive: boolean
  steps: OnboardingStep[]

  // Actions
  setShowWelcomeModal: (show: boolean) => void
  startTour: () => void
  nextTourStep: () => void
  previousTourStep: () => void
  endTour: () => void
  completeStep: (stepId: string) => void
  resetOnboarding: () => void
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'player-profile',
    title: 'Completa tu perfil de jugador',
    description: 'Agrega tu ubicacion, estilo de juego y mas',
    completed: false,
    href: '/profile/player/edit',
  },
  {
    id: 'profile',
    title: 'Completa tu perfil',
    description: 'Agrega tu nombre y preferencias de notificacion',
    completed: false,
    href: '/profile/settings',
  },
  {
    id: 'first-analysis',
    title: 'Sube tu primer video',
    description: 'Analiza tu tecnica con inteligencia artificial',
    completed: false,
    href: '/analyze',
  },
  {
    id: 'review-results',
    title: 'Revisa tus resultados',
    description: 'Explora las areas de mejora detectadas',
    completed: false,
    href: '/analyses',
  },
  {
    id: 'training-plan',
    title: 'Genera un plan de entrenamiento',
    description: 'Crea un plan personalizado basado en tu analisis',
    completed: false,
    href: '/training',
  },
]

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      showWelcomeModal: true,
      tourStep: null,
      isTourActive: false,
      steps: defaultSteps,

      setShowWelcomeModal: (show) => set({ showWelcomeModal: show }),

      startTour: () => set({ isTourActive: true, tourStep: 0 }),

      nextTourStep: () => {
        const { tourStep } = get()
        if (tourStep !== null && tourStep < 3) {
          set({ tourStep: tourStep + 1 })
        } else {
          set({ isTourActive: false, tourStep: null })
        }
      },

      previousTourStep: () => {
        const { tourStep } = get()
        if (tourStep !== null && tourStep > 0) {
          set({ tourStep: tourStep - 1 })
        }
      },

      endTour: () => set({ isTourActive: false, tourStep: null }),

      completeStep: (stepId) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        })),

      resetOnboarding: () =>
        set({
          showWelcomeModal: true,
          tourStep: null,
          isTourActive: false,
          steps: defaultSteps,
        }),
    }),
    {
      name: 'sporttech-onboarding',
      partialize: (state) => ({
        showWelcomeModal: state.showWelcomeModal,
        steps: state.steps,
      }),
    }
  )
)
