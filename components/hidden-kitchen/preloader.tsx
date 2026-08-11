'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

let initialLoadDone = false

export function Preloader() {
  const [alreadyLoaded] = useState(() => initialLoadDone)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (alreadyLoaded) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Hold the gold screen for 2s, then dismiss
    const timer = setTimeout(() => {
      initialLoadDone = true
      setDone(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = original
    }
  }, [alreadyLoaded])

  if (alreadyLoaded) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {!done && (
        <motion.div
          key="preloader"
          suppressHydrationWarning
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-gold"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-balance text-[13vw] font-black uppercase leading-[0.85] tracking-tighter text-black sm:text-[10vw] md:text-[7vw] lg:text-[5.5vw] text-center px-6"
          >
            Glad you&apos;re
            <br />
            <span className="text-black/50">here.</span>
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
