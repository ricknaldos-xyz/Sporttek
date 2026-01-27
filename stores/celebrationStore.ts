import { create } from 'zustand'
import { BadgeType } from '@prisma/client'

export interface Celebration {
  id: string
  type: 'badge' | 'streak' | 'plan' | 'improvement'
  title: string
  message: string
  icon?: string
  badgeType?: BadgeType
}

interface CelebrationState {
  celebrations: Celebration[]
  currentCelebration: Celebration | null

  addCelebration: (celebration: Omit<Celebration, 'id'>) => void
  dismissCelebration: () => void
  clearAll: () => void
}

export const useCelebrationStore = create<CelebrationState>((set, get) => ({
  celebrations: [],
  currentCelebration: null,

  addCelebration: (celebration) => {
    const id = Math.random().toString(36).substring(7)
    const newCelebration = { ...celebration, id }

    set((state) => {
      const celebrations = [...state.celebrations, newCelebration]
      return {
        celebrations,
        currentCelebration: state.currentCelebration || newCelebration,
      }
    })
  },

  dismissCelebration: () => {
    set((state) => {
      const [, ...remaining] = state.celebrations
      return {
        celebrations: remaining,
        currentCelebration: remaining[0] || null,
      }
    })
  },

  clearAll: () => {
    set({ celebrations: [], currentCelebration: null })
  },
}))
