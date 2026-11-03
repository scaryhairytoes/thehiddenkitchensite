import { EdgeNav } from '@/components/hidden-kitchen/edge-nav'
import { Hero } from '@/components/hidden-kitchen/hero'
import { Story } from '@/components/hidden-kitchen/story'
import { Menu } from '@/components/hidden-kitchen/menu'
import { Stage } from '@/components/hidden-kitchen/stage'
import { Footer } from '@/components/hidden-kitchen/footer'
import { GrainOverlay } from '@/components/hidden-kitchen/grain-overlay'
import { SectionDivider } from '@/components/hidden-kitchen/section-divider'
import { getBusinessHours } from '@/lib/business-hours'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const hours = await getBusinessHours()

  return (
    <main className="relative bg-black text-foreground" suppressHydrationWarning>
      <GrainOverlay />
      <Hero initialHours={hours} />
      <EdgeNav />
      <SectionDivider />

      <Story />
      <SectionDivider />

      <Menu />
      <SectionDivider />

      <Stage />
      <SectionDivider />

      <Footer initialHours={hours} />
    </main>
  )
}
