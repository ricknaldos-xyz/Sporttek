import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateId } from '@/lib/validation'

const DAY_NAMES: Record<number, string> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
}

function parseTimeRange(range: string): { start: string; end: string } {
  const parts = range.split('-').map((s) => s.trim())
  return { start: parts[0], end: parts[1] }
}

function generateSlots(start: string, end: string): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = []
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  for (let m = startMinutes; m + 30 <= endMinutes; m += 30) {
    const sH = String(Math.floor(m / 60)).padStart(2, '0')
    const sM = String(m % 60).padStart(2, '0')
    const eH = String(Math.floor((m + 30) / 60)).padStart(2, '0')
    const eM = String((m + 30) % 60).padStart(2, '0')
    slots.push({ startTime: `${sH}:${sM}`, endTime: `${eH}:${eM}` })
  }

  return slots
}

// GET - Get available time slots for a court on a specific date
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courtId } = await params
    if (!validateId(courtId)) {
      return NextResponse.json({ error: 'ID invalido' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: 'Parametro date es requerido en formato YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const court = await prisma.court.findUnique({
      where: { id: courtId },
      select: {
        id: true,
        name: true,
        hourlyRate: true,
        currency: true,
        isActive: true,
        operatingHours: true,
      },
    })

    if (!court || !court.isActive) {
      return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
    }

    // Determine operating hours for the requested day
    const requestedDate = new Date(dateStr + 'T00:00:00')
    const dayOfWeek = requestedDate.getUTCDay()
    const dayName = DAY_NAMES[dayOfWeek]

    let operatingStart = '07:00'
    let operatingEnd = '22:00'

    if (court.operatingHours && typeof court.operatingHours === 'object') {
      const hours = court.operatingHours as Record<string, string>
      if (hours[dayName]) {
        const parsed = parseTimeRange(hours[dayName])
        operatingStart = parsed.start
        operatingEnd = parsed.end
      }
    }

    // Generate all 30-min slots
    const slots = generateSlots(operatingStart, operatingEnd)

    // Fetch existing bookings for this court and date that are not cancelled/rejected
    const bookingDate = new Date(dateStr + 'T00:00:00.000Z')
    const existingBookings = await prisma.courtBooking.findMany({
      where: {
        courtId,
        date: bookingDate,
        status: {
          notIn: ['CANCELLED', 'REJECTED'],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    // Mark each slot as available or not
    const slotsWithAvailability = slots.map((slot) => {
      const overlaps = existingBookings.some(
        (booking) => booking.startTime < slot.endTime && booking.endTime > slot.startTime
      )
      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: !overlaps,
      }
    })

    return NextResponse.json({
      court: {
        id: court.id,
        name: court.name,
        hourlyRate: court.hourlyRate,
        currency: court.currency,
      },
      date: dateStr,
      slots: slotsWithAvailability,
    })
  } catch (error) {
    logger.error('Court availability error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
