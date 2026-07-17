export type Show = {
  day: string
  weekday: number // 0 = Sun ... 6 = Sat
  act: string
  genre: string
  hour: number // 24h start time (music)
}

// Single source of truth for the weekly live-music schedule.
export const lineup: Show[] = [
  { day: 'Thu', weekday: 4, act: 'TBA', genre: '', hour: 20 },
  { day: 'Fri', weekday: 5, act: 'TBA', genre: '', hour: 20 },
  { day: 'Sat', weekday: 6, act: 'TBA', genre: '', hour: 20 },
  { day: 'Sun', weekday: 0, act: 'TBA', genre: '', hour: 20 },
]

export type NextShow = {
  show: Show
  target: Date
  isTonight: boolean
  isLive: boolean
}

// Compute the next (or currently-live) show relative to `now`.
export function getNextShow(now: Date): NextShow {
  const sorted = [...lineup].sort((a, b) => a.weekday - b.weekday)

  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(now)
    candidate.setDate(now.getDate() + offset)
    const weekday = candidate.getDay()
    const show = sorted.find((s) => s.weekday === weekday)
    if (!show) continue

    const start = new Date(candidate)
    start.setHours(show.hour, 0, 0, 0)
    const end = new Date(start)
    end.setHours(show.hour + 3, 0, 0, 0) // ~3h set

    // Live right now
    if (offset === 0 && now >= start && now <= end) {
      return { show, target: start, isTonight: true, isLive: true }
    }
    // Upcoming today or a future day
    if (now < start) {
      return { show, target: start, isTonight: offset === 0, isLive: false }
    }
  }

  // Fallback (shouldn't hit): first show next week
  const show = sorted[0]
  const target = new Date(now)
  target.setDate(now.getDate() + 7)
  target.setHours(show.hour, 0, 0, 0)
  return { show, target, isTonight: false, isLive: false }
}
