import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const position = formData.get('position') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const availability = formData.get('availability') as string
    const startDate = (formData.get('startDate') as string) || undefined
    const message = formData.get('message') as string
    const submissionMethod = formData.get('submissionMethod') as string
    const turnstileToken = formData.get('cf-turnstile-response') as string
    
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
    
    if (!position || !name || !email || !phone || !availability || !message || !submissionMethod) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    let resumeId: number | string | undefined = undefined
    let emailAttachments: any[] | undefined = undefined

    if (submissionMethod === 'resume') {
      const resumeFile = formData.get('resume') as File | null
      if (!resumeFile) {
        return NextResponse.json({ error: 'Please attach a resume file.' }, { status: 400 })
      }
      
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Resume file must be smaller than 5MB.' }, { status: 400 })
      }
      
      const buffer = Buffer.from(await resumeFile.arrayBuffer())
      
      emailAttachments = [
        {
          filename: resumeFile.name,
          content: buffer,
        }
      ]

      const uploadedMedia = await payload.create({
        collection: 'resumes',
        data: {}, 
        file: {
          data: buffer,
          name: resumeFile.name,
          size: resumeFile.size,
          mimetype: resumeFile.type,
        }
      })
      resumeId = uploadedMedia.id
    }

    const getJob = (prefix: string) => {
      const company = formData.get(`${prefix}[company]`) as string
      if (!company) return undefined
      return {
        company,
        title: formData.get(`${prefix}[title]`) as string,
        dates: formData.get(`${prefix}[dates]`) as string,
        responsibilities: formData.get(`${prefix}[responsibilities]`) as string,
      }
    }

    await payload.create({
      collection: 'career-applications',
      data: {
        position,
        name,
        email,
        phone,
        availability,
        startDate,
        message,
        submissionMethod,
        resume: resumeId,
        job1: getJob('job1'),
        job2: getJob('job2'),
        job3: getJob('job3'),
        education: formData.get('education') as string || undefined,
      },
    })

    const html = `
      <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
          <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Career Application</h1>
          <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">${position}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">Name</td><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${name}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">Email</td><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;"><a href="mailto:${email}" style="color:#D6AF00;">${email}</a></td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">Phone</td><td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${phone}</td></tr>
        </table>
        <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
          Submitted via thehiddenkitchen62.com
        </p>
      </div>
    `

    try {
      await payload.sendEmail({
        to: ['careers@thehiddenkitchen62.com', 'thehiddenkitchen26@gmail.com'],
        replyTo: email.replace(/[\r\n]/g, ''),
        subject: `[New Career App: ${position}] ${name}`.replace(/[\r\n]/g, ''),
        html,
        attachments: emailAttachments,
      })
    } catch (err) {
      console.error('[submit-career-application] email error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit-career-application]', err)
    return NextResponse.json(
      { error: 'Failed to process application. Please email us directly.' },
      { status: 500 },
    )
  }
}
