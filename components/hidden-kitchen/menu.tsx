'use client'

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type Item = {
  name: string
  note: string
}

type Panel = {
  key: string
  title: string
  bannerNote?: string
  items: Item[]
}

const panels: Panel[] = [
  {
    key: 'starters',
    title: 'Starters',
    bannerNote: 'Perfect for sharing at the table',
    items: [
      { name: 'Cheese Curds', note: 'Cheese curds fried to golden perfection, served with house ranch' },
      { name: 'Parmesan French Fries', note: 'Garlic parmesan coated crispy french fries' },
      { name: 'Crispy Pork Belly Bites', note: 'Kansas City-style sweet & savory rub, toasted sesame seeds' },
      { name: 'Bone-In Wings', note: 'Fried crispy with choice of BBQ, Parmesan Garlic, or Hot Sauce' },
    ],
  },
  {
    key: 'sandwiches',
    title: 'Sandwiches',
    bannerNote: 'Served alongside choice of French fries (plain or Parmesan), sweet potato fries, or chips',
    items: [
      { name: 'Classic Club Sandwich', note: 'Ham, turkey, bacon, lettuce, tomato, cheddar & Swiss on toasted white' },
      { name: 'Cheeseburger', note: 'Cheddar, bacon, lettuce, onion, tomato, pickle on a toasted bun' },
      { name: 'Patty Melt', note: 'Grilled onions, pub sauce, Swiss & American cheese on toasted rye' },
      { name: 'Grilled Chicken Sandwich', note: 'Toasted bun with chicken, lettuce, tomato, onion & spread of mayo' },
    ],
  },
  {
    key: 'salads',
    title: 'Dinner Salads',
    bannerNote: 'Dressings: Homemade Ranch, Italian, French, Blue Cheese, Honey Mustard, Balsamic Vinaigrette, 1000 Island',
    items: [
      { name: 'Chicken Caesar Salad', note: 'Parmesan, house croutons, Caesar dressing · Fried or Grilled chicken' },
      { name: 'House Salad', note: 'Lettuce, tomatoes, red onion, cheese, croutons · Choice of dressing' },
      { name: 'Chef Salad', note: 'Ham, bacon, cheese, eggs, tomatoes, sweet peppers, croutons' },
    ],
  },
  {
    key: 'pastas',
    title: 'Pastas',
    bannerNote: 'Served with garlic bread & choice of side House or Caesar salad',
    items: [
      { name: 'Spaghetti', note: 'Served with your choice of marinara or rich meat sauce' },
      { name: 'Fettuccine Alfredo', note: 'Creamy Alfredo sauce with grilled chicken served over egg noodles' },
      { name: 'Mushroom Ravioli Portabella', note: 'Mushroom-stuffed ravioli, Alfredo sauce, sautéed tomatoes & portabella mushrooms' },
    ],
  },
  {
    key: 'entrees',
    title: 'Entrees',
    bannerNote: 'Served with House or Caesar salad, plus one extra side of your choice',
    items: [
      { name: 'Blackened Salmon', note: 'Grilled blackened salmon cooked to perfection' },
      { name: 'Chicken Tenders', note: 'Crispy fried tenders · Choice of sauce: Parmesan garlic, honey spicy, hot, ranch, honey mustard, or pub sauce' },
      { name: 'Grilled Chicken Breast', note: 'Seasoned grilled chicken breast cooked to juicy perfection' },
    ],
  },
  {
    key: 'pizza',
    title: '16" Thin Crust Pizza',
    bannerNote: 'Freshly baked 16-inch thin crust pizzas',
    items: [
      { name: 'Deluxe Pizza', note: 'Pepperoni, sausage, onions, green peppers, mushrooms, green olives' },
      { name: 'Meat Lovers Pizza', note: 'Pepperoni, sausage, seasoned beef, Canadian bacon' },
      { name: 'Single Topping 16" Pizza', note: 'Build your own with Beef, Bacon, Sausage, Pepperoni, Veggies & Extra Cheese' },
    ],
  },
  {
    key: 'extras',
    title: 'Sides & Drinks',
    bannerNote: 'Complete your meal with our side options and fountain drinks',
    items: [
      { name: 'Kids Meals', note: 'Choice of Kids Spaghetti (with garlic bread), Kids Chicken Strips (with fries/chips), or Kids Quesadilla (with fries/chips) · Includes drink' },
      { name: 'Sides Selection', note: 'Battered French Fries, Sweet Potato Fries, Baked Potato, Stir Fry, Side House Salad, Side Caesar Salad' },
      { name: 'Fountain Soda & Teas', note: 'Pepsi, Pepsi Zero, Dr Pepper, Dr Pepper Zero, Mtn Dew, Code Red, Lemonade, Root Beer, Orange Crush, 7 Up, Sweet & Unsweet Tea' },
    ],
  },
  {
    key: 'cocktails',
    title: 'Signature Cocktails',
    bannerNote: 'From a classic Old Fashioned to custom twists — our bartenders craft your favorite drink',
    items: [
      { name: 'New Beginnings', note: 'Bright passionfruit, crisp tequila, and a sparkling toast to what’s next' },
      { name: 'Crème Brûlée Whiskey Sour', note: 'Silky whiskey sour finished with a crisp, caramelized sugar crust · Rich & creamy' },
      { name: 'Hot Honey Old Fashioned', note: 'Featuring Southern Illinois’ Sons of Mitches Whiskey, house hot honey syrup & bitters · Sweet, hot, or extra hot' },
      { name: 'Peach Tea Mule', note: 'Vodka, peach liqueur, house-brewed sweet tea & ginger beer · Southern Illinois staple' },
    ],
  },
]

