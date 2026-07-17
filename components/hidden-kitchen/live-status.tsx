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
    const chicagoTimeStr = nowDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })
    const chicagoDate = new Date(chicagoTimeStr)

    const day = chicagoDate.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hours = chicagoDate.getHours()
    const minutes = chicagoDate.getMinutes()
    const currentMin = hours * 60 + minutes

    const openMin = 11 * 60 // 11:00 AM
    const closeMin = 24 * 60 // 12:00 AM Midnight

    // Monday is closed
    if (day === 1) {
      return {
        isOpen: false,
        label: 'CLOSED NOW',
        detail: 'Opens Tue at 11 AM',
        nextOpenText: 'Opens Tuesday at 11 AM',
      }
    }

    // Tue - Sun: Open 11 AM to 12 AM Midnight
    if (currentMin >= openMin && currentMin < closeMin) {
      return {
        isOpen: true,
        label: 'OPEN NOW',
        detail: 'Kitchen \'til 8PM · Bar \'til Midnight',
        nextOpenText: 'Open Today until Midnight',
      }
    } else if (currentMin < openMin) {
      // Earlier today before 11 AM
      return {
        isOpen: false,
        label: 'CLOSED NOW',
        detail: 'Opens Today at 11 AM',
        nextOpenText: 'Opens Today at 11 AM',
      }
    } else {
      const nextDayName = day === 0 ? 'Tue' : day === 6 ? 'Sun' : 'Tomorrow'
      return {
        isOpen: false,
        label: 'CLOSED NOW',
        detail: `Opens ${nextDayName} at 11 AM`,
        nextOpenText: `Opens ${nextDayName} at 11 AM`,
      }
    }
  } catch {
    return {
      isOpen: true,
      label: 'OPEN NOW',
      detail: 'Kitchen \'til 8PM · Bar \'til Midnight',
      nextOpenText: 'Open Today',
    }
  }
}

export function useBusinessStatus() {
  const [status, setStatus] = useState<BusinessStatus | null>(null)

  useEffect(() => {
    const tick = () => {
      setStatus(getBusinessStatus(new Date()))
    }
    tick()
    const interval = setInterval(tick, 30000)
    return () => clearInterval(interval)
  }, [])

  return status
}

export function LiveStatusPill({ compact = false }: { compact?: boolean }) {
  const status = useBusinessStatus()

  if (!status) {
    return (
      <div className="h-7 w-32 rounded-full bg-gold/10 animate-pulse" aria-hidden />
    )
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-black/80 px-3 py-1 text-[11px] backdrop-blur-md shadow-md">
        <span className="relative flex h-2 w-2">
          {status.isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <span className="font-bold tracking-wider text-foreground">
          {status.label}
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-black/85 px-4 py-1.5 backdrop-blur-md shadow-xl text-xs">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
      </span>

      <span className="font-black uppercase tracking-widest text-foreground">
        {status.label}
      </span>

      <span className="text-gold/40">•</span>

      <span className="font-medium text-muted-foreground">
        {status.detail}
      </span>
    </div>
  )
}
