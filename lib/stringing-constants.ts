export const STRINGING_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  CONFIRMED: 'Confirmado',
  PICKUP_SCHEDULED: 'Recojo programado',
  RECEIVED_AT_WORKSHOP: 'Recibido en taller',
  IN_PROGRESS: 'En proceso',
  STRINGING_COMPLETED: 'Encordado completado',
  READY_FOR_PICKUP: 'Listo para recoger',
  OUT_FOR_DELIVERY: 'En camino',
  DELIVERED: 'Entregado',
  STRINGING_CANCELLED: 'Cancelado',
}

export const STRINGING_STATUS_VARIANTS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'destructive'> = {
  PENDING_PAYMENT: 'warning',
  CONFIRMED: 'primary',
  PICKUP_SCHEDULED: 'default',
  RECEIVED_AT_WORKSHOP: 'default',
  IN_PROGRESS: 'primary',
  STRINGING_COMPLETED: 'success',
  READY_FOR_PICKUP: 'success',
  OUT_FOR_DELIVERY: 'primary',
  DELIVERED: 'success',
  STRINGING_CANCELLED: 'destructive',
}
