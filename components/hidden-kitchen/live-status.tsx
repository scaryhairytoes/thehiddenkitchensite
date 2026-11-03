'use client'

import { useEffect, useState, useRef } from 'react'
import {
  DayHours,
  BusinessStatus,
  DEFAULT_HOURS,
  calculateBusinessStatus,
} from '@/lib/business-hours-shared'

export type { BusinessStatus }

/** Backward-compatible export */
export function getBusinessStatus(
  nowDate: Date = new Date(),
  hours: DayHours[] = DEFAULT_HOURS
): BusinessStatus {
  return calculateBusinessStatus(hours, nowDate)
}

export function useBusinessStatus(initialHours?: DayHours[]) {
  const [hours, setHours] = useState<DayHours[]>(() => initialHours || DEFAULT_HOURS)
  const [status, setStatus] = useState<BusinessStatus>(() => calculateBusinessStatus(initialHours || DEFAULT_HOURS))
  const hoursRef = useRef(hours)
  hoursRef.current = hours

  // If initialHours were passed and change, update state
  useEffect(() => {
    if (initialHours && initialHours.length > 0) {
      setHours(initialHours)
      setStatus(calculateBusinessStatus(initialHours))
    }
  }, [initialHours])

  // Fetch latest hours from API if not initially provided
  useEffect(() => {
    if (initialHours && initialHours.length > 0) return

    let isMounted = true
    fetch('/api/business-hours')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.hours && Array.isArray(data.hours)) {
          setHours(data.hours)
          setStatus(calculateBusinessStatus(data.hours))
        }
      })
      .catch((err) => {
        console.warn('[live-status] Could not fetch CMS hours, using defaults:', err)
      })

    return () => {
      isMounted = false
    }
  }, [initialHours])

  // Recalculate status every minute
  useEffect(() => {
    const update = () => {
      setStatus(calculateBusinessStatus(hoursRef.current))
    }
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return status
}

export default useBusinessStatus
