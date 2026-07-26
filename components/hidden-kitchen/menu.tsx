'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { X, Search, Utensils, Phone } from 'lucide-react'

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

export function useMenuData() {
  const [panels, setPanels] = useState<Panel[]>(defaultPanels)

  useEffect(() => {
    async function loadCMS() {
      try {
        const res = await fetch('/api/menu?limit=100&sort=sortOrder', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (json.docs && Array.isArray(json.docs) && json.docs.length > 0) {
          const cmsPanels: Panel[] = json.docs.map((doc: any) => ({
            key: doc.key || doc.title.toLowerCase().replace(/\s+/g, '-'),
            title: doc.title || '',
            bannerNote: doc.bannerNote || '',
            items: Array.isArray(doc.items)
              ? doc.items.map((it: any) => ({
                name: it.name || '',
                note: it.note || '',
                price: it.price || undefined,
              }))
              : [],
          }))
          setPanels(cmsPanels)
        }
      } catch {
        // Fallback to defaultPanels
      }
    }
    loadCMS()
  }, [])

  return panels
}

export function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
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
      if (!searchQuery.trim()) {
        return panel
      }
      const q = searchQuery.toLowerCase()
      const matchingItems = panel.items.filter(
        (item) => item.name.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)
      )
      if (matchingItems.length === 0) return null
      return {
        ...panel,
        items: matchingItems,
      }
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
              className="absolute inset-0 h-full w-full object-cover opacity-80 contrast-110 saturate-110 scale-105 pointer-events-none select-none"
            />

            {/* Dynamic Radial Vignette: Darkens center behind headline while leaving top/bottom open */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/80 via-black/40 to-transparent pointer-events-none" />
          </div>
          
          {/* Top & Bottom Vignettes for seamless transitions (placed OUTSIDE sticky) */}
          <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col items-center mx-auto w-full max-w-[100vw]">
          {/* Main Headline Line 1 */}
          <h2 className="text-center text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw] xl:text-[17vw] 2xl:text-[250px] font-black uppercase leading-[0.8] tracking-tighter text-foreground whitespace-nowrap drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
            Eat like
          </h2>

          {/* Line 2 & Links Wrapper */}
          <div className="flex flex-col items-stretch w-max max-w-full">
            <h2 className="text-center text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[18vw] xl:text-[17vw] 2xl:text-[250px] font-black uppercase leading-[0.8] tracking-tighter text-foreground whitespace-nowrap drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
              <span className="gold-shimmer">family.</span>
            </h2>

            {/* Text action links with vertical bar separator */}
            <div className="mt-8 md:mt-12 flex items-center justify-center w-full gap-3 sm:gap-6 md:gap-8 px-4">
              <button
                onClick={() => openWithCategory('all')}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-widest text-neutral-100 transition-all duration-300 hover:text-gold hover:scale-105 whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              >
                View Menu
              </button>

              <span className="text-gold font-light select-none text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]" aria-hidden>
                |
              </span>

              <a
                href="https://www.doordash.com/store/the-hidden-kitchen-carterville-47996853"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-widest text-neutral-100 transition-all duration-300 hover:text-gold hover:scale-105 whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              >
                Order Delivery
              </a>
            </div>
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
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-2xl text-foreground overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 flex flex-col border-b border-gold/20 bg-black/80 backdrop-blur-md px-6 py-4 md:px-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/30">
                    <Utensils className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-foreground">
                      The Hidden Kitchen
                    </h3>
                    <p className="text-xs text-gold/80 uppercase tracking-widest">Full Menu</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-black focus:outline-none"
                  aria-label="Close menu"
                >
                  <span>Close</span>
                  <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Search & Category Navigation Bar */}
              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full rounded-full border border-gold/20 bg-black/60 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeCategory === 'all'
                        ? 'bg-gold text-black shadow-[0_0_15px_rgba(197,163,104,0.4)]'
                        : 'border border-gold/20 bg-black/40 text-foreground/70 hover:border-gold/50 hover:text-foreground'
                      }`}
                  >
                    All Items
                  </button>

                  {panels.map((panel) => (
                    <button
                      key={panel.key}
                      onClick={() => setActiveCategory(panel.key)}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeCategory === panel.key
                          ? 'bg-gold text-black shadow-[0_0_15px_rgba(197,163,104,0.4)]'
                          : 'border border-gold/20 bg-black/40 text-foreground/70 hover:border-gold/50 hover:text-foreground'
                        }`}
                    >
                      {panel.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div
              ref={modalContentRef}
              className="flex-1 overflow-y-auto px-6 py-8 md:px-16 lg:px-24 xl:px-32 scroll-smooth"
            >
              <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-14 pb-16">
                {filteredPanels.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="text-xl text-muted-foreground">No menu items found matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setActiveCategory('all')
                      }}
                      className="mt-4 rounded-full border border-gold/30 px-6 py-2 text-sm text-gold hover:bg-gold/10"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredPanels.map((panel) => (
                    <motion.div
                      key={panel.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-2xl border border-gold/15 bg-black/50 p-6 md:p-10 backdrop-blur-md"
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
                            className="group flex flex-col gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-gold/30 hover:bg-gold/[0.03]"
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
                )}

                <div className="mt-12 rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 via-black to-gold/10 p-8 text-center flex flex-col items-center gap-4">
                  <h5 className="text-xl font-bold uppercase tracking-wider text-white">
                    Ready to Enjoy?
                  </h5>
                  <p className="text-sm text-white/80 font-sans max-w-md">
                    Visit us in person or call ahead for dine-in and takeout options.
                  </p>
                  <a
                    href="tel:+16186814208"
                    className="inline-flex items-center gap-2.5 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call (618) 681-4208</span>
                  </a>
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