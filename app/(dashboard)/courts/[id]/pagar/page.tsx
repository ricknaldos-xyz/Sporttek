'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import CulqiCheckout from '@/components/CulqiCheckout'
import {
  ArrowLeft, Loader2, Clock, Calendar, MapPin, AlertTriangle,
  CreditCard, Timer,
} from 'lucide-react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

interface BookingDetail {
  id: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  estimatedTotalCents: number | null
  totalCents: number | null
  expiresAt: string | null
  court: {
    name: string
    address: string
    district: string
  }
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function PagarPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const courtId = params.id as string
  const bookingId = searchParams.get('bookingId')

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [expired, setExpired] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchBooking = useCallback(async () => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/courts/bookings?limit=50`)
      if (res.ok) {
        const data = await res.json()
        const found = (data.bookings || []).find(
          (b: BookingDetail) => b.id === bookingId
        )
        if (found) {
          setBooking(found)
          if (found.expiresAt) {
            const remaining = new Date(found.expiresAt).getTime() - Date.now()
            if (remaining <= 0) {
              setExpired(true)
              setTimeLeft(0)
            } else {
              setTimeLeft(remaining)
            }
          }
        }
      }
    } catch (err) {
      logger.error('Error fetching booking for payment:', err)
      toast.error('Error al cargar la reserva')
    } finally {
      setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

  // Countdown timer
  useEffect(() => {
    if (!booking?.expiresAt || expired) return

    timerRef.current = setInterval(() => {
      const remaining = new Date(booking.expiresAt!).getTime() - Date.now()
      if (remaining <= 0) {
        setExpired(true)
        setTimeLeft(0)
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [booking?.expiresAt, expired])

  const handleToken = async (tokenId: string) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/courts/${courtId}/book/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, tokenId }),
      })

      if (res.ok) {
        toast.success('Pago realizado exitosamente. Tu reserva esta confirmada.')
        router.push('/courts/bookings')
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al procesar el pago')
      }
    } catch (err) {
      logger.error('Payment error:', err)
      toast.error('Error de conexion al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentError = (error: unknown) => {
    logger.error('Culqi checkout error:', error)
    toast.error('Error en el proceso de pago')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!bookingId || !booking) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href={`/courts/${courtId}`}>
          <GlassButton variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la cancha
          </GlassButton>
        </Link>
        <GlassCard intensity="light" padding="xl">
          <div className="text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Reserva no encontrada</h3>
            <p className="text-muted-foreground text-sm">
              No se encontro la reserva para procesar el pago.
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  const chargeAmount = booking.estimatedTotalCents || 0
  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Link href={`/courts/${courtId}`}>
        <GlassButton variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la cancha
        </GlassButton>
      </Link>

      {/* Page title */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-7 w-7 text-primary" />
          Pagar reserva
        </h1>
        <p className="text-sm text-muted-foreground">
          Completa el pago para confirmar tu reserva.
        </p>
      </div>

      {/* Booking summary */}
      <GlassCard intensity="light" padding="lg">
        <h3 className="text-sm font-semibold mb-3">Detalle de la reserva</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{booking.court.name}</p>
              <p className="text-sm text-muted-foreground">
                {booking.court.address} - {booking.court.district}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.startTime} - {booking.endTime}</span>
            </div>
          </div>

          {booking.notes && (
            <p className="text-sm text-muted-foreground italic">
              {booking.notes}
            </p>
          )}

          <div className="border-t border-border/50 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total a pagar</span>
              <span className="text-2xl font-bold">
                S/ {(chargeAmount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Countdown timer */}
      {booking.expiresAt && (
        <GlassCard
          intensity="light"
          padding="md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className={`h-5 w-5 ${expired ? 'text-destructive' : 'text-primary'}`} />
              <span className="text-sm font-medium">
                {expired ? 'Reserva expirada' : 'Tiempo restante para pagar'}
              </span>
            </div>
            {expired ? (
              <GlassBadge variant="destructive">Expirada</GlassBadge>
            ) : (
              <span className="text-lg font-mono font-bold text-primary">
                {formatCountdown(timeLeft)}
              </span>
            )}
          </div>
        </GlassCard>
      )}

      {/* Payment or expired state */}
      {expired ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold">Reserva expirada</h3>
            <p className="text-muted-foreground text-sm">
              El tiempo para realizar el pago ha expirado.
              Por favor, crea una nueva reserva.
            </p>
            <Link href={`/courts/${courtId}`}>
              <GlassButton variant="solid" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la cancha
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <GlassCard intensity="medium" padding="lg">
          <CulqiCheckout
            amount={chargeAmount}
            title={booking.court.name}
            description={`Reserva ${formattedDate} ${booking.startTime}-${booking.endTime}`}
            onToken={handleToken}
            onError={handlePaymentError}
            disabled={processing || expired}
            loading={processing}
            buttonText="Pagar ahora"
            className="w-full"
          />
        </GlassCard>
      )}

      {/* Cancel link */}
      {!expired && (
        <div className="text-center">
          <Link href={`/courts/${courtId}`}>
            <GlassButton variant="ghost" size="sm">
              Cancelar
            </GlassButton>
          </Link>
        </div>
      )}
    </div>
  )
}
