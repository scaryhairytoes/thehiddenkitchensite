'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CalendarDays,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react'

// ── Shared style tokens ───────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-[#c5a368]/60 focus:bg-[#c5a368]/5 transition-all duration-200'
const labelCls = 'block text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-2'

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', 
  '7:00 PM', '7:30 PM', '8:00 PM'
]

export default function ReservationsPage() {
  const [partySize, setPartySize] = useState<number | ''>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const g = (name: string) =>
      ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '').trim()

    const payload = {
      name: g('name'),
      email: g('email'),
      phone: g('phone'),
      date: g('date'),
      time: selectedTime,
      partySize: partySize,
      specialRequests: g('specialRequests'),
    }

    if (!payload.time || !payload.partySize) {
      setErrorMsg('Please select a time and party size.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setStatus('success')
      } else {
        setErrorMsg(json.error || 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again or email us directly.')
      setStatus('error')
    }
  }

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
            href="/#visit"
            className="group inline-flex items-center gap-2 text-sm font-sans text-gold/80 hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.25em] text-gold/60">
            The Hidden Kitchen
          </span>
        </header>

        {/* ── Two-column layout ── */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* ── LEFT PANEL — Branding & info ── */}
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
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold">
                  Table Reservations
                </span>
              </div>
              <h1 className="gold-shimmer text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-4 sm:mb-6 leading-[0.9]">
                Reserve <br /> Your Spot.
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans max-w-[400px]">
                Join us for great food, craft cocktails, and live events. Select your preferred date, time, and party size below to secure a table with us.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-1 font-sans">Important Details</h3>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    Reservations are recommended for weekends and live events. We are open Tuesday - Sunday. For parties of 9 or more, please contact us directly.
                  </p>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* ── RIGHT PANEL — Form ── */}
          <main className="flex-1 px-5 sm:px-8 lg:px-12 xl:px-24 py-10 sm:py-14 lg:py-20 flex flex-col justify-center">
            <div className="max-w-[640px] w-full mx-auto lg:mx-0">
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-gold/20 bg-gold/5"
                  >
                    <CheckCircle className="h-16 w-16 text-gold mb-6" />
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Request Received</h2>
                    <p className="text-sm text-white/80 mb-8 max-w-[320px] font-sans">
                      Thank you! Your reservation request has been sent to our host stand. We will contact you shortly to confirm your booking.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle')
                        setPartySize('')
                        setSelectedTime('')
                      }}
                      className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-colors"
                    >
                      Make another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    
                    {/* 1. Date & Party Size */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="date" className={labelCls}>
                            Date <span className="text-red-500/80">*</span>
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className={inputCls}
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                        <div>
                          <label htmlFor="partySize" className={labelCls}>
                            Party Size <span className="text-red-500/80">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="partySize"
                              name="partySize"
                              required
                              min={1}
                              placeholder="Number of guests"
                              className={inputCls}
                              value={partySize}
                              onChange={(e) => setPartySize(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                            <Users className="absolute right-4 top-3.5 h-4 w-4 text-white/50 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Time Selection */}
                    <div className="space-y-4">
                      <label className={labelCls}>
                        Time <span className="text-red-500/80">*</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-sans font-semibold transition-all duration-200 ${
                              selectedTime === time
                                ? 'border-gold bg-gold/20 text-gold'
                                : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-gold/40 hover:text-white'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Contact Details */}
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className={labelCls}>
                            Full Name <span className="text-red-500/80">*</span>
                          </label>
                          <input type="text" id="name" name="name" required className={inputCls} placeholder="John Doe" />
                        </div>
                        <div>
                          <label htmlFor="phone" className={labelCls}>
                            Phone <span className="text-red-500/80">*</span>
                          </label>
                          <input type="tel" id="phone" name="phone" required className={inputCls} placeholder="(555) 123-4567" />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="email" className={labelCls}>
                            Email Address <span className="text-red-500/80">*</span>
                          </label>
                          <input type="email" id="email" name="email" required className={inputCls} placeholder="john@example.com" />
                        </div>
                      </div>
                    </div>

                    {/* 4. Special Requests */}
                    <div>
                      <label htmlFor="specialRequests" className={labelCls}>
                        Special Requests <span className="text-gold/60 font-medium">(optional)</span>
                      </label>
                      <textarea
                        id="specialRequests" name="specialRequests" rows={3}
                        placeholder="Allergies, anniversaries, high chair needed..."
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

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 pb-4">
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold/10 disabled:hover:text-gold"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Requesting…
                          </>
                        ) : (
                          <>
                            Request Table
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
