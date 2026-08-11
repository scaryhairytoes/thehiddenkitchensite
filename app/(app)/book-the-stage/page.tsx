'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Mic,
  Calendar as CalendarIcon,
  Music,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useLineupData, type Show } from '@/components/hidden-kitchen/lineup'
import { Footer } from '@/components/hidden-kitchen/footer'

// ── Category definitions ──────────────────────────────────────────────────────
type Category = 'live-music' | 'comedy' | 'private-event' | 'community' | ''

const CATEGORIES: {
  value: Exclude<Category, ''>
  label: string
  icon: React.ElementType
  subOptions: string[]
}[] = [
  {
    value: 'live-music',
    label: 'MUSIC',
    icon: Music,
    subOptions: ['Solo / Acoustic', 'Duo / Trio', 'Full Band', 'Other Music'],
  },
  {
    value: 'comedy',
    label: 'COMEDY',
    icon: Mic,
    subOptions: ['Stand-Up Comedy', 'Open Mic Spot', 'Improv / Stage Act', 'Other Comedy'],
  },
  {
    value: 'private-event',
    label: 'PRIVATE EVENTS',
    icon: Users,
    subOptions: ['Birthday / Celebration', 'Corporate Event', 'Private Buyout', 'Other Private Event'],
  },
  {
    value: 'community',
    label: 'COMMUNITY',
    icon: CalendarIcon,
    subOptions: ['Trivia Night', 'Fundraiser / Benefit', 'Pop-Up Market', 'Community Gathering'],
  },
]

// ── Shared style tokens ───────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-[#c5a368]/60 focus:bg-[#c5a368]/5 transition-all duration-200'
const labelCls = 'block text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-2'
const selectCls =
  'w-full rounded-xl border border-white/15 bg-[#0d0d0d] text-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#c5a368]/60 focus:bg-[#c5a368]/5 transition-all duration-200 appearance-none cursor-pointer [&>option]:bg-[#121212] [&>option]:text-white'

// ── Form data shape ───────────────────────────────────────────────────────────
interface FormPayload {
  category: Exclude<Category, ''>
  name: string
  phone: string
  email?: string
  preferredDates: string
  details: string
  subOption?: string
  musicLink?: string
  actType?: string
  setLength?: string
  mediaLink?: string
  guestCount?: string
  cateringNeeds?: string
  expectedDraw?: string
  turnstileToken: string
}

