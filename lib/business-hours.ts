import { getPayload } from 'payload'
import config from '@payload-config'
import { DayHours, DEFAULT_HOURS } from './business-hours-shared'

// Re-export all shared types, constants, and utilities
export * from './business-hours-shared'

// ── Server-side fetch (Payload Local API) ────────────────────────────────────
export async function getBusinessHours(): Promise<DayHours[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'business-hours' })
    if (data?.days && Array.isArray(data.days) && data.days.length > 0) {
      return data.days as DayHours[]
    }
  } catch (err) {
    console.error('[business-hours] Error fetching from Payload:', err)
  }
  return DEFAULT_HOURS
}
