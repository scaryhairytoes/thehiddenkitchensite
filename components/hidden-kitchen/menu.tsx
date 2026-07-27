'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { X, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Item = {
  name: string
  note: string
  price?: string
}

type Panel = {
  key: string
  title: string
  bannerNote?: string
  items: Item[]
}

const defaultPanels: Panel[] = [
  {
    key: 'starters',
    title: 'Starters',
    bannerNote: 'Perfect for sharing at the table',
    items: [
      { name: 'Cheese Curds', note: 'Fried cheese curds with ranch sauce' },
      { name: 'Parmesan French Fries', note: 'Garlic parmesan coated french fries' },
      { name: 'Crispy Pork Belly Bites', note: 'Kansas City style sweet and savory rub' },
      { name: 'Bone In Wings', note: 'BBQ, Parmesan Garlic or Hot Sauce' },
    ],
  },
  {
    key: 'salads',
    title: 'Dinner Salads',
    bannerNote: 'Dressings: Homemade Ranch, Italian, French, Blue Cheese, Honey Mustard, Balsamic Vinaigrette, 1000 Island',
    items: [
      { name: 'Chicken Caesar Salad', note: 'Parmesan, croutons, Caesar dressing. Chicken grilled or fried.' },
      { name: 'House Salad', note: 'Lettuce, tomatoes, red onion, cheese croutons, & choice of dressing.' },
      { name: 'Chef Salad', note: 'Ham, bacon, cheese, eggs, tomatoes, sweet peppers, croutons, & choice of dressing.' },
    ],
  },
  {
    key: 'sandwiches',
    title: 'Sandwiches',
    bannerNote: 'Served alongside choice of French fries (plain or Parmesan), sweet potato fries, or chips',
    items: [
      { name: 'Classic Club', note: 'Ham, turkey, bacon, lettuce, tomato, cheddar and swiss on toasted white bread' },
      { name: 'Cheeseburger', note: 'Cheddar, bacon, lettuce, onion, tomato, & pickle' },
      { name: 'Patty Melt', note: 'Grilled onions, pub sauce, swiss, american cheese, & mayo.' },
      { name: 'Grilled Chicken', note: 'Toasted bun with chicken, lettuce, tomato, & onion' },
    ],
  },
  {
    key: 'pastas',
    title: 'Pastas',
    bannerNote: 'Served with garlic bread & choice of side House or Caesar salad',
    items: [
      { name: 'Spaghetti', note: 'Marinara or meat sauce' },
      { name: 'Fettuccine Alfredo', note: 'Creamy alfredo sauce with grilled chicken & noodles' },
      { name: 'Mushroom Ravioli Portobello', note: 'Mushroom stuffed ravioli with alfredo sauce, sauteed tomatoes, & mushrooms' },
    ],
  },
  {
    key: 'entrees',
    title: 'Entrees',
    bannerNote: 'Served with House or Caesar salad, plus one extra side of your choice',
    items: [
      { name: 'Blackened Salmon', note: 'Grilled black salmon' },
      { name: 'Chicken Tenders', note: 'Choice of dipping sauces: Parmesan garlic, Honey spicy, hot, ranch, honey mustard, or pub sauce.' },
      { name: 'Grilled Chicken Breast', note: 'Grilled chicken breast with seasonings' },
    ],
  },
  {
    key: 'kids-meals',
    title: 'Kids Meals',
    items: [
      { name: 'Kids Spaghetti', note: 'Marinara or meat sauce. Garlic bread.' },
      { name: 'Kids Chicken Strips', note: 'Served with fries or chips' },
      { name: 'Kids Quesadilla', note: 'Served with fries or chips' },
    ],
  },
  {
    key: 'sides',
    title: 'Sides',
    items: [
      { name: 'Sides', note: 'Battered French Fries, Sweet Potato Fries, Baked Potato, Stir Fry, Side House Salad, Side Caesar Salad' },
    ],
  },
  {
    key: 'pizza',
    title: 'Pizza',
    bannerNote: 'Specialty 16" Thin Crust | Toppings $1.95 Each',
    items: [
      { name: 'Deluxe', note: 'Pepperoni, sausage, onions, green peppers, mushrooms, & green olives.' },
      { name: 'Meat Lovers', note: 'Pepperoni, sausage, beef, & canadian bacon.' },
      { name: 'Build Your Own', note: 'Toppings Available: Beef, Black Olives, Canadian Bacon, Cheese, Extra Cheese, Extra Sauce, Garlic, Green Olives, Green Peppers, Mushrooms, Onions, Pepperoni, Red Onion, Sausage, & Tomato' },
    ],
  },
  {
    key: 'drinks',
    title: 'Drinks',
    items: [
      { name: 'Fountain Soda', note: 'Pepsi, Pepsi Zero, Dr Pepper, Dr Pepper Zero, Mountain Dew, Mountain Dew Code Red, Lemonade, Root Beer, Orange Crush, 7 Up' },
      { name: 'Sweet or Unsweet Tea', note: '' },
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

export function useMenuData() {
  const [data, setData] = useState<Panel[]>(defaultPanels)

  useEffect(() => {
    async function loadCMS() {
      try {
        const res = await fetch('/api/menu?limit=100', { cache: 'no-store' })
        if (!res.ok) return

        const text = await res.text()
        if (!text || !text.trim()) return

        const json = JSON.parse(text)
        if (json.docs && Array.isArray(json.docs) && json.docs.length > 0) {
          const merged = json.docs.map((cmsPanel: any) => {
            const defaultPanel = defaultPanels.find(p => p.key === cmsPanel.key)
            if (!defaultPanel) return cmsPanel

            return {
              ...cmsPanel,
              items: cmsPanel.items?.map((cmsItem: any) => {
                const defaultItem = defaultPanel.items.find(i => i.name === cmsItem.name)
                return {
                  ...cmsItem,
                  price: cmsItem.price || defaultItem?.price
                }
              }) || []
            }
          })
          setData(merged)
        }
      } catch (err) {
        console.warn('[Menu] CMS fetch failed, using fallback.', err)
      }
    }
    loadCMS()
  }, [])

  return data
}

export function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const modalContentRef = useRef<HTMLDivElement>(null)
  const panels = useMenuData()

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const openWithCategory = (catKey: string) => {
    setActiveCategory(catKey)
    setIsOpen(true)
  }

  const filteredPanels = panels
    .map((panel) => {
      if (activeCategory !== 'all' && panel.key !== activeCategory) {
        return null
      }
      return panel
    })
    .filter((panel): panel is Panel => panel !== null)

  return (
    <>
      <section
        id="menu"
        className="relative z-20 w-full min-h-screen py-16 md:py-24 flex flex-col items-center justify-center bg-black overflow-x-clip px-6 md:px-12"
      >
        {/* ── Background Video System (Edge-to-Edge Bleed) ───── */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
            {/* Full-Viewport Background Video */}
            <video
              src="/videos/the_menu.mp4"
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-90 contrast-105 saturate-105 pointer-events-none select-none"
            />

            {/* Slight dark overlay to improve text legibility */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Dynamic Radial Vignette: Soft darkening behind headline for clarity */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/55 via-black/25 to-transparent pointer-events-none" />
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center mx-auto w-full max-w-[100vw]">
          {/* Main Headline Line 1 */}
          <h2 className="text-center text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw] xl:text-[17vw] 2xl:text-[250px] font-black uppercase leading-[0.8] tracking-tighter text-foreground whitespace-nowrap drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
            Eat like
          </h2>

          {/* Line 2 & Links Wrapper */}
          <h2 className="text-center text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw] xl:text-[17vw] 2xl:text-[250px] font-black uppercase leading-[0.8] tracking-tighter text-foreground whitespace-nowrap drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
            <span className="gold-shimmer pr-2 md:pr-6">family</span>
          </h2>

          {/* Text action links with vertical bar separator */}
          <div className="mt-8 md:mt-12 flex items-center justify-center w-full gap-[20px] flex-wrap px-4">
            <button
              onClick={() => openWithCategory('all')}
              className="font-black uppercase whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] ![background:transparent] border-[1px] border-solid ![border-color:#C6A573] ![font-size:16px] ![letter-spacing:2px] ![color:#FFFFFF] ![padding:12px_32px] transition-all duration-300 hover:![background-color:rgba(198,165,115,0.1)]"
            >
              View Menu
            </button>

            <a
              href="https://www.doordash.com/store/the-hidden-kitchen-carterville-47996853"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black uppercase whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] ![background:transparent] border-[1px] border-solid ![border-color:#C6A573] ![font-size:16px] ![letter-spacing:2px] ![color:#FFFFFF] ![padding:12px_32px] transition-all duration-300 hover:![background-color:rgba(198,165,115,0.1)]"
            >
              Order Delivery
            </a>
          </div>
        </div>
      </section>

      {/* Full Screen Menu Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/90 text-foreground overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 flex flex-col border-b border-gold/20 bg-black/90 px-6 py-4 md:px-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-black border border-gold/30 overflow-hidden">
                    <Image src="/logo_only.svg" alt="The Hidden Kitchen Logo" width={24} height={24} unoptimized className="brightness-0 invert object-contain" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-sans font-medium uppercase tracking-widest text-foreground">
                      The Hidden Kitchen
                    </h3>
                    <p className="text-xs text-gold/80 uppercase tracking-widest">Full Menu</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-2 rounded-none border border-gold/30 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-black focus:outline-none"
                  aria-label="Close menu"
                >
                  <span>Close</span>
                  <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Category Navigation Dropdown */}
              <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-end">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full md:w-64 rounded-none border border-gold/30 bg-black py-2 px-4 text-sm font-semibold uppercase tracking-wider text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23C6A573\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="all">ALL ITEMS</option>
                  {panels.map((panel) => (
                    <option key={panel.key} value={panel.key}>
                      {panel.title.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Body */}
            <div
              ref={modalContentRef}
              className="flex-1 overflow-y-auto px-6 py-8 md:px-16 lg:px-24 xl:px-32 scroll-smooth"
            >
              <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-14 pb-16">
                {filteredPanels.map((panel) => (
                    <motion.div
                      key={panel.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-none border border-gold/15 bg-black/60 p-6 md:p-10"
                    >
                      <div className="border-b border-gold/20 pb-4 mb-6">
                        <h4 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
                          {panel.title}
                        </h4>
                        {panel.bannerNote && (
                          <p className="mt-2 text-sm font-medium text-gold/80">
                            {panel.bannerNote}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {panel.items.map((item, idx) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.3 }}
                            className="group flex flex-col gap-1.5 rounded-none border-b border-white/5 p-4 transition-all duration-300 hover:border-gold/30 hover:bg-[#111]"
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <h5 className="font-bold tracking-tight text-white text-lg md:text-xl transition-colors group-hover:text-gold">
                                {item.name}
                              </h5>
                              {item.price && (
                                <span className="font-sans text-sm font-bold text-gold shrink-0">
                                  {item.price}
                                </span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-white/80 font-sans">
                              {item.note}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                }

                <div className="mt-12 rounded-none border border-gold/20 bg-black/60 p-8 text-center flex flex-col items-center gap-4">
                  <h5 className="text-xl font-bold uppercase tracking-wider text-white">
                    Ready to Enjoy?
                  </h5>
                  <p className="text-sm text-white/80 font-sans max-w-md">
                    Visit us in person, order delivery, or reserve your table online.
                  </p>
                  <div className="flex flex-col md:flex-row w-full justify-center gap-4 mt-2">
                    <a
                      href="tel:+16186814208"
                      className="inline-flex w-full md:w-auto justify-center items-center gap-2.5 rounded-none bg-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call (618) 681-4208</span>
                    </a>
                    <a
                      href="https://www.doordash.com/store/the-hidden-kitchen-carterville-47996853"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full md:w-auto justify-center items-center gap-2.5 rounded-none border border-gold bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
                    >
                      <span>Order Delivery</span>
                    </a>
                    <Link
                      href="/reservations"
                      className="inline-flex w-full md:w-auto justify-center items-center gap-2.5 rounded-none border border-gold bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
                    >
                      <span>Reserve Online</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Menu