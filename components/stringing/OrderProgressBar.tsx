'use client'

const STATUS_PROGRESS: Record<string, number> = {
  PENDING_PAYMENT: 0,
  CONFIRMED: 14,
  PICKUP_SCHEDULED: 28,
  RECEIVED_AT_WORKSHOP: 42,
  IN_PROGRESS: 57,
  STRINGING_COMPLETED: 71,
  READY_FOR_PICKUP: 85,
  OUT_FOR_DELIVERY: 85,
  DELIVERED: 100,
  STRINGING_CANCELLED: 0,
}

interface OrderProgressBarProps {
  status: string
}

export function OrderProgressBar({ status }: OrderProgressBarProps) {
  const progress = STATUS_PROGRESS[status] ?? 0

  if (progress === 0 || status === 'STRINGING_CANCELLED') return null

  return (
    <div className="w-full h-1 rounded-full bg-muted/50 mt-3 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
