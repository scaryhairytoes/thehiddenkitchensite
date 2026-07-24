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
    const message = formData.get('message') as string
    const submissionMethod = formData.get('submissionMethod') as string
    
    if (!position || !name || !email || !phone || !availability || !message || !submissionMethod) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    let resumeId: number | string | undefined = undefined

    if (submissionMethod === 'resume') {
      const resumeFile = formData.get('resume') as File | null
      if (!resumeFile) {
        return NextResponse.json({ error: 'Please attach a resume file.' }, { status: 400 })
      }
      
      const buffer = Buffer.from(await resumeFile.arrayBuffer())
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
        message,
        submissionMethod,
        resume: resumeId,
        job1: getJob('job1'),
        job2: getJob('job2'),
        job3: getJob('job3'),
        education: formData.get('education') as string || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[career-applications]', err)
    return NextResponse.json(
      { error: 'Failed to process application. Please email us directly.' },
      { status: 500 },
    )
  }
}
