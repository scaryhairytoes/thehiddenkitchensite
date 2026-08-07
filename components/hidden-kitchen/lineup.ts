import { useEffect, useState } from 'react'

export type Show = {
  day: string
  weekday: number // 0 = Sun ... 6 = Sat
  act: string
  genre: string
  category?: string // 'Live Music' | 'Stand-Up Comedy' | 'Trivia Night' | 'Special Event'
  hour: number // 24h start time
  endHour?: number // 24h end time
  timeStr?: string // Custom display time e.g. "8:30 PM – 10:30 PM"
  dateStr?: string // YYYY-MM-DD
  monthKey?: string // 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC'
  facebookUrl?: string
  socialUrl?: string
}

type CMSDoc = {
  day?: string
  weekday?: number
  act?: string
  genre?: string
  category?: string
  hour?: number
  endHour?: number
  timeStr?: string
  dateStr?: string
  monthKey?: string
  facebookUrl?: string
  socialUrl?: string
  actUrl?: string
}

export function formatFacebookUrl(url?: string): string {
  if (!url || !url.trim()) return '#'
  let trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`
  }
  return trimmed
}

export function formatShowTimeRange(startHour?: number, endHour?: number, customTimeStr?: string): string {
  if (customTimeStr && customTimeStr.trim()) {
    return customTimeStr.trim()
  }

  if (startHour === undefined || startHour === null) return '5-8PM'
  const end = endHour !== undefined && endHour !== null ? endHour : (startHour + 3) % 24

  const fmt = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    const h12 = hours % 12 === 0 ? 12 : hours % 12
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const minStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ''
    return { h12Str: `${h12}${minStr}`, ampm }
  }

  const s = fmt(startHour)
  const e = fmt(end)

  if (s.ampm === e.ampm) {
    return `${s.h12Str}-${e.h12Str}${e.ampm}`
  }
  return `${s.h12Str}${s.ampm}-${e.h12Str}${e.ampm}`
}

function getMonthKey(dayStr: string): string {
  const upper = dayStr.toUpperCase()
  if (upper.includes('JAN')) return 'JAN'
  if (upper.includes('FEB')) return 'FEB'
  if (upper.includes('MAR')) return 'MAR'
  if (upper.includes('APR')) return 'APR'
  if (upper.includes('MAY')) return 'MAY'
  if (upper.includes('JUN')) return 'JUN'
  if (upper.includes('JUL')) return 'JUL'
  if (upper.includes('AUG')) return 'AUG'
  if (upper.includes('SEP')) return 'SEP'
  if (upper.includes('OCT')) return 'OCT'
  if (upper.includes('NOV')) return 'NOV'
  if (upper.includes('DEC')) return 'DEC'
  const currentMonthIdx = new Date().getMonth()
  const monthKeys = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return monthKeys[currentMonthIdx]
}

export function useLineupData() {
  const [data, setData] = useState<Show[]>(lineup)

  useEffect(() => {
    async function loadCMS() {
      try {
        const res = await fetch('/api/lineup?limit=100', { cache: 'no-store' })

        if (!res.ok) {
          console.warn('[Lineup] CMS returned non-200 status:', res.status)
          return
        }

        const text = await res.text()
        if (!text || !text.trim()) {
          console.warn('[Lineup] Received empty body from /api/lineup')
          return
        }

        const json = JSON.parse(text)
        if (json.docs && Array.isArray(json.docs) && json.docs.length > 0) {
          const cmsShows: Show[] = json.docs.map((doc: CMSDoc) => ({
            day: doc.day || '',
            weekday: typeof doc.weekday === 'number' ? doc.weekday : 3,
            act: doc.act || '',
            genre: doc.genre || 'Live Music',
            category: doc.category || 'Live Music',
            hour: typeof doc.hour === 'number' ? doc.hour : 17,
            endHour: typeof doc.endHour === 'number' ? doc.endHour : 20,
            timeStr: doc.timeStr || undefined,
            dateStr: doc.dateStr || undefined,
            monthKey: doc.monthKey || getMonthKey(doc.day || ''),
            facebookUrl: doc.facebookUrl ? formatFacebookUrl(doc.facebookUrl) : undefined,
            socialUrl: doc.socialUrl || doc.actUrl ? formatFacebookUrl(doc.socialUrl || doc.actUrl) : undefined,
          }))

          setData(cmsShows)
        }
      } catch {
        // Silent fallback to static lineup during dev server warmup
      }
    }
    loadCMS()
  }, [])

  return data
}

// Single source of truth for fallback schedule.
export const lineup: Show[] = [
  { dateStr: '2026-07-22', day: 'Jul 22', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events' },
  { dateStr: '2026-07-29', day: 'Jul 29', weekday: 3, act: 'Taylor Kearney', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events' },
  { dateStr: '2026-08-05', day: 'Aug 5', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'AUG' },
  { dateStr: '2026-08-12', day: 'Aug 12', weekday: 3, act: 'Tim Crosby', genre: 'Singer-Songwriter', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'AUG' },
  { dateStr: '2026-08-26', day: 'Aug 26', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'AUG' },
  { dateStr: '2026-09-09', day: 'Sep 9', weekday: 3, act: 'Saint City 2', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'SEP' },
  { dateStr: '2026-09-16', day: 'Sep 16', weekday: 3, act: 'Isaiah Cunningham', genre: 'Acoustic Set', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'SEP' },
  { dateStr: '2026-09-23', day: 'Sep 23', weekday: 3, act: 'Edwin Linson', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'SEP' },
  { dateStr: '2026-09-30', day: 'Sep 30', weekday: 3, act: 'Jonny Coller', genre: 'Live Music', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'SEP' },
  { dateStr: '2026-10-07', day: 'Oct 7', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'OCT' },
  { dateStr: '2026-10-14', day: 'Oct 14', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'OCT' },
  { dateStr: '2026-10-21', day: 'Oct 21', weekday: 3, act: 'Matt Basler', genre: 'Live Music', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'OCT' },
  { dateStr: '2026-10-28', day: 'Oct 28', weekday: 3, act: 'Logan Allen Chapman', genre: 'Live Performance', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'OCT' },
  { dateStr: '2026-11-04', day: 'Nov 4', weekday: 3, act: 'Isaiah Cunningham', genre: 'Live Music', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'NOV' },
  { dateStr: '2026-12-02', day: 'Dec 2', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, endHour: 20, monthKey: 'DEC' },
]

export type NextShow = {
  show: Show
  target: Date
  isTonight: boolean
  isLive: boolean
}

// Compute the next (or currently-live) show relative to `now`.
export function getNextShow(now: Date, customLineup: Show[] = lineup): NextShow {
  const currentLineup = customLineup.length > 0 ? customLineup : lineup

  const parsedShows = currentLineup
    .map((show) => {
      let start: Date | null = null

      if (show.dateStr) {
        const [year, month, day] = show.dateStr.split('-').map(Number)
        const startH = Math.floor(show.hour)
        const startM = Math.round((show.hour - startH) * 60)
        start = new Date(year, month - 1, day, startH, startM, 0, 0)
      } else {
        // Fallback parsing for day strings like "Jul 29"
        const currentYear = now.getFullYear()
        const parsedMs = Date.parse(`${show.day}, ${currentYear} ${show.hour}:00:00`)
        if (!isNaN(parsedMs)) {
          start = new Date(parsedMs)
        }
      }

      if (!start) return null

      const durationHours = (show.endHour !== undefined && show.endHour > show.hour)
        ? (show.endHour - show.hour)
        : 3

      const end = new Date(start)
      end.setMinutes(start.getMinutes() + Math.round(durationHours * 60))

      return { show, start, end }
    })
    .filter((item): item is { show: Show; start: Date; end: Date } => item !== null)

  // Filter for active/upcoming shows and sort chronologically
  const upcoming = parsedShows
    .filter((item) => now <= item.end)
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  if (upcoming.length > 0) {
    const nextItem = upcoming[0]
    const isTonight = now.toDateString() === nextItem.start.toDateString()
    const isLive = now >= nextItem.start && now <= nextItem.end
    return {
      show: nextItem.show,
      target: nextItem.start,
      isTonight,
      isLive,
    }
  }

  // Fallback if all dates are in the past: return first element in original lineup
  const show = currentLineup[0]
  const target = new Date(now)
  target.setHours(Math.floor(show.hour), Math.round((show.hour - Math.floor(show.hour)) * 60), 0, 0)
  return { show, target, isTonight: false, isLive: false }
}

export function getGoogleCalendarUrl(show: Show): string {
  if (!show.dateStr) return '#'
  const [year, month, day] = show.dateStr.split('-')
  
  const startH = Math.floor(show.hour)
  const startM = Math.round((show.hour - startH) * 60)
  const startHourStr = String(startH).padStart(2, '0')
  const startMinStr = String(startM).padStart(2, '0')

  const calculatedEnd = show.endHour !== undefined ? show.endHour : show.hour + 3
  const endH = Math.floor(calculatedEnd)
  const endM = Math.round((calculatedEnd - endH) * 60)
  const endHourStr = String(endH).padStart(2, '0')
  const endMinStr = String(endM).padStart(2, '0')

  const title = encodeURIComponent(`${show.act} — Live at The Hidden Kitchen`)
  const details = encodeURIComponent(
    `Join us for ${show.act} on The Stage at The Hidden Kitchen!\nLocation: 131 S Division St, Carterville, IL 62918`
  )
  const location = encodeURIComponent('The Hidden Kitchen, 131 S Division St, Carterville, IL 62918')
  const dates = `${year}${month}${day}T${startHourStr}${startMinStr}00Z/${year}${month}${day}T${endHourStr}${endMinStr}00Z`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`
}