export function Menu() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      setDistance(trackRef.current.scrollWidth - window.innerWidth)
    }
    measure()
    const timer = setTimeout(measure, 300)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.4 })

  // Skew the whole track based on how fast it's sliding sideways
  const xVelocity = useVelocity(x)
  const skew = useSpring(xVelocity, { stiffness: 300, damping: 50, mass: 0.3 })
  const skewX = useTransform(skew, [-2000, 0, 2000], [-4, 0, 4], { clamp: true })

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative z-20 bg-obsidian"
      style={{ height: `${(panels.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* ambient glow */}
        <div
          aria-hidden
          className="absolute right-0 top-1/4 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(214,175,0,0.12),transparent_60%)] blur-3xl"
        />

        <motion.div ref={trackRef} style={{ x, skewX }} className="flex h-full items-center">
          {/* Intro panel */}
          <div className="flex h-full w-screen shrink-0 flex-col justify-center px-6 md:w-[60vw] md:px-16">
            <h2 className="text-balance text-[16vw] font-black uppercase leading-[0.8] tracking-tighter text-foreground md:text-[9vw]">
              Eat like
              <br />
              <span className="gold-shimmer">family.</span>
            </h2>
            <p className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              Starters, 16" thin crust pizzas, pastas, entrees, handcrafted sandwiches & signature cocktails.
              <span className="block mt-3 text-xs uppercase tracking-widest text-gold/60">Scroll horizontally to view categories →</span>
            </p>
          </div>

          {panels.map((panel, i) => (
            <MenuPanel key={panel.key} panel={panel} progress={scrollYProgress} index={i} total={panels.length} />
          ))}

          {/* tail spacer */}
          <div className="h-full w-[8vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  )
}

function MenuPanel({
  panel,
  progress,
  index,
  total,
}: {
  panel: Panel
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const isLast = index === total - 1
  const start = (index / (total + 1)) * 0.9
  const mid = ((index + 0.5) / (total + 1)) * 0.9

  // The last panel stays 100% visible at full opacity (1.0) continuously until scrolling to the next section!
  const opacity = useTransform(
    progress,
    isLast ? [start, mid, 1] : [start, mid, mid + 0.25],
    isLast ? [0.2, 1, 1] : [0.2, 1, 0.5]
  )

  const textY = useTransform(progress, [start, mid], [30, 0])

  return (
    <div className="flex h-full w-screen shrink-0 items-center justify-center px-6 md:w-[70vw] md:px-12">
      <motion.div
        style={{ opacity, y: textY }}
        className="relative flex w-full max-w-3xl flex-col justify-center py-6"
      >
        {/* Category Header */}
        <div className="border-b border-gold/20 pb-4 mb-6">
          <h3 className="text-balance text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {panel.title}
          </h3>

          {panel.bannerNote && (
            <p className="mt-2 text-sm font-medium text-gold/80 md:text-base">
              {panel.bannerNote}
            </p>
          )}
        </div>

        {/* Floating Items List */}
        <div className="flex flex-col gap-5">
          {panel.items.map((item, k) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + k * 0.05, duration: 0.4 }}
              className="group flex flex-col gap-1 border-b border-gold/10 pb-4 last:border-0 last:pb-0"
            >
              <h4 className="font-bold tracking-tight text-foreground text-xl sm:text-2xl transition-colors group-hover:text-gold">
                {item.name}
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                {item.note}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
