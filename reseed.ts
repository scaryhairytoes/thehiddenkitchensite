import { getPayload } from 'payload'
import configPromise from './payload.config'
import { initialMenuPanels } from './lib/initial-cms-data'

async function main() {
  console.log('Initializing Payload CMS...')
  const payload = await getPayload({ config: configPromise })

  console.log('Deleting existing menu items...')
  await payload.delete({ collection: 'menu', where: { id: { exists: true } } })

  console.log('Seeding menu categories with updated prices...')
  for (const panel of initialMenuPanels) {
    await payload.create({
      collection: 'menu',
      data: panel as any,
    })
  }
  console.log(`Seeded ${initialMenuPanels.length} menu categories.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed script error:', err)
  process.exit(1)
})
