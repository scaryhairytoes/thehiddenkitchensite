import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      phone,
      date,
      time,
      partySize,
      specialRequests,
    } = body

    if (!name || !email || !phone || !date || !time || !partySize) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'reservations',
      data: {
        name,
        email,
        phone,
        date,
        time,
        partySize,
        specialRequests: specialRequests || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[reservations-api]', err)
    return NextResponse.json(
      { error: 'Failed to submit reservation. Please call us directly.' },
      { status: 500 },
    )
  }
}
