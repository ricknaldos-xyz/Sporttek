'use client'

import { formatPrice } from '@/lib/shop'
import { DELIVERY_COST_CENTS } from '@/lib/constants'

type ServiceType = 'STANDARD' | 'EXPRESS'
type DeliveryMode = 'HOME_PICKUP_DELIVERY' | 'WORKSHOP_DROP_PICKUP'

const SERVICE_PRICES: Record<ServiceType, number> = {
  STANDARD: 2500,
  EXPRESS: 4500,
}

const DELIVERY_PRICES: Record<DeliveryMode, number> = {
  HOME_PICKUP_DELIVERY: DELIVERY_COST_CENTS,
  WORKSHOP_DROP_PICKUP: 0,
}

interface FloatingPriceBarProps {
  serviceType: ServiceType
  deliveryMode: DeliveryMode
  visible: boolean
}

export function FloatingPriceBar({ serviceType, deliveryMode, visible }: FloatingPriceBarProps) {
  if (!visible) return null

  const servicePrice = SERVICE_PRICES[serviceType]
  const deliveryPrice = DELIVERY_PRICES[deliveryMode]
  const total = servicePrice + deliveryPrice

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-glass bg-background/80 backdrop-blur-xl safe-area-bottom">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Mobile: compact */}
        <div className="flex items-center justify-between md:hidden">
          <div className="text-sm text-muted-foreground">
            Total estimado
          </div>
          <div className="text-lg font-bold">{formatPrice(total)}</div>
        </div>
        {/* Desktop: breakdown */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Servicio: </span>
              <span className="font-medium">{formatPrice(servicePrice)}</span>
            </div>
            <span className="text-muted-foreground">+</span>
            <div>
              <span className="text-muted-foreground">Delivery: </span>
              <span className="font-medium">
                {deliveryPrice === 0 ? 'Gratis' : formatPrice(deliveryPrice)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
