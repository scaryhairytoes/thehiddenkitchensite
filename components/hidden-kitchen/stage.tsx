'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useLineupData, formatFacebookUrl, getGoogleCalendarUrl, formatShowTimeRange } from './lineup'
import { ArrowRight, ChevronDown } from 'lucide-react'

const MONTHS: { key: string; label: string }[] = [
  { key: 'JAN', label: 'January' },
  { key: 'FEB', label: 'February' },
  { key: 'MAR', label: 'March' },
  { key: 'APR', label: 'April' },
  { key: 'MAY', label: 'May' },
  { key: 'JUN', label: 'June' },
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
  const [activeMonth, setActiveMonth] = useState<string>(() => {
    const curIdx = new Date().getMonth()
    return MONTHS[curIdx]?.key || 'AUG'
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const lineupData = useLineupData()

  // Auto-switch active month on mount/lineup load based on current date
  useEffect(() => {
    const today = new Date()
    const currentMonthKey = MONTHS[today.getMonth()]?.key
    const todayStr = today.toISOString().split('T')[0]

    // Check if there are upcoming shows in the current month
    const hasCurrentMonthShows = lineupData.some((show) => {
      if (!show.dateStr) return false
      return show.dateStr >= todayStr && show.monthKey === currentMonthKey
    })

    if (hasCurrentMonthShows && currentMonthKey) {
      setActiveMonth(currentMonthKey)
    } else {
      // Find the first upcoming show month if current month has no upcoming shows
      const upcomingShows = lineupData
        .filter((show) => show.dateStr && show.dateStr >= todayStr)
        .sort((a, b) => (a.dateStr! > b.dateStr! ? 1 : -1))

      if (upcomingShows.length > 0 && upcomingShows[0].monthKey) {
        setActiveMonth(upcomingShows[0].monthKey)
      } else if (currentMonthKey) {
        setActiveMonth(currentMonthKey)
      }
    }
  }, [lineupData])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.month-dropdown')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Dynamic Past-Event Filtering
  const futureLineup = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const filtered = lineupData.filter((show) => {
      if (!show.dateStr) return true
      return show.dateStr >= today
    })
    return filtered.sort((a, b) => {
      if (!a.dateStr || !b.dateStr) return 0
      return a.dateStr.localeCompare(b.dateStr)
    })
  }, [lineupData])

  const filteredLineup = futureLineup.filter((show) => show.monthKey === activeMonth)
  const activeMonthLabel = MONTHS.find((m) => m.key === activeMonth)?.label.toUpperCase() || 'AUGUST'

  return (
    <section
      id="stage"
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-start pt-24 md:pt-32 pb-24 px-[20px] md:px-[6vw] bg-black"
    >
      {/* ── Background Video ───── */}
      <video
        src="/videos/matt_basler.mp4"
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
        className="absolute inset-0 w-full h-full object-cover object-[75%_30%] z-0 contrast-[1.05] pointer-events-none select-none"
      />

      {/* ── Background Scrim for Text Readability ───── */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-3/5 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0,0,0,0) 100%)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-full z-10 pointer-events-none md:hidden"
        style={{ background: 'linear-gradient(to left, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0,0,0,0) 100%)' }}
      />

      {/* ── Breakout Header ───── */}
      <div className="relative z-20 w-screen left-[calc(-50vw+50%)] overflow-hidden pb-12 md:pb-20 pointer-events-none select-none">
        <h2 className="font-black text-white opacity-[0.85] mix-blend-overlay tracking-tighter uppercase m-0 text-[18vw] leading-[0.8] whitespace-nowrap pl-[4vw] md:pl-[6vw]">
          THE <span className="gold-shimmer">STAGE</span>
        </h2>
      </div>

      {/* ── Main Content ───── */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-start h-full border-l border-[#C6A573]/40 pl-[2.5vw]">

        {/* Intro Paragraph */}
        <div className="w-full max-w-md lg:pt-12 !mb-[40px]">
          <p className="text-gray-300 text-base md:text-lg leading-relaxed font-sans m-0">
            From live music and stand up comedy to trivia nights, The Stage is our spotlight for whatever is happening. Everyone is welcome. Step inside and take the break you deserve.
          </p>
        </div>

        {/* Single Column Layout */}
        <div className="w-full flex flex-col items-start ![max-width:650px]">

          {/* Schedule */}
          <div
            className="w-full max-w-4xl flex flex-col items-start text-left !mb-[40px]"
          >
            <div className="![display:flex] ![align-items:center] ![flex-direction:row] gap-[15px] w-full !max-w-none mb-1 pb-3 border-b ![border-color:rgba(198,165,115,0.25)] !mt-[50px]">
              <h3 className="![font-size:14px] ![letter-spacing:3px] !uppercase ![color:rgba(255,255,255,0.7)] font-bold m-0">Schedule</h3>

              {/* Month Selector */}
              <div className="relative month-dropdown inline-block z-40 text-left">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[#C6A573] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                >
                  <span>{activeMonthLabel}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-black/95 border border-[#C6A573]/40 shadow-2xl py-2 flex flex-col z-50 rounded-none backdrop-blur-md"
                    >
                      {MONTHS.map((m) => {
                        return (
                          <button
                            key={m.key}
                            onClick={() => {
                              setActiveMonth(m.key)
                              setIsDropdownOpen(false)
                            }}
                            className={`text-left px-5 py-3 font-sans text-xs uppercase tracking-widest transition-colors ${activeMonth === m.key
                              ? 'text-[#C6A573] font-black bg-white/5'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                              }`}
                          >
                            {m.label.toUpperCase()}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMonth}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col lg:max-h-[60vh] overflow-y-auto no-scrollbar items-start w-full"
                >
                  {filteredLineup.length === 0 ? (
                    <div className="py-12 w-full text-center text-white/50 font-sans text-sm uppercase tracking-widest border border-white/10 rounded-none bg-white/5">
                      No upcoming events scheduled for {MONTHS.find(m => m.key === activeMonth)?.label}.
                    </div>
                  ) : (
                    filteredLineup.map((show, i) => {
                      const fbUrl = show.facebookUrl ? formatFacebookUrl(show.facebookUrl) : undefined
                      const actSocialUrl = show.socialUrl ? formatFacebookUrl(show.socialUrl) : fbUrl
                      const calUrl = getGoogleCalendarUrl(show)
                      const dayNumber = show.day.replace(/\D/g, '')
                      const monthLabel = MONTHS.find(m => m.key === activeMonth)?.label.toUpperCase()

                      return (
                        <div
                          key={show.dateStr || show.day + i}
                          className="group ![display:flex] ![align-items:center] ![justify-content:space-between] flex-row gap-4 sm:gap-8 border-b border-white/10 py-4 hover:border-[#C6A573]/50 transition-colors duration-300 w-full !mb-[0px]"
                        >
                          {/* Date Badge */}
                          <div className="flex flex-col items-center justify-center min-w-[3rem] md:min-w-[4rem] text-[#C6A573]">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none mb-1">{monthLabel}</span>
                            <span className="text-4xl md:text-5xl font-black leading-none">{dayNumber}</span>
                          </div>

                          {/* Details */}
                          <div className="flex flex-col items-start text-left ![flex:1_1_0%] ![min-width:0] pr-[15px]">
                            {actSocialUrl ? (
                              <a
                                href={actSocialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block max-w-full"
                                title={`Visit ${show.act}'s social page`}
                              >
                                <h3 className="font-black text-white uppercase tracking-tight group-hover:text-[#C6A573] transition-colors m-0 ![font-size:clamp(16px,4vw,24px)] ![white-space:normal] ![overflow-wrap:break-word] ![line-height:1.1]">
                                  {show.act}
                                </h3>
                              </a>
                            ) : (
                              <h3 className="font-black text-white uppercase tracking-tight m-0 ![font-size:clamp(16px,4vw,24px)] ![white-space:normal] ![overflow-wrap:break-word] ![line-height:1.1]">
                                {show.act}
                              </h3>
                            )}

                            <div className="!text-[#FFFFFF] !font-medium text-[10px] md:text-xs font-sans uppercase tracking-widest !flex !flex-wrap !items-center !gap-[6px] !mt-[5px]">
                              <span className="text-[#C6A573] font-bold">{show.category || 'LIVE MUSIC'}</span>
                              <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
                              <span>{WEEKDAYS[show.weekday].toUpperCase()} {formatShowTimeRange(show.hour, show.endHour, show.timeStr)}</span>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-row items-center justify-end gap-3 md:gap-5 font-sans ![flex-shrink:0] ![background-color:rgba(15,10,5,0.45)] hover:![background-color:rgba(15,10,5,0.9)] ![backdrop-filter:blur(6px)] ![padding:6px_14px] ![border-radius:6px] transition-colors duration-300">
                            <a
                              href={calUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] md:text-xs ![font-weight:600] ![color:#FFFFFF] uppercase tracking-widest transition-colors flex items-center gap-1 hover:opacity-80 ![white-space:nowrap]"
                              title="Add to Google Calendar"
                            >
                              <span className="text-xs md:text-sm leading-none">+</span>
                              <span>Calendar</span>
                            </a>

                            <div className="w-[1px] h-3 bg-white/20" />

                            <a
                              href={fbUrl || '#stage'}
                              target={fbUrl ? "_blank" : undefined}
                              rel={fbUrl ? "noopener noreferrer" : undefined}
                              className="text-[10px] md:text-xs ![font-weight:600] ![color:#C6A573] uppercase tracking-widest transition-colors flex items-center gap-1 hover:brightness-125 ![white-space:nowrap]"
                              title="RSVP"
                            >
                              <span>RSVP</span>
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )
                    })
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Perform or Host */}
          <div className="w-full flex flex-col items-start lg:sticky lg:top-32">
            <div className="w-full !max-w-none pb-3 border-b ![border-color:rgba(198,165,115,0.25)] mb-6 !mt-[30px]">
              <h3 className="![font-size:14px] ![letter-spacing:3px] !uppercase ![color:rgba(255,255,255,0.7)] font-bold m-0">
                Perform or Host
              </h3>
            </div>
            <Link
              href="/book-the-stage"
              className="group inline-flex items-center gap-3 border border-[#C6A573] text-[#C6A573] hover:bg-[#C6A573] hover:text-black font-black text-xs uppercase px-8 py-4 rounded-none transition-all duration-300 shadow-[0_0_0_0_rgba(198,165,115,0)] hover:shadow-[0_0_20px_rgba(198,165,115,0.4)]"
            >
              <span className="tracking-widest">SUBMIT BOOKING REQUEST</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>


      </div>

    </section>
  )
}

export default Stage