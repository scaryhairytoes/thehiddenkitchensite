import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { initialMenuPanels, initialLineupShows } from '../lib/initial-cms-data'

async function main() {
  console.log('Initializing Payload CMS...')
  const payload = await getPayload({ config: configPromise })

  const menuCount = await payload.count({ collection: 'menu' })
  if (menuCount.totalDocs === 0) {
    console.log('Seeding menu categories...')
    for (const panel of initialMenuPanels) {
      await payload.create({
        collection: 'menu',
        data: panel as any,
      })
    }
    console.log(`Seeded ${initialMenuPanels.length} menu categories.`)
  } else {
    console.log(`Menu already has ${menuCount.totalDocs} documents.`)
  }

  const lineupCount = await payload.count({ collection: 'lineup' })
  if (lineupCount.totalDocs === 0) {
    console.log('Seeding stage lineup acts...')
    for (const show of initialLineupShows) {
      await payload.create({
        collection: 'lineup',
        data: show as any,
      })
    }
    console.log(`Seeded ${initialLineupShows.length} stage lineup acts.`)
  } else {
    console.log(`Lineup already has ${lineupCount.totalDocs} documents.`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed script error:', err)
  process.exit(1)
})
