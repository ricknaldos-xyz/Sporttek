'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassTextarea } from '@/components/ui/glass-input'
import AvailabilityCalendar from '@/components/courts/AvailabilityCalendar'
import {
  ArrowLeft, MapPin, Phone, Globe, Clock, Loader2, Calendar,
  MessageCircle, CheckCircle, DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

const SURFACE_LABELS: Record<string, string> = {
  HARD: 'Dura',
  CLAY: 'Arcilla',
  GRASS: 'Cesped',
  SYNTHETIC: 'Sintetica',
}

const COURT_TYPE_LABELS: Record<string, string> = {
  INDOOR: 'Techada',
  OUTDOOR: 'Aire libre',
  COVERED: 'Semi-techada',
}

interface Court {
  id: string
  name: string
  description: string | null
  address: string
  district: string
  city: string
  phone: string | null
  whatsapp: string | null
  website: string | null
  imageUrl: string | null
  surface: string
  courtType: string
  hourlyRate: number
  currency: string
  amenities: string[]
  isActive: boolean
  operatingHours: Record<string, string> | null
}

export default function CourtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courtId = params.id as string

  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  // Slot selection state
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedStart, setSelectedStart] = useState<string>('')
  const [selectedEnd, setSelectedEnd] = useState<string>('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function fetchCourt() {
      try {
        const res = await fetch(`/api/courts/${courtId}`, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setCourt(data)
        } else {
          toast.error('No se pudo cargar la cancha')
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        toast.error('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchCourt()
    return () => controller.abort()
  }, [courtId])

  const handleSlotSelect = (date: string, startTime: string, endTime: string) => {
    setSelectedDate(date)
    setSelectedStart(startTime)
    setSelectedEnd(endTime)
  }

  // Calculate estimated price
  const estimatedPrice = (() => {
    if (!court || !selectedStart || !selectedEnd) return 0
    const [startH, startM] = selectedStart.split(':').map(Number)
    const [endH, endM] = selectedEnd.split(':').map(Number)
    const hours = (endH * 60 + endM - (startH * 60 + startM)) / 60
    return court.hourlyRate * hours
  })()

  const durationMinutes = (() => {
    if (!selectedStart || !selectedEnd) return 0
    const [startH, startM] = selectedStart.split(':').map(Number)
    const [endH, endM] = selectedEnd.split(':').map(Number)
    return endH * 60 + endM - (startH * 60 + startM)
  })()

  const handleBooking = async () => {
    if (!selectedDate || !selectedStart || !selectedEnd) {
      toast.error('Selecciona fecha y horario')
      return
    }
    setBooking(true)
    try {
      const res = await fetch(`/api/courts/${courtId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedStart,
          endTime: selectedEnd,
          notes: notes || undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        toast.success('Reserva creada exitosamente')
        router.push(`/courts/${courtId}/pagar?bookingId=${data.id}`)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al crear la reserva')
      }
    } catch (err) {
      logger.error('Booking error:', err)
      toast.error('Error de conexion')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!court) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/courts">
          <GlassButton variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a canchas
          </GlassButton>
        </Link>
        <GlassCard intensity="light" padding="xl">
          <div className="text-center space-y-3">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Cancha no encontrada</h3>
            <p className="text-muted-foreground text-sm">
              La cancha que buscas no existe o fue eliminada.
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/courts">
        <GlassButton variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a canchas
        </GlassButton>
      </Link>

      {/* Hero image */}
      {court.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={court.imageUrl}
            alt={court.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Court name + badges */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{court.name}</h1>
        <div className="flex flex-wrap gap-2">
          <GlassBadge variant="primary" size="sm">
            {SURFACE_LABELS[court.surface] || court.surface}
          </GlassBadge>
          <GlassBadge variant="default" size="sm">
            {COURT_TYPE_LABELS[court.courtType] || court.courtType}
          </GlassBadge>
        </div>
      </div>

      {/* Info grid */}
      <GlassCard intensity="light" padding="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Direccion</p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm">{court.address}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Distrito</p>
            <p className="text-sm">{court.district}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Tarifa por hora</p>
            <p className="text-xl font-bold">
              S/ {court.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hora</span>
            </p>
          </div>
          {court.amenities && court.amenities.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Amenidades</p>
              <div className="flex flex-wrap gap-1">
                {court.amenities.map((amenity) => (
                  <GlassBadge key={amenity} variant="success" size="sm">
                    {amenity}
                  </GlassBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Description */}
      {court.description && (
        <GlassCard intensity="light" padding="lg">
          <p className="text-sm text-muted-foreground">{court.description}</p>
        </GlassCard>
      )}

      {/* Contact */}
      <GlassCard intensity="light" padding="lg">
        <h3 className="text-sm font-semibold mb-3">Contacto</h3>
        <div className="flex flex-wrap gap-3">
          {court.phone && (
            <a href={`tel:${court.phone}`}>
              <GlassButton variant="ghost" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                {court.phone}
              </GlassButton>
            </a>
          )}
          {court.whatsapp && (
            <a
              href={`https://wa.me/${court.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quisiera reservar una cancha')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlassButton variant="primary" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </GlassButton>
            </a>
          )}
          {court.website && (
            <a href={court.website} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Sitio web
              </GlassButton>
            </a>
          )}
        </div>
      </GlassCard>

      {/* Operating hours */}
      {court.operatingHours && Object.keys(court.operatingHours).length > 0 && (
        <GlassCard intensity="light" padding="lg">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Horario de atencion
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(court.operatingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm">
                <span className="font-medium capitalize">{day}</span>
                <span className="text-muted-foreground">{hours}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Availability Calendar */}
      <AvailabilityCalendar
        courtId={courtId}
        onSlotSelect={handleSlotSelect}
        selectedDate={selectedDate}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
      />

      {/* Booking Summary */}
      {selectedDate && selectedStart && selectedEnd && (
        <GlassCard intensity="medium" padding="lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Resumen de reserva
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Fecha</p>
                <p className="font-medium">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-PE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Horario</p>
                <p className="font-medium">{selectedStart} - {selectedEnd}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Duracion</p>
                <p className="font-medium">
                  {durationMinutes >= 60
                    ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}min` : ''}`
                    : `${durationMinutes}min`
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Precio estimado</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  S/ {estimatedPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Notas (opcional)
              </label>
              <GlassTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ejemplo: Traeremos pelotas propias..."
                rows={3}
              />
            </div>

            <GlassButton
              variant="solid"
              size="lg"
              className="w-full"
              disabled={booking}
              onClick={handleBooking}
            >
              {booking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reservando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservar y Pagar
                </>
              )}
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
