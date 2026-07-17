'use client'

import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** max degrees of skew at peak scroll velocity */
  intensity?: number
}

/**
 * Skews its children based on scroll velocity, then springs back to rest.
 * Reads scrollY position velocity, so it responds to wheel, trackpad and touch.
 */
export function VelocitySkew({ children, className, intensity = 4 }: Props) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, {
    stiffness: 300,
    damping: 50,
    mass: 0.3,
  })
  const skewY = useTransform(smooth, [-2500, 0, 2500], [intensity, 0, -intensity], {
    clamp: true,
  })

  return (
    <motion.div style={{ skewY }} className={className}>
      {children}
    </motion.div>
  )
}

/** Variant driven by an external motion value (e.g. the menu's horizontal x). */
export function VelocitySkewX({
  source,
  children,
  className,
  intensity = 5,
}: {
  source: MotionValue<number>
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const velocity = useVelocity(source)
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50, mass: 0.3 })
  const skewX = useTransform(smooth, [-1500, 0, 1500], [-intensity, 0, intensity], {
    clamp: true,
  })

  return (
    <motion.div style={{ skewX }} className={className}>
      {children}
    </motion.div>
  )
}
