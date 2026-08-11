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
      turnstileToken,
    } = body

    // ── Verify Turnstile Token ────────────────────────────────────────────────
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Turnstile verification missing.' }, { status: 400 })
    }
    const turnstileFormData = new URLSearchParams()
    turnstileFormData.append('secret', process.env.TURNSTILE_SECRET_KEY || '')
    turnstileFormData.append('response', turnstileToken)
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData,
    })
    const turnstileData = await turnstileRes.json()
    if (!turnstileData.success) {
      return NextResponse.json({ error: 'Turnstile verification failed. Please try again.' }, { status: 400 })
    }

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
    console.error('[submit-reservation]', err)
    return NextResponse.json(
      { error: 'Failed to submit reservation. Please call us directly.' },
      { status: 500 },
    )
  }
}
