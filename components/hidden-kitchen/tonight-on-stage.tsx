'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getNextShow, useLineupData, formatFacebookUrl, type NextShow } from './lineup'
import { ExternalLink } from 'lucide-react'

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0')
}

function formatShowTimeRange(startHour?: number, durationHours = 3) {
  if (startHour === undefined || startHour === null) return '7:00 PM – 10:00 PM'
  const endHour = (startHour + durationHours) % 24

  const formatH = (h: number) => {
    const h12 = h % 12 === 0 ? 12 : h % 12
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${h12}:00 ${ampm}`
  }

  return `${formatH(startHour)} – ${formatH(endHour)}`
}

export function TonightOnStage() {
  const lineupData = useLineupData()
  const [next, setNext] = useState<NextShow | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ns = getNextShow(now, lineupData)
      setNext(ns)
      setRemaining(ns.target.getTime() - now.getTime())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lineupData])

  if (!next) {
    return <div className="h-10 w-full animate-pulse" aria-hidden />
  }

  const actName = next.show.act.trim()
  const isTBA = actName === 'TBA' || actName === 'To Be Announced' || actName === ''

  const totalSeconds = remaining / 1000
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  const countdownStr = days > 0
    ? `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`

  const statusLabel = next.isLive
    ? 'ON STAGE NOW'
    : next.isTonight
      ? 'TONIGHT ON STAGE'
      : `UP NEXT · ${next.show.day}`

  const timeRangeStr = formatShowTimeRange(next.show.hour, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full flex flex-col gap-1 text-xs sm:text-sm py-0.5 select-none"
    >
      {/* LINE 1: Status indicator + Full Performer Name (Full Width) */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 w-full overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.18em]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={next.isLive ? 'absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75' : 'hidden'} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="font-bold text-gold shrink-0">{statusLabel}</span>
        </div>

        <span className="text-gold/40 shrink-0">·</span>

        {/* Performer / Event Name - Full line headroom */}
        <span className="font-bold uppercase tracking-tight text-white hover:text-gold transition-colors text-xs sm:text-sm md:text-base leading-tight truncate">
          {actName}
        </span>
      </div>

      {/* LINE 2: Date & Time range + Countdown ("Takes stage in ...") + RSVP Button */}
      <div className="flex items-center justify-between gap-2.5 w-full border-t border-white/10 pt-1">
        <div className="flex flex-wrap items-center gap-2 font-sans text-[10px] sm:text-xs text-white/90 min-w-0">
          {/* Date and Time Range */}
          <span className="font-bold text-white uppercase tracking-wider shrink-0">
            {next.show.day} · {timeRangeStr}
          </span>

          {!next.isLive && !isTBA && (
            <>
              <span className="text-gold/40 shrink-0">·</span>
              <span className="uppercase tracking-wider text-[9px] sm:text-[10px] text-white/70 shrink-0 font-medium">Takes stage in</span>
              <span className="font-bold text-gold tracking-wider text-xs shrink-0">{countdownStr}</span>
            </>
          )}
        </div>

        {next.show.facebookUrl && (
          <a
            href={formatFacebookUrl(next.show.facebookUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all duration-200 border border-gold/40 bg-gold/10 px-2.5 py-0.5 rounded shrink-0"
          >
            <span>RSVP</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}
