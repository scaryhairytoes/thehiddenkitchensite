'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getNextShow, type NextShow } from './lineup'

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0')
}

export function TonightOnStage() {
  const [next, setNext] = useState<NextShow | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ns = getNextShow(now)
      setNext(ns)
      setRemaining(ns.target.getTime() - now.getTime())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Avoid hydration mismatch — render fallback until client clock is ready
  if (!next) {
    return <div className="min-h-[80px]" aria-hidden />
  }

  const actName = next.show.act.trim()
  const isTBA = actName === 'TBA' || actName === 'To Be Announced' || actName === ''

  // If schedule is TBA, hide specific day and countdown timer!
  if (isTBA) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 border-t border-gold/15 pt-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold/70" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">
            Live Music · Schedule TBA
          </span>
        </div>

        <p className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
          Lineup Announcement Soon
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;re finalizing our weekly show dates. Check back soon for confirmed artists!
        </p>
      </motion.div>
    )
  }

  // Otherwise (when an actual artist is scheduled), show day and live countdown timer!
  const totalSeconds = remaining / 1000
  const days = totalSeconds / 86400
  const hours = (totalSeconds % 86400) / 3600
  const minutes = (totalSeconds % 3600) / 60
  const seconds = totalSeconds % 60

  const label = next.isLive
    ? 'On stage now'
    : next.isTonight
      ? 'Tonight on stage'
      : `Next up · ${next.show.day}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6 border-t border-gold/15 pt-6"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span
            className={
              next.isLive
                ? 'absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75'
                : 'hidden'
            }
          />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">
          {label}
        </span>
      </div>

      <p className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
        {next.show.act}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{next.show.genre}</p>

      {next.isLive ? (
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold/80">
          The room is loud — come in.
        </p>
      ) : (
        <div className="mt-4 flex items-end gap-3 font-mono tabular-nums">
          {days >= 1 && <TimeUnit value={pad(days)} unit="days" />}
          <TimeUnit value={pad(hours)} unit="hrs" />
          <TimeUnit value={pad(minutes)} unit="min" />
          <TimeUnit value={pad(seconds)} unit="sec" />
        </div>
      )}
    </motion.div>
  )
}

function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black leading-none text-foreground md:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {unit}
      </span>
    </div>
  )
}
