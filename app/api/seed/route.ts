import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { initialMenuPanels, initialLineupShows } from '@/lib/initial-cms-data'

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const url = new URL(request.url)
    const force = url.searchParams.get('force') === 'true'

    let seededMenu = 0
    let seededLineup = 0

    // Seed Menu if empty or force=true
    const menuCount = await payload.count({ collection: 'menu' })
    if (menuCount.totalDocs === 0 || force) {
      if (force && menuCount.totalDocs > 0) {
        await payload.delete({ collection: 'menu', where: { id: { exists: true } } })
      }
      for (const panel of initialMenuPanels) {
        await payload.create({
          collection: 'menu',
          data: panel as any,
        })
        seededMenu++
      }
    }

    // Seed Lineup if empty or force=true
    const lineupCount = await payload.count({ collection: 'lineup' })
    if (lineupCount.totalDocs === 0 || force) {
      if (force && lineupCount.totalDocs > 0) {
        await payload.delete({ collection: 'lineup', where: { id: { exists: true } } })
      }
      for (const show of initialLineupShows) {
        await payload.create({
          collection: 'lineup',
          data: show as any,
        })
        seededLineup++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededMenu} menu categories and ${seededLineup} stage lineup acts into Payload CMS.`,
      menuTotal: (await payload.count({ collection: 'menu' })).totalDocs,
      lineupTotal: (await payload.count({ collection: 'lineup' })).totalDocs,
    })
  } catch (error: any) {
    console.error('[API /seed] Error seeding Payload CMS:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
