import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      category,
      name,
      email,
      phone,
      preferredDates,
      details,
      musicLink,
      actType,
      setLength,
      mediaLink,
      guestCount,
      cateringNeeds,
      expectedDraw,
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

    // ── Validate required base fields ──────────────────────────────────────────
    if (!category || !name || !phone || !preferredDates || !details) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // ── Validate category-specific required fields ──────────────────────────────
    if (category === 'live-music' && !musicLink) {
      return NextResponse.json({ error: 'A music or media link is required for Live Music submissions.' }, { status: 400 })
    }

    // ── Create document in Payload (afterChange hook handles email) ────────────
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'stage-requests',
      data: {
        category,
        name,
        email:         email         || undefined,
        phone,
        preferredDates,
        details,
        musicLink:     musicLink     || undefined,
        actType:       actType       || undefined,
        setLength:     setLength     || undefined,
        mediaLink:     mediaLink     || undefined,
        guestCount:    guestCount    || undefined,
        cateringNeeds: cateringNeeds || undefined,
        expectedDraw:  expectedDraw  || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit-stage-request]', err)
    return NextResponse.json(
      { error: 'Failed to process request. Please email us directly at events@thehiddenkitchen62.com.' },
      { status: 500 },
    )
  }
}
