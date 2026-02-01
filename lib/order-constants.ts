export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  PAID: 'Pagado',
  PROCESSING: 'En proceso',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

export const ORDER_STATUS_VARIANTS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'destructive'> = {
  PENDING_PAYMENT: 'warning',
  PAID: 'primary',
  PROCESSING: 'default',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
}
