'use client'

import { useEffect, useState } from 'react'

export type BusinessStatus = {
  isOpen: boolean
  label: string
  detail: string
  nextOpenText: string
}

export function getBusinessStatus(nowDate: Date = new Date()): BusinessStatus {
  try {
    // Extract Chicago/Carterville local time parts safely via Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })

    const parts = formatter.formatToParts(nowDate)
    let weekdayStr = ''
    let hours = 0
    let minutes = 0

    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value
      if (part.type === 'hour') hours = parseInt(part.value, 10)
      if (part.type === 'minute') minutes = parseInt(part.value, 10)
    }

    // Map weekday string to numeric index: 0 = Sun, 1 = Mon, 2 = Tue, ..., 6 = Sat
    const weekdayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    }
    const day = weekdayMap[weekdayStr] ?? nowDate.getDay()

    // Handle 24-hour formatting edge case (24 -> 0)
    if (hours === 24) hours = 0

    const currentMin = hours * 60 + minutes

    const openMin = 11 * 60 // 11:00 AM
    const kitchenCloseMin = 20 * 60 // 8:00 PM
    const barCloseMin = 24 * 60 // 12:00 AM Midnight

    // Monday is completely closed
    if (day === 1) {
      return {
        isOpen: false,
        label: 'Closed',
        detail: 'Opens Tue at 11 AM',
        nextOpenText: 'Opens Tuesday at 11:00 AM',
      }
    }

    // Both Kitchen and Bar open (11:00 AM - 8:00 PM)
    if (currentMin >= openMin && currentMin < kitchenCloseMin) {
      return {
        isOpen: true,
        label: 'Open',
        detail: 'Kitchen til 8 PM · Bar til Midnight',
        nextOpenText: 'Kitchen open until 8:00 PM',
      }
    }

    // Bar only open (8:00 PM - Midnight)
    if (currentMin >= kitchenCloseMin && currentMin < barCloseMin) {
      return {
        isOpen: true,
        label: 'Bar Open',
        detail: 'Kitchen closed at 8 PM · Bar til Midnight',
        nextOpenText: 'Bar open until Midnight',
      }
    }

    // Closed early morning before 11 AM
    if (currentMin < openMin) {
      return {
        isOpen: false,
        label: 'Closed',
        detail: 'Opens today at 11 AM',
        nextOpenText: 'Opens today at 11:00 AM',
      }
    }

    // Closed after Midnight (Sun night / Mon morning transition check)
    const nextDayLabel = day === 0 ? 'Tue' : 'Tomorrow'
    return {
      isOpen: false,
      label: 'Closed',
      detail: `Opens ${nextDayLabel} at 11 AM`,
      nextOpenText: `Opens ${nextDayLabel} at 11:00 AM`,
    }
  } catch {
    return {
      isOpen: false,
      label: 'Closed',
      detail: 'Opens at 11 AM',
      nextOpenText: 'Opens at 11:00 AM',
    }
  }
}

export function useBusinessStatus() {
  const [status, setStatus] = useState<BusinessStatus>(() => getBusinessStatus())

  useEffect(() => {
    const update = () => setStatus(getBusinessStatus())
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return status
}

export default useBusinessStatus