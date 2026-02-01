'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Loader2, Calendar } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Slot {
  startTime: string
  endTime: string
  available: boolean
}

interface AvailabilityCalendarProps {
  courtId: string
  onSlotSelect: (date: string, startTime: string, endTime: string) => void
  selectedDate?: string
  selectedStart?: string
  selectedEnd?: string
}

function generateNext14Days(): { date: string; label: string; dayName: string }[] {
  const days: { date: string; label: string; dayName: string }[] = []
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
  const today = new Date()

  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      label: `${dd}/${mm}`,
      dayName: dayNames[d.getDay()],
    })
  }

  return days
}

function AvailabilityCalendarInner({
  courtId,
  onSlotSelect,
  selectedDate,
  selectedStart,
  selectedEnd,
}: AvailabilityCalendarProps) {
  const days = React.useMemo(() => generateNext14Days(), [])
  const [activeDate, setActiveDate] = useState(selectedDate || days[0].date)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectionStart, setSelectionStart] = useState<number | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Sync external selected values to internal state
  useEffect(() => {
    if (selectedDate && selectedDate !== activeDate) {
      setActiveDate(selectedDate)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  useEffect(() => {
    if (selectedStart && selectedEnd && slots.length > 0) {
      const startIdx = slots.findIndex((s) => s.startTime === selectedStart)
      const endIdx = slots.findIndex((s) => s.endTime === selectedEnd)
      if (startIdx !== -1 && endIdx !== -1) {
        setSelectionStart(startIdx)
        setSelectionEnd(endIdx)
      }
    }
  }, [selectedStart, selectedEnd, slots])

  const fetchAvailability = useCallback(async (date: string) => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setSlots([])
    setSelectionStart(null)
    setSelectionEnd(null)

    try {
      const res = await fetch(
        `/api/courts/${courtId}/availability?date=${date}`,
        { signal: controller.signal }
      )
      if (res.ok) {
        const data = await res.json()
        setSlots(data.slots || [])
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      logger.error('Error fetching availability:', err)
    } finally {
      setLoading(false)
    }
  }, [courtId])

  useEffect(() => {
    fetchAvailability(activeDate)
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [activeDate, fetchAvailability])

  const handleDateSelect = (date: string) => {
    setActiveDate(date)
    setSelectionStart(null)
    setSelectionEnd(null)
  }

  const handleSlotClick = (index: number) => {
    if (!slots[index].available) return

    if (selectionStart === null) {
      // First click: set start
      setSelectionStart(index)
      setSelectionEnd(null)
      // Emit single slot
      onSlotSelect(activeDate, slots[index].startTime, slots[index].endTime)
    } else if (selectionEnd === null) {
      // Second click: set end
      const start = Math.min(selectionStart, index)
      const end = Math.max(selectionStart, index)

      // Check all slots between start and end are available
      const allAvailable = slots.slice(start, end + 1).every((s) => s.available)
      if (!allAvailable) {
        // Reset and start fresh with this slot
        setSelectionStart(index)
        setSelectionEnd(null)
        onSlotSelect(activeDate, slots[index].startTime, slots[index].endTime)
        return
      }

      setSelectionStart(start)
      setSelectionEnd(end)
      onSlotSelect(activeDate, slots[start].startTime, slots[end].endTime)
    } else {
      // Third click: reset and start new selection
      setSelectionStart(index)
      setSelectionEnd(null)
      onSlotSelect(activeDate, slots[index].startTime, slots[index].endTime)
    }
  }

  const isSlotSelected = (index: number): boolean => {
    if (selectionStart === null) return false
    if (selectionEnd === null) return index === selectionStart
    return index >= selectionStart && index <= selectionEnd
  }

  return (
    <GlassCard intensity="medium" padding="lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Disponibilidad
      </h3>

      {/* Date chips - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDateSelect(day.date)}
            className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
              activeDate === day.date
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'glass-light hover:glass-medium'
            }`}
          >
            <span className="text-[10px] uppercase opacity-70">{day.dayName}</span>
            <span className="text-sm font-semibold">{day.label}</span>
          </button>
        ))}
      </div>

      {/* Slots grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No hay horarios disponibles para esta fecha.
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3 mt-1">
            Selecciona un horario de inicio y fin para tu reserva.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {slots.map((slot, index) => {
              const selected = isSlotSelected(index)
              const booked = !slot.available

              return (
                <button
                  key={`${slot.startTime}-${slot.endTime}`}
                  disabled={booked}
                  onClick={() => handleSlotClick(index)}
                  className={`
                    px-2 py-2.5 rounded-xl text-xs font-medium transition-all text-center
                    ${
                      booked
                        ? 'opacity-40 cursor-not-allowed line-through bg-destructive/10 text-muted-foreground'
                        : selected
                          ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50'
                          : 'glass-light hover:glass-medium hover:border-green-500/30 border border-green-500/20 text-foreground'
                    }
                  `}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              )
            })}
          </div>
        </>
      )}
    </GlassCard>
  )
}

const AvailabilityCalendar = React.memo(AvailabilityCalendarInner)
AvailabilityCalendar.displayName = 'AvailabilityCalendar'

export default AvailabilityCalendar
