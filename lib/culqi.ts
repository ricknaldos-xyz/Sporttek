import Culqi from 'culqi-node'

let culqiClient: InstanceType<typeof Culqi> | null = null

export function getCulqiClient() {
  if (!culqiClient) {
    if (!process.env.CULQI_SECRET_KEY) {
      throw new Error('CULQI_SECRET_KEY is not configured')
    }
    culqiClient = new Culqi({
      privateKey: process.env.CULQI_SECRET_KEY,
    })
  }
  return culqiClient
}

export const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Para comenzar',
    price: 0,
    culqiPlanId: null,
    features: [
      '3 analisis por mes',
      '1 plan de entrenamiento activo',
      'Acceso a Tenis',
      'Soporte por email',
    ],
    limits: {
      analysesPerMonth: 3,
      activePlans: 1,
    },
  },
  PRO: {
    name: 'Pro',
    description: 'Para deportistas serios',
    price: 29.90,
    culqiPlanId: process.env.CULQI_PRO_PLAN_ID || null,
    features: [
      'Analisis ilimitados',
      'Planes de entrenamiento ilimitados',
      'Acceso a todos los deportes',
      'Historial completo',
      'Soporte prioritario',
    ],
    limits: {
      analysesPerMonth: -1,
      activePlans: -1,
    },
  },
  ELITE: {
    name: 'Elite',
    description: 'Para profesionales',
    price: 49.99,
    culqiPlanId: process.env.CULQI_ELITE_PLAN_ID || null,
    features: [
      'Todo en Pro',
      'Analisis en video HD',
      'Comparacion de progreso avanzada',
      'Exportar informes PDF',
      'Sesiones de coaching virtual',
      'Soporte 24/7',
    ],
    limits: {
      analysesPerMonth: -1,
      activePlans: -1,
    },
  },
} as const

export type PlanType = keyof typeof PLANS
