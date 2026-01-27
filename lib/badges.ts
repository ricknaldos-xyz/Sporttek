import { BadgeType } from '@prisma/client'

export interface BadgeDefinition {
  type: BadgeType
  name: string
  description: string
  icon: string
  color: string
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  FIRST_ANALYSIS: {
    type: 'FIRST_ANALYSIS',
    name: 'Primer Analisis',
    description: 'Completa tu primer analisis de tecnica',
    icon: '🎯',
    color: 'bg-blue-100 text-blue-700',
  },
  WEEK_PERFECT: {
    type: 'WEEK_PERFECT',
    name: 'Semana Perfecta',
    description: '7 dias consecutivos de actividad',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-700',
  },
  PLAN_COMPLETED: {
    type: 'PLAN_COMPLETED',
    name: 'Plan Completado',
    description: 'Termina un plan de entrenamiento completo',
    icon: '🏆',
    color: 'bg-purple-100 text-purple-700',
  },
  IMPROVEMENT: {
    type: 'IMPROVEMENT',
    name: 'Mejora Visible',
    description: 'Tu score subio 1+ puntos en la misma tecnica',
    icon: '📈',
    color: 'bg-green-100 text-green-700',
  },
  DEDICATION_30: {
    type: 'DEDICATION_30',
    name: 'Dedicacion',
    description: '30 dias de actividad total',
    icon: '💪',
    color: 'bg-orange-100 text-orange-700',
  },
  STREAK_7: {
    type: 'STREAK_7',
    name: 'Racha de 7',
    description: 'Alcanza una racha de 7 dias',
    icon: '🔥',
    color: 'bg-red-100 text-red-700',
  },
  STREAK_30: {
    type: 'STREAK_30',
    name: 'Racha de 30',
    description: 'Alcanza una racha de 30 dias',
    icon: '🔥🔥',
    color: 'bg-red-100 text-red-700',
  },
  STREAK_100: {
    type: 'STREAK_100',
    name: 'Racha Legendaria',
    description: 'Alcanza una racha de 100 dias',
    icon: '🔥🔥🔥',
    color: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700',
  },
}

export function getBadgeDefinition(type: BadgeType): BadgeDefinition {
  return BADGE_DEFINITIONS[type]
}
