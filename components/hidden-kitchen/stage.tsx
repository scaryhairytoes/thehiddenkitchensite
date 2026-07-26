'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { lineup, useLineupData, formatFacebookUrl, getGoogleCalendarUrl, type Show } from './lineup'
import { VelocitySkew } from './velocity-skew'
import { Calendar, ExternalLink, Mic, ArrowRight } from 'lucide-react'

const MONTHS: { key: string; label: string }[] = [
  { key: 'JUL', label: 'July' },
  { key: 'AUG', label: 'August' },
  { key: 'SEP', label: 'September' },
  { key: 'OCT', label: 'October' },
  { key: 'NOV', label: 'November' },
  { key: 'DEC', label: 'December' },
]

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function Stage() {
  const ref = useRef<HTMLElement>(null)
  const [activeMonth, setActiveMonth] = useState<string>('JUL')
  const lineupData = useLineupData()

  const filteredLineup = lineupData.filter((show) => show.monthKey === activeMonth)

  return (
    <section
      id="stage"
      ref={ref}
      className="relative z-30 w-full min-h-screen flex flex-col justify-center bg-black py-16 md:py-20 lg:py-24 overflow-x-clip"
    >
      {/* ── Background Video System (Edge-to-Edge Bleed) ───── */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
          {/* Full-Viewport Stage Background Video */}
          <video
            src="/videos/matt_basler.mp4"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              // Gracefully hide video element if asset fails or network fails
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 h-full w-full object-cover object-[center_28%] opacity-80 contrast-110 saturate-110 scale-105 pointer-events-none select-none"
          />

          {/* Dynamic Radial Vignette: Darkens center behind layout text while keeping top/bottom open */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/80 via-black/45 to-transparent pointer-events-none" />

          {/* Continuous Full-Width Horizontal Fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Top & Bottom Vignettes for seamless transitions (placed OUTSIDE sticky so they scroll with the section boundary) */}
        <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] xl:max-w-screen-2xl px-6 md:px-16 xl:px-24 w-full flex-1 flex flex-col justify-center">

        {/* Header: "THE STAGE" */}
        <div className="w-full mb-6 md:mb-8 pb-2 flex justify-center text-center overflow-hidden drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
          <VelocitySkew intensity={8}>
            <h2 className="text-[17vw] sm:text-[16.5vw] md:text-[16vw] lg:text-[15.5vw] xl:text-[15vw] font-black uppercase leading-none tracking-tighter whitespace-nowrap overflow-visible">
              <span className="text-foreground">THE </span>
              <span className="gold-shimmer">STAGE</span>
            </h2>
          </VelocitySkew>
        </div>

        {/* Grid: Left (Narrative + Talent CTA) & Right (Month Strip + Show List) */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">

          {/* Left Column: Narrative & Booking Callout */}
          <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-24 space-y-8">

            <div className="border-l-2 border-gold/70 pl-5 sm:pl-6 py-0.5 space-y-2 bg-black/40 backdrop-blur-sm rounded-r-xl p-4">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold block">
                SPOTLIGHT & COMMUNITY
              </span>
              <p className="text-pretty text-base leading-relaxed text-white/95 md:text-lg xl:text-xl font-sans drop-shadow-md">
                From live music and stand up comedy to trivia nights and special community gatherings, <strong className="text-white font-black">The Stage</strong> is our spotlight for whatever is happening. No cover charge required and everyone is welcome. Walk on in, grab a bite or a drink, and soak in the atmosphere. You are right where you need to be, so step inside and take the break you deserve.
              </p>
            </div>

            <div className="pt-6 space-y-4 bg-black/50 backdrop-blur-md border border-gold/20 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-gold font-sans text-xs font-bold uppercase tracking-[0.2em]">
                <Mic className="h-4 w-4" />
                <span>Perform or Host an Event</span>
              </div>

              <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed">
                Musicians, comedians, and community event hosts, we are always looking for great talent to light up The Stage.
              </p>

              <Link
                href="/book-the-stage"
                className="group/btn inline-flex items-center justify-between w-full bg-gold px-6 py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all duration-200 hover:bg-white font-sans shadow-[0_4px_20px_rgba(214,175,0,0.3)] hover:scale-[1.02]"
              >
                <span>Submit Booking Request</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>

          </div>

          {/* Right Column: Month Selector & Show List */}
          <div className="col-span-1 lg:col-span-7 pt-4 lg:pt-0">

            <div className="no-scrollbar flex items-center gap-6 overflow-x-auto pb-4 mb-8">
              {MONTHS.map((m) => {
                const count = lineup.filter((s) => s.monthKey === m.key).length
                const isActive = activeMonth === m.key

                return (
                  <button
                    key={m.key}
                    onClick={() => setActiveMonth(m.key)}
                    className={`relative pb-3 font-sans text-xs uppercase tracking-widest transition-colors duration-200 shrink-0 ${isActive
                        ? 'text-gold font-bold drop-shadow-[0_2px_8px_rgba(214,175,0,0.5)]'
                        : 'text-white/80 hover:text-white'
                      }`}
                  >
                    <span>{m.label} ({count})</span>
                    {isActive && (
                      <motion.div
                        layoutId="month-hipster-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMonth}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 min-h-[300px]"
              >
                {filteredLineup.length === 0 ? (
                  <div className="py-20 text-center text-white/80 font-sans text-sm bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
                    No events currently scheduled for {MONTHS.find(m => m.key === activeMonth)?.label}.
                  </div>
                ) : (
                  filteredLineup.map((show, i) => {
                    const fbUrl = show.facebookUrl ? formatFacebookUrl(show.facebookUrl) : undefined
                    const actSocialUrl = show.socialUrl ? formatFacebookUrl(show.socialUrl) : fbUrl
                    const calUrl = getGoogleCalendarUrl(show)

                    return (
                      <div
                        key={show.dateStr || show.day + i}
                        className="group relative p-5 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md transition-all duration-300 hover:border-gold/40 hover:bg-black/70 hover:translate-x-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold">
                              {MONTHS.find(m => m.key === activeMonth)?.label.toUpperCase()} {show.day.replace(/\D/g, '')} · {WEEKDAYS[show.weekday].toUpperCase()}
                            </span>
                            <span className="text-white/20">|</span>
                            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-white/80">
                              {show.category || 'LIVE MUSIC'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={calUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-sans font-semibold text-white/90 hover:text-gold hover:border-gold border border-white/20 bg-black/80 px-3 py-1.5 transition-colors flex items-center gap-1.5 rounded-md"
                              title="Add to Google Calendar"
                            >
                              <Calendar className="h-3.5 w-3.5 text-gold" />
                              <span className="hidden sm:inline">+ Calendar</span>
                            </a>

                            {fbUrl && (
                              <a
                                href={fbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-sans font-bold text-gold border border-gold/40 bg-black/80 hover:bg-gold hover:text-black px-3.5 py-1.5 transition-all flex items-center gap-1.5 rounded-md"
                                title="RSVP on Facebook Event"
                              >
                                <span>RSVP</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="overflow-hidden w-full my-1">
                          {actSocialUrl ? (
                            <a
                              href={actSocialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/title flex items-center gap-2 max-w-full overflow-hidden"
                              title={`Visit ${show.act}'s social / web page`}
                            >
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white group-hover/title:text-gold transition-colors leading-none whitespace-nowrap truncate drop-shadow-md">
                                {show.act}
                              </h3>
                              <span className="text-gold opacity-0 group-hover/title:opacity-100 transition-opacity text-lg shrink-0">↗</span>
                            </a>
                          ) : (
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-none whitespace-nowrap truncate drop-shadow-md">
                              {show.act}
                            </h3>
                          )}
                        </div>

                        <div className="mt-2 text-xs font-sans text-white/70">
                          Set Time: 5:00 PM to 8:00 PM
                        </div>
                      </div>
                    )
                  })
                )}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  )
}

export default Stage