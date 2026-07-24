import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, type, dates, details } = body

    if (!name || !email || !type) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Build the transporter — uses env vars set in .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const html = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e8d8a0; padding: 40px; border: 1px solid rgba(197,163,104,0.3); border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #c5a368; margin: 0 0 8px;">The Hidden Kitchen</p>
          <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin: 0; color: #ffffff; letter-spacing: -0.02em;">Stage Request</h1>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; width: 140px; vertical-align: top;">Name</td>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 15px; color: #ffffff; vertical-align: top;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; vertical-align: top;">Email</td>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 15px; color: #ffffff; vertical-align: top;"><a href="mailto:${email}" style="color: #c5a368;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; vertical-align: top;">Phone</td>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 15px; color: #ffffff; vertical-align: top;">${phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; vertical-align: top;">Request Type</td>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 15px; color: #ffffff; vertical-align: top;">${type}</td>
          </tr>
          ${dates ? `
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; vertical-align: top;">Preferred Dates</td>
            <td style="padding: 14px 0; border-bottom: 1px solid rgba(197,163,104,0.15); font-size: 15px; color: #ffffff; vertical-align: top;">${dates}</td>
          </tr>` : ''}
          ${details ? `
          <tr>
            <td style="padding: 14px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a368; vertical-align: top;">Details</td>
            <td style="padding: 14px 0; font-size: 15px; color: #e8d8a0; vertical-align: top; line-height: 1.6;">${details.replace(/\n/g, '<br/>')}</td>
          </tr>` : ''}
        </table>

        <p style="margin-top: 32px; font-size: 11px; color: rgba(197,163,104,0.5); text-align: center; letter-spacing: 0.15em; text-transform: uppercase;">Submitted via thehiddenkitchen62.com</p>
      </div>
    `

    await transporter.sendMail({
      from: `"The Hidden Kitchen" <${process.env.SMTP_USER}>`,
      to: 'events@thehiddenkitchen62.com',
      replyTo: email,
      subject: `Stage Request — ${type} — ${name}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[stage-request]', err)
    return NextResponse.json({ error: 'Failed to send. Please try emailing us directly.' }, { status: 500 })
  }
}
