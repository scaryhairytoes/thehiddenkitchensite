'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Briefcase,
  Coffee,
  ChefHat,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileUp,
  FileText,
  Upload,
} from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Footer } from '@/components/hidden-kitchen/footer'

// ── Position definitions ──────────────────────────────────────────────────────
type PositionCategory = 'Front of House' | 'Back of House' | 'Any' | ''

const POSITIONS: {
  value: Exclude<PositionCategory, ''>
  label: string
  icon: React.ElementType
  roles?: string[]
}[] = [
  { value: 'Front of House', label: 'Front of House',  icon: Coffee,       roles: ['Servers', 'Bartenders', 'Hosts'] },
  { value: 'Back of House',  label: 'Back of House',   icon: ChefHat,      roles: ['Line Cooks', 'Prep Cooks', 'Dishwashers'] },
]

const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Temporary']
const SHIFT_OPTIONS = ['Days', 'Nights', 'Weekends', 'Flexible']

// ── Shared style tokens ───────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 font-sans focus:outline-none focus:border-[#c5a368]/60 focus:bg-[#c5a368]/5 transition-all duration-200'
const labelCls = 'block text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-2'

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<PositionCategory>('')
  const [selectedSubRoles, setSelectedSubRoles] = useState<string[]>([])
  const [employmentType, setEmploymentType] = useState<string>('')
  const [availabilityShifts, setAvailabilityShifts] = useState<string[]>([])
  const [submissionMethod, setSubmissionMethod] = useState<'resume' | 'manual' | ''>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const formData = new FormData(form)

    let finalPositionStr = selectedPosition as string
    if (selectedSubRoles.length > 0) {
      finalPositionStr += ` (${selectedSubRoles.join(', ')})`
    }
    formData.set('position', finalPositionStr)

    const availabilityStr = employmentType
      ? `${employmentType}${availabilityShifts.length > 0 ? ` (${availabilityShifts.join(', ')})` : ''}`
      : ''
    formData.set('availability', availabilityStr)

    formData.set('submissionMethod', submissionMethod)
    if (submissionMethod === 'resume' && resumeFile) {
      formData.set('resume', resumeFile)
    }

    try {
      const res = await fetch('/api/submit-career-application', {
        method: 'POST',
        body: formData,
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

  function handlePositionSelect(val: Exclude<PositionCategory, ''>) {
    if (selectedPosition !== val) {
      setSelectedPosition(val)
      setSelectedSubRoles([])
    }
    if (status === 'error') { setStatus('idle'); setErrorMsg('') }
  }

  function handleSubRoleToggle(role: string) {
    setSelectedSubRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  function handleShiftToggle(shift: string) {
    setAvailabilityShifts(prev =>
      prev.includes(shift) ? prev.filter(s => s !== shift) : [...prev, shift]
    )
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
                  Careers
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black uppercase leading-[0.82] tracking-tighter
                  text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[5.5vw] xl:text-[5vw] gold-shimmer"
              >
                Join<br />Our Family
              </h1>

              {/* Description */}
              <p className="mt-5 sm:mt-6 text-base leading-relaxed text-white/90 font-sans max-w-sm">
                We are always looking for passionate, hospitality-minded individuals to join our growing family. Build a career doing what you love.
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
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Application Received!</h2>
                    <p className="text-sm text-white/80 font-sans leading-relaxed mb-8 max-w-sm mx-auto">
                      Thank you for your interest in joining The Hidden Kitchen. Our team will review your application and be in touch soon.
                    </p>
                    <Link
                      href="/#details"
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to Home
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

                    {/* Position selector */}
                    <div>
                      <label className={labelCls}>
                        Position of Interest <span className="text-red-500/80">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        {POSITIONS.map(({ value, label, icon: Icon, roles }) => {
                          const active = selectedPosition === value
                          return (
                            <div key={value} className={active ? 'col-span-2' : 'col-span-1'}>
                              <button
                                type="button"
                                id={`position-${value.replace(/[^a-zA-Z]/g, '').toLowerCase()}`}
                                onClick={() => handlePositionSelect(value)}
                                className={`w-full group relative text-left rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
                                  active
                                    ? 'border-gold/60 bg-gold/10'
                                    : 'border-white/10 bg-white/[0.03] hover:border-gold/30 hover:bg-gold/5'
                                }`}
                              >
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                  <span className={`mt-0.5 flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center border transition-colors ${
                                    active ? 'border-gold/50 bg-gold/20' : 'border-white/10 bg-white/5'
                                  }`}>
                                    <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors ${active ? 'text-gold' : 'text-white/60'}`} />
                                  </span>
                                  <div className="min-w-0 self-center">
                                    <p className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${active ? 'text-white' : 'text-white/90'}`}>
                                      {label}
                                    </p>
                                  </div>
                                </div>
                                {active && (
                                  <motion.div
                                    layoutId="position-indicator"
                                    className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-gold"
                                  />
                                )}
                              </button>
                              
                              <AnimatePresence>
                                {active && roles && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-3 pb-1 px-1 flex flex-wrap gap-2.5">
                                      {roles.map((role) => (
                                        <label key={role} className="cursor-pointer group inline-flex items-center gap-2">
                                          <div className="relative flex items-center justify-center w-4 h-4 border rounded border-white/20 bg-white/5 group-hover:border-gold/50 transition-colors">
                                            <input
                                              type="checkbox"
                                              className="peer absolute opacity-0 w-0 h-0"
                                              checked={selectedSubRoles.includes(role)}
                                              onChange={() => handleSubRoleToggle(role)}
                                            />
                                            <CheckCircle className={`h-3 w-3 text-gold transition-opacity ${selectedSubRoles.includes(role) ? 'opacity-100' : 'opacity-0'}`} />
                                          </div>
                                          <span className="text-xs font-sans text-white/80 group-hover:text-white transition-colors">
                                            {role}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                        {/* "Any" Option */}
                        <div className={selectedPosition === 'Any' ? 'col-span-2' : 'col-span-1'}>
                          <button
                            type="button"
                            id="position-any"
                            onClick={() => handlePositionSelect('Any')}
                            className={`w-full group relative text-left rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
                              selectedPosition === 'Any'
                                ? 'border-gold/60 bg-gold/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-gold/30 hover:bg-gold/5'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 sm:gap-3">
                              <span className={`mt-0.5 flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center border transition-colors ${
                                selectedPosition === 'Any' ? 'border-gold/50 bg-gold/20' : 'border-white/10 bg-white/5'
                              }`}>
                                <Briefcase className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors ${selectedPosition === 'Any' ? 'text-gold' : 'text-white/60'}`} />
                              </span>
                              <div className="min-w-0 self-center">
                                <p className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${selectedPosition === 'Any' ? 'text-white' : 'text-white/90'}`}>
                                  Any
                                </p>
                              </div>
                            </div>
                            {selectedPosition === 'Any' && (
                              <motion.div
                                layoutId="position-indicator"
                                className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-gold"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gold/15" />

                    {/* Base fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelCls}>
                          Full Name <span className="text-red-500/80">*</span>
                        </label>
                        <input
                          id="name" name="name" type="text" required
                          placeholder="Jane Doe"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelCls}>
                          Email <span className="text-red-500/80">*</span>
                        </label>
                        <input
                          id="email" name="email" type="email" required
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
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
                    </div>

                    {/* Availability */}
                    <div>
                      <label className={labelCls}>
                        Availability <span className="text-red-500/80">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {EMPLOYMENT_TYPES.map(type => {
                          const active = employmentType === type
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setEmploymentType(type)
                                if (status === 'error') { setStatus('idle'); setErrorMsg('') }
                              }}
                              className={`text-center rounded-xl border p-3 transition-all duration-200 ${
                                active
                                  ? 'border-gold/60 bg-gold/10 text-white font-bold'
                                  : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-gold/30 hover:bg-gold/5 hover:text-white'
                              }`}
                            >
                              <span className="text-xs sm:text-sm font-bold font-sans">{type}</span>
                            </button>
                          )
                        })}
                      </div>
                      
                      <AnimatePresence>
                        {employmentType && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 flex flex-wrap gap-3">
                              {SHIFT_OPTIONS.map((shift) => (
                                <label key={shift} className="cursor-pointer group inline-flex items-center gap-2">
                                  <div className="relative flex items-center justify-center w-4 h-4 border rounded border-white/20 bg-white/5 group-hover:border-gold/50 transition-colors">
                                    <input
                                      type="checkbox"
                                      className="peer absolute opacity-0 w-0 h-0"
                                      checked={availabilityShifts.includes(shift)}
                                      onChange={() => handleShiftToggle(shift)}
                                    />
                                    <CheckCircle className={`h-3 w-3 text-gold transition-opacity ${availabilityShifts.includes(shift) ? 'opacity-100' : 'opacity-0'}`} />
                                  </div>
                                  <span className="text-xs font-sans text-white/80 group-hover:text-white transition-colors">
                                    {shift}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Hidden input for HTML validation to require selection */}
                      <input type="text" name="availability" required className="absolute opacity-0 w-0 h-0 pointer-events-none" value={employmentType} onChange={() => {}} tabIndex={-1} />
                    </div>

                    {/* Available Start Date */}
                    <div>
                      <label htmlFor="startDate" className={labelCls}>
                        Available Start Date <span className="text-red-500/80">*</span>
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="text"
                        required
                        placeholder="e.g. Immediately, As soon as possible, or MM/DD/YYYY"
                        className={inputCls}
                      />
                    </div>

                    {/* Experience Section */}
                    <div className="space-y-4">
                      <label className={labelCls}>
                        Experience <span className="text-red-500/80">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSubmissionMethod('resume')
                            if (status === 'error') { setStatus('idle'); setErrorMsg('') }
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 transition-all duration-200 ${
                            submissionMethod === 'resume'
                              ? 'border-gold/60 bg-gold/10 text-white font-bold'
                              : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-gold/30 hover:bg-gold/5 hover:text-white'
                          }`}
                        >
                          <FileUp className="h-4 w-4 text-gold" />
                          <span className="text-xs sm:text-sm font-bold font-sans">Upload Resume</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmissionMethod('manual')
                            if (status === 'error') { setStatus('idle'); setErrorMsg('') }
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 transition-all duration-200 ${
                            submissionMethod === 'manual'
                              ? 'border-gold/60 bg-gold/10 text-white font-bold'
                              : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-gold/30 hover:bg-gold/5 hover:text-white'
                          }`}
                        >
                          <FileText className="h-4 w-4 text-gold" />
                          <span className="text-xs sm:text-sm font-bold font-sans">Fill Manually</span>
                        </button>
                      </div>
                      
                      {/* Hidden input for HTML validation to require selection */}
                      <input type="text" name="submissionMethod" required className="absolute opacity-0 w-0 h-0 pointer-events-none" value={submissionMethod} onChange={() => {}} tabIndex={-1} />

                      <AnimatePresence mode="wait">
                        {submissionMethod === 'resume' && (
                          <motion.div
                            key="resume-upload"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2">
                              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:border-gold/40 hover:bg-gold/5 transition-all duration-200">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                  <Upload className={`h-6 w-6 mb-2 ${resumeFile ? 'text-gold' : 'text-white/50'}`} />
                                  {resumeFile ? (
                                    <>
                                      <p className="text-sm font-bold text-white mb-1 truncate max-w-full font-sans">{resumeFile.name}</p>
                                      <p className="text-xs text-gold/80 font-sans">Click to change file</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm font-bold text-white/90 mb-1 font-sans">Click to upload your resume</p>
                                      <p className="text-xs text-white/50 font-sans">PDF, DOC, DOCX</p>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                />
                              </label>
                              {/* Hidden input to enforce required on form submission if resume method selected */}
                              <input type="file" required={submissionMethod === 'resume' && !resumeFile} className="absolute opacity-0 w-0 h-0 pointer-events-none" tabIndex={-1} />
                            </div>
                          </motion.div>
                        )}
                        
                        {submissionMethod === 'manual' && (
                          <motion.div
                            key="manual-entry"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 space-y-6">
                              {[1, 2, 3].map((num) => (
                                <div key={num} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                                  <p className="text-xs font-bold uppercase tracking-wider text-gold font-sans">Job {num} {num === 1 ? '(Most Recent)' : ''}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label htmlFor={`job${num}[company]`} className="block text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1.5">Company {num === 1 && <span className="text-red-500/80">*</span>}</label>
                                      <input type="text" id={`job${num}[company]`} name={`job${num}[company]`} required={num === 1} className={inputCls} placeholder="Company Name" />
                                    </div>
                                    <div>
                                      <label htmlFor={`job${num}[title]`} className="block text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1.5">Title {num === 1 && <span className="text-red-500/80">*</span>}</label>
                                      <input type="text" id={`job${num}[title]`} name={`job${num}[title]`} required={num === 1} className={inputCls} placeholder="Job Title" />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label htmlFor={`job${num}[dates]`} className="block text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1.5">Dates {num === 1 && <span className="text-red-500/80">*</span>}</label>
                                      <input type="text" id={`job${num}[dates]`} name={`job${num}[dates]`} required={num === 1} className={inputCls} placeholder="e.g. Jan 2020 - Present" />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label htmlFor={`job${num}[responsibilities]`} className="block text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1.5">Responsibilities</label>
                                      <textarea id={`job${num}[responsibilities]`} name={`job${num}[responsibilities]`} rows={2} className={`${inputCls} resize-none`} placeholder="Briefly describe your duties..." />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gold font-sans">Education</p>
                                <div>
                                  <label htmlFor="education" className="block text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1.5">School / Degree</label>
                                  <textarea id="education" name="education" rows={2} className={`${inputCls} resize-none`} placeholder="Where did you go to school? What did you study?" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message textarea */}
                    <div>
                      <label htmlFor="message" className={labelCls}>
                        Why do you want to join our family? <span className="text-red-500/80">*</span>
                      </label>
                      <textarea
                        id="message" name="message" rows={5} required
                        placeholder="Tell us a little bit about yourself and why you'd be a great fit..."
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
                        id="career-submit-btn"
                        type="submit"
                        disabled={!selectedPosition || status === 'submitting' || !turnstileToken}
                        className="group inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold/10 disabled:hover:text-gold"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Submit Application
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
        
        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  )
}
