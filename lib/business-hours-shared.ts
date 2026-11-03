// ── Types ────────────────────────────────────────────────────────────────────
export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export type DayHours = {
  day: DayOfWeek
  isClosed: boolean
  kitchenOpen?: string  // "HH:MM" 24h format, e.g. "11:00"
  kitchenClose?: string // "HH:MM" 24h format, e.g. "20:00"
  barOpen?: string      // "HH:MM" 24h format
  barClose?: string     // "HH:MM" 24h format, "00:00" = midnight
  label?: string        // Display text for footer, e.g. "11AM–8PM (BAR TIL MIDNIGHT)"
}

export type BusinessStatus = {
  isOpen: boolean
  label: string
  detail: string
  nextOpenText: string
}

// ── Day mappings ─────────────────────────────────────────────────────────────
export const DAY_INDEX: Record<DayOfWeek, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
}

export const DAY_SHORT: Record<DayOfWeek, string> = {
  sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
}

export const DAY_FULL: Record<DayOfWeek, string> = {
  sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
}

export const DAY_ABBREV: Record<DayOfWeek, string> = {
  monday: 'MON', tuesday: 'TUE', wednesday: 'WED', thursday: 'THU', friday: 'FRI', saturday: 'SAT', sunday: 'SUN',
}

// Week order for footer display (Mon first, Sun last)
export const WEEK_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// ── Default hours (used for seeding + fallback) ──────────────────────────────
export const DEFAULT_HOURS: DayHours[] = [
  { day: 'sunday',    isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '12:00', barClose: '00:00', label: '11AM–8PM (BAR 12PM–MIDNIGHT)' },
  { day: 'monday',    isClosed: true,  label: 'CLOSED' },
  { day: 'tuesday',   isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '11:00', barClose: '00:00', label: '11AM–8PM (BAR TIL MIDNIGHT)' },
  { day: 'wednesday', isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '11:00', barClose: '00:00', label: '11AM–8PM (BAR TIL MIDNIGHT)' },
  { day: 'thursday',  isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '11:00', barClose: '00:00', label: '11AM–8PM (BAR TIL MIDNIGHT)' },
  { day: 'friday',    isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '11:00', barClose: '00:00', label: '11AM–8PM (BAR TIL MIDNIGHT)' },
  { day: 'saturday',  isClosed: false, kitchenOpen: '11:00', kitchenClose: '20:00', barOpen: '11:00', barClose: '00:00', label: '11AM–8PM (BAR TIL MIDNIGHT)' },
]

// ── Time helpers ─────────────────────────────────────────────────────────────

/** Convert "HH:MM" to total minutes. For close times, "00:00" → 1440 (midnight end-of-day). */
export function timeToMinutes(time: string, isCloseTime: boolean = false): number {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  const minutes = (h || 0) * 60 + (m || 0)
  if (isCloseTime && minutes === 0) return 24 * 60
  return minutes
}

/** Convert "11:00" → "11 AM", "20:00" → "8 PM", "00:00" → "Midnight" */
export function formatTime24to12(time24: string): string {
  if (!time24) return ''
  const [h, m] = time24.split(':').map(Number)
  if (h === 0 && m === 0) return 'Midnight'
  if (h === 12 && m === 0) return '12 PM'
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

/** Get the DayHours entry for a given numeric day index (0=Sun..6=Sat) */
export function getDayByIndex(hours: DayHours[], dayIndex: number): DayHours | undefined {
  return hours.find(d => DAY_INDEX[d.day] === dayIndex)
}

/** Find the next open day after `currentDayIndex`, returning the day and how many days ahead. */
export function getNextOpenDay(
  hours: DayHours[],
  currentDayIndex: number
): { day: DayHours; dayName: string; daysAhead: number } | undefined {
  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentDayIndex + i) % 7
    const nextDay = getDayByIndex(hours, nextIndex)
    if (nextDay && !nextDay.isClosed) {
      return { day: nextDay, dayName: DAY_SHORT[nextDay.day], daysAhead: i }
    }
  }
  return undefined
}