// Helper to format Date to YYYY-MM-DD
function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookTheStagePage() {
  const lineupData = useLineupData()
  const [selectedCategory, setSelectedCategory] = useState<Category>('')
  const [selectedSubOption, setSelectedSubOption] = useState<string>('')
  const [preferredDates, setPreferredDates] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Calendar Picker state
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1)) // Default to July 2026
  const calendarRef = useRef<HTMLDivElement>(null)

  // Map booked dates for quick lookup
  const bookedDatesMap: Record<string, Show> = {}
  lineupData.forEach((show) => {
    if (show.dateStr) {
      bookedDatesMap[show.dateStr] = show
    }
  })

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const g = (name: string) =>
      ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '').trim()

    const payload: FormPayload = {
      category: selectedCategory as Exclude<Category, ''>,
      name: g('name'),
      phone: g('phone'),
      email: g('email') || undefined,
      preferredDates: preferredDates || g('preferredDates'),
      details: g('details'),
      subOption: selectedSubOption || undefined,
      turnstileToken,
    }

    if (selectedCategory === 'live-music') {
      payload.musicLink = g('musicLink')
      payload.actType   = selectedSubOption
      payload.setLength = g('setLength')
    } else if (selectedCategory === 'comedy') {
      payload.mediaLink = g('mediaLink')
      payload.actType   = selectedSubOption
      payload.setLength = g('setLength')
    } else if (selectedCategory === 'private-event') {
      payload.guestCount    = g('guestCount')
      payload.cateringNeeds = g('cateringNeeds')
    } else if (selectedCategory === 'community') {
      payload.expectedDraw = g('expectedDraw')
    }

    try {
      const res = await fetch('/api/submit-stage-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setStatus('success')
        setPreferredDates('')
      } else {
        setErrorMsg(json.error || 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again or email us directly.')
      setStatus('error')
    }
  }

  function handleCategorySelect(val: Exclude<Category, ''>) {
    setSelectedCategory(val)
    setSelectedSubOption('')
    if (status === 'error') { setStatus('idle'); setErrorMsg('') }
  }

  // Calendar rendering helpers
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function handleDateClick(dateStrFormatted: string) {
    if (!preferredDates) {
      setPreferredDates(dateStrFormatted)
    } else if (preferredDates.includes(dateStrFormatted)) {
      // Remove date if clicked again
      const updated = preferredDates
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== dateStrFormatted)
        .join(', ')
      setPreferredDates(updated)
    } else {
      // Append date
      setPreferredDates(`${preferredDates}, ${dateStrFormatted}`)
    }
  }

  const activeCatObj = CATEGORIES.find((c) => c.value === selectedCategory)

  return (
    <div className="min-h-dvh bg-black text-white relative overflow-x-hidden">

      {/* ── Fixed background atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0d0800]" />
        <div className="absolute top-0 left-1/3 h-[700px] w-[700px] rounded-full bg-gold/5 blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gold/4 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(197,163,104,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(197,163,104,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Page shell ── */}
      <div className="relative z-10 flex flex-col min-h-dvh">

        {/* ── Top nav bar ── */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 sm:py-5 border-b border-gold/15">
          <Link
            href="/#stage"
            className="group inline-flex items-center gap-2 text-sm font-sans text-gold/80 hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to The Stage</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.25em] text-gold/60">
            The Hidden Kitchen
          </span>
        </header>

        {/* ── Two-column layout (stacked mobile, side-by-side desktop) ── */}
        <div className="flex-1 flex flex-col lg:flex-row">

          {/* ── LEFT PANEL — Branding & info (sticky on desktop) ── */}
          <aside className="
            flex-shrink-0 w-full lg:w-[42%] xl:w-[38%]
            px-5 sm:px-8 lg:px-12 xl:px-16
            pt-10 sm:pt-14 lg:pt-0
            pb-6 lg:pb-0
            lg:flex lg:flex-col lg:justify-center
            lg:sticky lg:top-0 lg:h-[calc(100dvh-57px)]
            border-b lg:border-b-0 lg:border-r border-gold/15
          ">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              {/* Eyebrow */}
              <div className="flex items-center mb-5 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.25em] text-gold">
                  Perform or Host an Event
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black uppercase leading-[0.82] tracking-tighter
                  text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[5.5vw] xl:text-[5vw] gold-shimmer"
              >
                Book<br />The Stage
              </h1>

              {/* Description without the dash */}
              <p className="mt-5 sm:mt-6 text-base leading-relaxed text-white/90 font-sans max-w-sm">
                Musicians, comedians, and community event hosts fill out this form and our events team will be in touch.
              </p>

            </motion.div>
          </aside>

          {/* ── RIGHT PANEL — The form ── */}
          <main className="
            flex-1 min-w-0
            px-5 sm:px-8 lg:px-10 xl:px-16
            py-8 sm:py-12 lg:py-14
            overflow-y-auto
          ">
            <div className="max-w-xl lg:max-w-2xl mx-auto lg:mx-0">

              <AnimatePresence mode="wait">
                {status === 'success' ? (

                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-gold/30 bg-gold/5 p-8 sm:p-12 text-center"
                  >
                    <div className="flex justify-center mb-5">
                      <span className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-gold/40 bg-gold/10">
                        <CheckCircle className="h-7 w-7 text-gold" />
                      </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Request Sent!</h2>
                    <p className="text-sm text-white/80 font-sans leading-relaxed mb-8 max-w-sm mx-auto">
                      We&apos;ve received your request and our events team has been notified. Expect to hear back within 2–3 business days.
                    </p>
                    <Link
                      href="/#stage"
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to The Stage
                    </Link>
                  </motion.div>

                ) : (

                  /* ── Form ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >

                    {/* Symmetrical & Even Category selector */}
                    <div>
                      <label className={labelCls}>
                        WHAT ARE YOU LOOKING TO DO? <span className="text-red-500/80">*</span>
                      </label>

                      {/* 2x2 Grid of Symmetrical Even Buttons */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {CATEGORIES.map(({ value, label, icon: Icon }) => {
                          const active = selectedCategory === value
                          return (
                            <button
                              key={value}
                              type="button"
                              id={`category-${value}`}
                              onClick={() => handleCategorySelect(value)}
                              className={`group relative flex flex-col items-center justify-center text-center rounded-xl border py-5 px-4 transition-all duration-200 ${
                                active
                                  ? 'border-gold bg-gold/15 shadow-[0_0_20px_rgba(197,163,104,0.2)]'
                                  : 'border-white/15 bg-white/[0.03] hover:border-gold/50 hover:bg-gold/5'
                              }`}
                            >
                              <span className={`mb-2.5 h-10 w-10 rounded-full flex items-center justify-center border transition-all ${
                                active ? 'border-gold/60 bg-gold/25 text-gold' : 'border-white/10 bg-white/5 text-white/70 group-hover:text-gold group-hover:border-gold/30'
                              }`}>
                                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                              </span>
                              <span className={`text-xs sm:text-sm font-black uppercase tracking-wider transition-colors ${active ? 'text-gold' : 'text-white'}`}>
                                {label}
                              </span>
                              {active && (
                                <motion.div
                                  layoutId="category-indicator"
                                  className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-gold"
                                />
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Sub-options selector presented when a category is picked */}
                      <AnimatePresence mode="wait">
                        {activeCatObj && (
                          <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 p-4 rounded-xl border border-gold/30 bg-gold/[0.04]"
                          >
                            <span className="block text-[11px] font-sans font-bold uppercase tracking-wider text-gold/90 mb-3">
                              Select Specific Type / Detail:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {activeCatObj.subOptions.map((sub) => {
                                const isSubActive = selectedSubOption === sub
                                return (
                                  <button
                                    key={sub}
                                    type="button"
                                    onClick={() => setSelectedSubOption(isSubActive ? '' : sub)}
                                    className={`px-4 py-2 rounded-lg border text-xs font-sans font-bold uppercase tracking-wider transition-all duration-150 ${
                                      isSubActive
                                        ? 'border-gold bg-gold text-black shadow-md'
                                        : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-gold/50 hover:text-white'
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gold/15" />

                    {/* Base fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelCls}>
                          Name / Act Name <span className="text-red-500/80">*</span>
                        </label>
                        <input
                          id="name" name="name" type="text" required
                          placeholder="Your name or act name"
                          className={inputCls}
                        />
                      </div>

                      {/* Phone Number Mandatory */}
                      <div>
                        <label htmlFor="phone" className={labelCls}>
                          Phone <span className="text-red-500/80">*</span>
                        </label>
                        <input
                          id="phone" name="phone" type="tel" required
                          placeholder="(555) 000-0000"
                          className={inputCls}
                        />
                      </div>

                      {/* Email Address Optional */}
                      <div>
                        <label htmlFor="email" className={labelCls}>
                          Email <span className="text-gold/60 font-medium">(optional)</span>
                        </label>
                        <input
                          id="email" name="email" type="email"
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Preferred Dates Field with Calendar Popover */}
                    <div className="relative" ref={calendarRef}>
                      <label htmlFor="preferredDates" className={labelCls}>
                        Preferred Dates / Availability <span className="text-red-500/80">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="preferredDates"
                          name="preferredDates"
                          type="text"
                          required
                          value={preferredDates}
                          onChange={(e) => setPreferredDates(e.target.value)}
                          onFocus={() => setShowCalendar(true)}
                          placeholder="Click to pick dates or type availability..."
                          className={`${inputCls} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/70 hover:text-gold p-1 transition-colors"
                          title="Open Calendar"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Interactive Calendar Popover */}
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 z-50 mt-2 p-4 rounded-2xl border border-gold/30 bg-[#0d0d0d] shadow-2xl backdrop-blur-xl"
                          >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gold" />
                                <span className="text-sm font-bold font-sans text-white">
                                  {MONTH_NAMES[month]} {year}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/40 text-white/70 hover:text-gold transition-colors"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/40 text-white/70 hover:text-gold transition-colors"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowCalendar(false)}
                                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-red-500/40 text-white/50 hover:text-red-400 ml-1 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 text-center mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                <span key={d} className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold/80 py-1">
                                  {d}
                                </span>
                              ))}
                            </div>

                            {/* Days grid */}
                            <div className="grid grid-cols-7 gap-1">
                              {/* Empty padding cells for first day of month */}
                              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-9" />
                              ))}

                              {/* Month days */}
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1
                                const currDate = new Date(year, month, dayNum)
                                const dateKey = formatDateKey(currDate)
                                const bookedShow = bookedDatesMap[dateKey]
                                const isBooked = !!bookedShow

                                const monthShort = MONTH_NAMES[month].substring(0, 3)
                                const dateFormatted = `${monthShort} ${dayNum}, ${year}`
                                const isSelected = preferredDates.includes(dateFormatted)

                                return (
                                  <button
                                    key={dayNum}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => handleDateClick(dateFormatted)}
                                    title={isBooked ? `Booked: ${bookedShow.act}` : dateFormatted}
                                    className={`relative h-9 rounded-lg text-xs font-sans font-semibold flex flex-col items-center justify-center transition-all ${
                                      isBooked
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400/50 line-through cursor-not-allowed'
                                        : isSelected
                                        ? 'bg-gold text-black font-bold shadow-md shadow-gold/20'
                                        : 'bg-white/[0.03] hover:bg-gold/20 hover:border-gold/40 border border-white/10 text-white'
                                    }`}
                                  >
                                    <span>{dayNum}</span>
                                    {isBooked && (
                                      <Lock className="h-2.5 w-2.5 text-red-400/80 absolute top-0.5 right-0.5" />
                                    )}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Calendar Legend */}
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-white/70">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-gold" /> Selected
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-red-500/70" /> Booked
                                </span>
                              </div>
                              <span className="text-[10px] text-gold/80 font-medium">Tap dates to toggle</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dynamic conditional fields */}
                    <AnimatePresence>
                      {selectedCategory && (
                        <motion.div
                          key={selectedCategory}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-5 pb-1">

                            {/* Live Music */}
                            {selectedCategory === 'live-music' && (
                              <>
                                <div>
                                  <label htmlFor="musicLink" className={labelCls}>
                                    Music / Media Link <span className="text-red-500/80">*</span>
                                  </label>
                                  <div className="relative">
                                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/50 pointer-events-none" />
                                    <input
                                      id="musicLink" name="musicLink" type="url" required
                                      placeholder="Spotify, SoundCloud, Instagram, or YouTube URL"
                                      className={`${inputCls} pl-9`}
                                    />
                                  </div>
                                  <p className="mt-1.5 text-[11px] font-sans text-white/60">
                                    Link to Spotify, SoundCloud, Instagram, or YouTube
                                  </p>
                                </div>
                                <div>
                                  <label htmlFor="setLength" className={labelCls}>Set Length</label>
                                  <input
                                    id="setLength" name="setLength" type="text"
                                    placeholder="e.g. Two 45-min sets"
                                    className={inputCls}
                                  />
                                </div>
                              </>
                            )}

                            {/* Comedy */}
                            {selectedCategory === 'comedy' && (
                              <>
                                <div>
                                  <label htmlFor="mediaLink" className={labelCls}>
                                    Media Link <span className="text-gold/60 font-medium">(optional)</span>
                                  </label>
                                  <div className="relative">
                                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/50 pointer-events-none" />
                                    <input
                                      id="mediaLink" name="mediaLink" type="url"
                                      placeholder="Link to a clip, reel, or set"
                                      className={`${inputCls} pl-9`}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label htmlFor="setLength" className={labelCls}>Set Length</label>
                                  <input
                                    id="setLength" name="setLength" type="text"
                                    placeholder="e.g. 15-minute spot, 1-hour feature"
                                    className={inputCls}
                                  />
                                </div>
                              </>
                            )}

                            {/* Private Event */}
                            {selectedCategory === 'private-event' && (
                              <>
                                <div>
                                  <label htmlFor="guestCount" className={labelCls}>Guest Count</label>
                                  <select id="guestCount" name="guestCount" className={selectCls}>
                                    <option value="" className="bg-[#121212] text-white">Select estimated guest count…</option>
                                    <option value="Under 25" className="bg-[#121212] text-white">Under 25</option>
                                    <option value="25–50" className="bg-[#121212] text-white">25–50</option>
                                    <option value="50–100+" className="bg-[#121212] text-white">50–100+</option>
                                  </select>
                                </div>
                                <div>
                                  <label htmlFor="cateringNeeds" className={labelCls}>Catering Needs</label>
                                  <select id="cateringNeeds" name="cateringNeeds" className={selectCls}>
                                    <option value="" className="bg-[#121212] text-white">Select catering preference…</option>
                                    <option value="Full Bar + Food" className="bg-[#121212] text-white">Full Bar + Food</option>
                                    <option value="Drinks Only" className="bg-[#121212] text-white">Drinks Only</option>
                                    <option value="Custom Menu" className="bg-[#121212] text-white">Custom Menu</option>
                                  </select>
                                </div>
                              </>
                            )}

                            {/* Community */}
                            {selectedCategory === 'community' && (
                              <div>
                                <label htmlFor="expectedDraw" className={labelCls}>Expected Draw</label>
                                <input
                                  id="expectedDraw" name="expectedDraw" type="text"
                                  placeholder="Estimated attendance or crowd size"
                                  className={inputCls}
                                />
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Details textarea */}
                    <div>
                      <label htmlFor="details" className={labelCls}>
                        Details / Notes <span className="text-red-500/80">*</span>
                      </label>
                      <textarea
                        id="details" name="details" rows={5} required
                        placeholder="Tell us about yourself or the event details…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
                        >
                          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-sans text-red-400">{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Turnstile */}
                    <div>
                      <Turnstile 
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onSuccess={(token) => setTurnstileToken(token)}
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1 pb-4">
                      <button
                        id="stage-submit-btn"
                        type="submit"
                        disabled={!selectedCategory || status === 'submitting' || !turnstileToken}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold/10 disabled:hover:text-gold"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Request
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                      <p className="text-xs font-sans text-white/50">Sent directly to our events team</p>
                    </div>

                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </main>

        </div>
        
        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  )
}
