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
      // Pause updates if page is hidden to prevent unnecessary re-renders & save battery
      if (typeof document !== 'undefined' && document.hidden) return

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
    return <div className="h-10 w-full animate-pulse bg-white/5 rounded" aria-hidden />
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
      className="flex flex-row items-center whitespace-nowrap text-xs sm:text-sm py-0.5 select-none w-full !justify-center gap-2 sm:gap-4 md:gap-[2vw] !ml-0 px-2 sm:px-4 ![background:transparent] ![background-color:transparent] ![box-shadow:none]"
      style={{ alignItems: 'center' }}
    >
      {/* Status indicator */}
      <div className="flex items-center gap-1.5 shrink-0 font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.18em]">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={next.isLive ? 'absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75' : 'hidden'} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
        <span className="font-bold text-gold shrink-0">{statusLabel}</span>
      </div>

      <span className="text-gold/40 shrink-0">·</span>

      {/* Performer Name */}
      {next.show.socialUrl || next.show.facebookUrl ? (
        <a
          href={formatFacebookUrl(next.show.socialUrl || next.show.facebookUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold uppercase tracking-tight text-white hover:text-gold transition-colors text-[10px] sm:text-sm md:text-base leading-tight whitespace-nowrap flex items-center shrink-0"
          title={`Visit ${actName}'s page`}
        >
          <span>{actName}</span>
          <span style={{ color: '#C6A573', paddingLeft: '4px', fontFamily: 'sans-serif' }}>&#8599;</span>
        </a>
      ) : (
        <span className="font-bold uppercase tracking-tight text-white transition-colors text-[10px] sm:text-sm md:text-base leading-tight whitespace-nowrap shrink-0">
          {actName}
        </span>
      )}

      {/* Date & Time range (HIDDEN) */}
      <span className="!hidden">·</span>
      <span className="!hidden font-bold text-white font-sans text-[10px] sm:text-xs uppercase tracking-wider shrink-0">
        {next.show.day} · {timeRangeStr}
      </span>

      {/* Countdown */}
      {!next.isLive && !isTBA && (
        <>
          <span className="text-gold/40 shrink-0">·</span>
          <div className="flex items-center gap-1.5 shrink-0 font-sans text-[9px] sm:text-[10px] uppercase tracking-wider">
            <span className="text-white/70 font-medium hidden sm:inline">Takes stage in</span>
            <span className="font-bold text-gold text-[10px] sm:text-xs">{countdownStr}</span>
          </div>
        </>
      )}

      {/* RSVP */}
      {next.show.facebookUrl && (
        <>
          <span className="text-gold/40 shrink-0 !hidden">·</span>
          <a
            href={formatFacebookUrl(next.show.facebookUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all duration-200 border border-gold/40 bg-gold/10 px-2 py-0.5 sm:px-2.5 rounded shrink-0"
            style={{ boxSizing: 'border-box' }}
          >
            <span>RSVP</span>
            <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
          </a>
        </>
      )}
    </motion.div>
  )
}

export default TonightOnStage