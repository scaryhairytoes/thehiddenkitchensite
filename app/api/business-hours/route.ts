import { NextResponse } from 'next/server'
import { getBusinessHours } from '@/lib/business-hours'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET() {
  try {
    const hours = await getBusinessHours()
    return NextResponse.json({ hours })
  } catch (err) {
    console.error('[api/business-hours] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 })
  }
}

