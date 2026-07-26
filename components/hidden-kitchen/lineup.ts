import { useEffect, useState } from 'react'

export type Show = {
  day: string
  weekday: number // 0 = Sun ... 6 = Sat
  act: string
  genre: string
  category?: string // 'Live Music' | 'Stand-Up Comedy' | 'Trivia Night' | 'Special Event'
  hour: number // 24h start time
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

function getMonthKey(dayStr: string): string {
  const upper = dayStr.toUpperCase()
  if (upper.includes('JUL')) return 'JUL'
  if (upper.includes('AUG')) return 'AUG'
  if (upper.includes('SEP')) return 'SEP'
  if (upper.includes('OCT')) return 'OCT'
  if (upper.includes('NOV')) return 'NOV'
  if (upper.includes('DEC')) return 'DEC'
  return 'JUL'
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
  { dateStr: '2026-07-22', day: 'Jul 22', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events' },
  { dateStr: '2026-07-29', day: 'Jul 29', weekday: 3, act: 'Taylor Kearney', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events' },
  { dateStr: '2026-08-05', day: 'Aug 5', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'AUG' },
  { dateStr: '2026-08-12', day: 'Aug 12', weekday: 3, act: 'Tim Crosby', genre: 'Singer-Songwriter', category: 'Live Music', hour: 17, monthKey: 'AUG' },
  { dateStr: '2026-08-26', day: 'Aug 26', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'AUG' },
  { dateStr: '2026-09-09', day: 'Sep 9', weekday: 3, act: 'Saint City 2', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'SEP' },
  { dateStr: '2026-09-16', day: 'Sep 16', weekday: 3, act: 'Isaiah Cunningham', genre: 'Acoustic Set', category: 'Live Music', hour: 17, monthKey: 'SEP' },
  { dateStr: '2026-09-23', day: 'Sep 23', weekday: 3, act: 'Edwin Linson', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'SEP' },
  { dateStr: '2026-09-30', day: 'Sep 30', weekday: 3, act: 'Jonny Coller', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'SEP' },
  { dateStr: '2026-10-07', day: 'Oct 7', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'OCT' },
  { dateStr: '2026-10-14', day: 'Oct 14', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, monthKey: 'OCT' },
  { dateStr: '2026-10-21', day: 'Oct 21', weekday: 3, act: 'Matt Basler', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'OCT' },
  { dateStr: '2026-10-28', day: 'Oct 28', weekday: 3, act: 'Logan Allen Chapman', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'OCT' },
  { dateStr: '2026-11-04', day: 'Nov 4', weekday: 3, act: 'Isaiah Cunningham', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'NOV' },
  { dateStr: '2026-12-02', day: 'Dec 2', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'DEC' },
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
        start = new Date(year, month - 1, day, show.hour, 0, 0, 0)
      } else {
        // Fallback parsing for day strings like "Jul 29"
        const currentYear = now.getFullYear()
        const parsedMs = Date.parse(`${show.day}, ${currentYear} ${show.hour}:00:00`)
        if (!isNaN(parsedMs)) {
          start = new Date(parsedMs)
        }
      }

      if (!start) return null

      const end = new Date(start)
      end.setHours(start.getHours() + 3, 0, 0, 0) // 3-hour set

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
  target.setHours(show.hour, 0, 0, 0)
  return { show, target, isTonight: false, isLive: false }
}

export function getGoogleCalendarUrl(show: Show): string {
  if (!show.dateStr) return '#'
  const [year, month, day] = show.dateStr.split('-')
  const startHour = String(show.hour).padStart(2, '0')
  const endHour = String(show.hour + 3).padStart(2, '0')

  const title = encodeURIComponent(`${show.act} — Live at The Hidden Kitchen`)
  const details = encodeURIComponent(
    `Join us for ${show.act} on The Stage at The Hidden Kitchen!\nLocation: 131 S Division St, Carterville, IL 62918`
  )
  const location = encodeURIComponent('The Hidden Kitchen, 131 S Division St, Carterville, IL 62918')
  const dates = `${year}${month}${day}T${startHour}0000Z/${year}${month}${day}T${endHour}0000Z`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`
}