// ── Live status calculation ──────────────────────────────────────────────────
export function calculateBusinessStatus(
  hours: DayHours[] = DEFAULT_HOURS,
  nowDate: Date = new Date()
): BusinessStatus {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })

    const parts = formatter.formatToParts(nowDate)
    let weekdayStr = ''
    let h = 0
    let m = 0

    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value
      if (part.type === 'hour') h = parseInt(part.value, 10)
      if (part.type === 'minute') m = parseInt(part.value, 10)
    }

    const weekdayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    }
    const day = weekdayMap[weekdayStr] ?? nowDate.getDay()
    if (h === 24) h = 0

    const currentMin = h * 60 + m
    const today = getDayByIndex(hours, day)

    // Day is completely closed or not configured
    if (!today || today.isClosed) {
      const nextOpen = getNextOpenDay(hours, day)
      const targetDay = nextOpen ? (nextOpen.daysAhead === 1 ? 'Tomorrow' : nextOpen.dayName) : 'soon'
      const openTime = nextOpen?.day.kitchenOpen ? formatTime24to12(nextOpen.day.kitchenOpen) : '11 AM'
      return {
        isOpen: false,
        label: 'Closed',
        detail: `Opens ${targetDay} at ${openTime}`,
        nextOpenText: `Opens ${targetDay} at ${openTime}`,
      }
    }

    const openMin = timeToMinutes(today.kitchenOpen || '11:00')
    const kitchenCloseMin = timeToMinutes(today.kitchenClose || '20:00', true)
    const barCloseMin = timeToMinutes(today.barClose || '00:00', true)

    // Before opening
    if (currentMin < openMin) {
      const openTime = formatTime24to12(today.kitchenOpen || '11:00')
      return {
        isOpen: false,
        label: 'Closed',
        detail: `Opens today at ${openTime}`,
        nextOpenText: `Opens today at ${openTime}`,
      }
    }

    // Both Kitchen and Bar open
    if (currentMin >= openMin && currentMin < kitchenCloseMin) {
      const kClose = formatTime24to12(today.kitchenClose || '20:00')
      const bClose = formatTime24to12(today.barClose || '00:00')
      return {
        isOpen: true,
        label: 'Open',
        detail: `Kitchen til ${kClose} · Bar til ${bClose}`,
        nextOpenText: `Kitchen open until ${kClose}`,
      }
    }

    // Bar only open
    if (currentMin >= kitchenCloseMin && currentMin < barCloseMin) {
      const kClose = formatTime24to12(today.kitchenClose || '20:00')
      const bClose = formatTime24to12(today.barClose || '00:00')
      return {
        isOpen: true,
        label: 'Bar Open',
        detail: `Kitchen closed at ${kClose} · Bar til ${bClose}`,
        nextOpenText: `Bar open until ${bClose}`,
      }
    }

    // Closed after bar close
    const nextOpen = getNextOpenDay(hours, day)
    const nextDayLabel = nextOpen ? (nextOpen.daysAhead === 1 ? 'Tomorrow' : nextOpen.dayName) : 'soon'
    const openTime = nextOpen?.day.kitchenOpen ? formatTime24to12(nextOpen.day.kitchenOpen) : '11 AM'
    return {
      isOpen: false,
      label: 'Closed',
      detail: `Opens ${nextDayLabel} at ${openTime}`,
      nextOpenText: `Opens ${nextDayLabel} at ${openTime}`,
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

// ── Footer grouping ─────────────────────────────────────────────────────────
export type HoursGroup = {
  dayRange: string
  label: string
}

/** Group consecutive days (Mon→Sun order) that share the same display label. */
export function groupHoursForDisplay(hours: DayHours[]): HoursGroup[] {
  const sorted = WEEK_ORDER
    .map(day => hours.find(h => h.day === day))
    .filter(Boolean) as DayHours[]

  if (sorted.length === 0) return []

  const groups: HoursGroup[] = []
  let i = 0
  while (i < sorted.length) {
    const currentLabel = sorted[i].label || (sorted[i].isClosed ? 'CLOSED' : '')
    let j = i + 1
    while (j < sorted.length) {
      const nextLabel = sorted[j].label || (sorted[j].isClosed ? 'CLOSED' : '')
      if (nextLabel === currentLabel) j++
      else break
    }
    const startAbbrev = DAY_ABBREV[sorted[i].day]
    const endAbbrev = DAY_ABBREV[sorted[j - 1].day]
    const dayRange = i === j - 1 ? startAbbrev : `${startAbbrev} - ${endAbbrev}`
    groups.push({ dayRange, label: currentLabel })
    i = j
  }
  return groups
}

// ── Schema.org structured data ──────────────────────────────────────────────
export function toSchemaOrgHours(hours: DayHours[]) {
  const openDays = hours.filter(d => !d.isClosed && d.kitchenOpen && d.kitchenClose)

  // Group by same kitchen open/close times
  const groups = new Map<string, string[]>()
  for (const day of openDays) {
    const key = `${day.kitchenOpen}|${day.kitchenClose}`
    const existing = groups.get(key) || []
    existing.push(DAY_FULL[day.day])
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, dayNames]) => {
    const [opens, closes] = key.split('|')
    return {
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: dayNames.length === 1 ? dayNames[0] : dayNames,
      opens,
      closes: closes === '00:00' ? '23:59' : closes,
    }
  })
}

// ── Reservation time-slot generation ─────────────────────────────────────────

/** Generate half-hour time slots from the earliest kitchen open to latest kitchen close across all open days. */
export function generateTimeSlots(hours: DayHours[]): string[] {
  const openDays = hours.filter(d => !d.isClosed && d.kitchenOpen && d.kitchenClose)
  if (openDays.length === 0) return []

  let earliestOpen = Infinity
  let latestClose = 0
  for (const day of openDays) {
    earliestOpen = Math.min(earliestOpen, timeToMinutes(day.kitchenOpen!))
    latestClose = Math.max(latestClose, timeToMinutes(day.kitchenClose!, true))
  }

  const slots: string[] = []
  for (let m = earliestOpen; m <= latestClose; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    const timeStr = min === 0 ? `${hour12}:00 ${period}` : `${hour12}:${min.toString().padStart(2, '0')} ${period}`
    slots.push(timeStr)
  }
  return slots
}

/** Get a human-readable string of open day ranges, e.g. "Tuesday - Sunday". */
export function getOpenDaysText(hours: DayHours[]): string {
  const openDays = WEEK_ORDER.filter(d => {
    const entry = hours.find(h => h.day === d)
    return entry && !entry.isClosed
  })
  if (openDays.length === 0) return ''
  if (openDays.length === 7) return 'Monday - Sunday'

  const firstFull = DAY_FULL[openDays[0]]
  const lastFull = DAY_FULL[openDays[openDays.length - 1]]
  return `${firstFull} - ${lastFull}`
}

