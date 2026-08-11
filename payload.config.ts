import { buildConfig } from 'payload'
// Payload CMS Configuration - The Hidden Kitchen v2
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { initialMenuPanels, initialLineupShows } from '@/lib/initial-cms-data'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Category label map for email display ─────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'live-music': 'Live Music',
  'comedy': 'Comedy & Stage Acts',
  'private-event': 'Private Event / Party',
  'community': 'Community / Public Host',
}

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function validateUrl(url: any): string {
  if (!url) return '#'
  const str = String(url).trim()
  const lower = str.toLowerCase()
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return str
  }
  return '#'
}

export default buildConfig({
  onInit: async (payload) => {
    try {
      const menuCount = await payload.count({ collection: 'menu' })
      if (menuCount.totalDocs === 0) {
        console.log('[Payload] Auto-seeding menu details...')
        for (const panel of initialMenuPanels) {
          await payload.create({
            collection: 'menu',
            data: panel as any,
          })
        }
      }

      const lineupCount = await payload.count({ collection: 'lineup' })
      if (lineupCount.totalDocs === 0) {
        console.log('[Payload] Auto-seeding stage details...')
        for (const show of initialLineupShows) {
          await payload.create({
            collection: 'lineup',
            data: show as any,
          })
        }
      }
    } catch (err) {
      console.error('[Payload onInit] Error auto-seeding:', err)
    }
  },
  admin: {
    user: 'users',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: resendAdapter({
    defaultFromAddress: 'events@thehiddenkitchen62.com',
    defaultFromName: 'The Hidden Kitchen',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
    push: true,
  }),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },

    // ── Resumes (Media for Career Applications) ───────────────────────────────
    {
      slug: 'resumes',
      upload: {
        staticDir: 'media/resumes',
      },
      access: {
        read: () => true,
      },
      fields: [],
    },

    // ── Stage Requests (booking form submissions) ─────────────────────────────
    {
      slug: 'stage-requests',
      labels: {
        singular: 'Stage Request',
        plural: 'Stage Requests',
      },
      access: {
        create: () => false,
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'email', 'createdAt'],
        group: 'Events',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return

            const categoryLabel = CATEGORY_LABELS[doc.category] ?? doc.category
            
            const name = escapeHtml(doc.name)
            const email = escapeHtml(doc.email)
            const phone = escapeHtml(doc.phone)
            const preferredDates = escapeHtml(doc.preferredDates)
            const details = escapeHtml(doc.details)
            const musicLink = escapeHtml(doc.musicLink)
            const actType = escapeHtml(doc.actType)
            const setLength = escapeHtml(doc.setLength)
            const mediaLink = escapeHtml(doc.mediaLink)
            const guestCount = escapeHtml(doc.guestCount)
            const cateringNeeds = escapeHtml(doc.cateringNeeds)
            const expectedDraw = escapeHtml(doc.expectedDraw)

            // ── Build optional field rows ─────────────────────────────────────
            const row = (label: string, value: string | undefined) =>
              value
                ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">${label}</td>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${value}</td>
                  </tr>`
                : ''

            const categoryRows = [
              musicLink ? row('Music Link', `<a href="${validateUrl(musicLink)}" style="color:#D6AF00;">${musicLink}</a>`) : '',
              actType ? row('Act Type', actType) : '',
              mediaLink ? row('Media Link', `<a href="${validateUrl(mediaLink)}" style="color:#D6AF00;">${mediaLink}</a>`) : '',
              setLength ? row('Set Length', setLength) : '',
              guestCount ? row('Guest Count', guestCount) : '',
              cateringNeeds ? row('Catering Needs', cateringNeeds) : '',
              expectedDraw ? row('Expected Draw', expectedDraw) : '',
            ].join('')

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Stage Request</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">${categoryLabel}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  ${row('Name', name)}
                  ${row('Email', `<a href="mailto:${email}" style="color:#D6AF00;">${email}</a>`)}
                  ${phone ? row('Phone', phone) : ''}
                  ${row('Category', categoryLabel)}
                  ${row('Preferred Dates', preferredDates)}
                  ${categoryRows}
                  ${row('Details', details?.replace(/\n/g, '<br/>'))}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to: 'events@thehiddenkitchen62.com',
                replyTo: email.replace(/[\r\n]/g, ''),
                subject: `[New ${categoryLabel} Booking] ${name}`.replace(/[\r\n]/g, ''),
                html,
              })
            } catch (err) {
              console.error('[stage-requests] afterChange email error:', err)
            }
          },
        ],
      },
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: 'Live Music', value: 'live-music' },
            { label: 'Comedy & Stage Acts', value: 'comedy' },
            { label: 'Private Event / Party', value: 'private-event' },
            { label: 'Community / Public Host', value: 'community' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'preferredDates',
          label: 'Preferred Dates / Availability',
          type: 'text',
          required: true,
        },
        {
          name: 'musicLink',
          label: 'Music / Media Link',
          type: 'text',
        },
        {
          name: 'actType',
          label: 'Act Type',
          type: 'text',
        },
        {
          name: 'setLength',
          label: 'Set Length',
          type: 'text',
        },
        {
          name: 'mediaLink',
          label: 'Media Link (Comedy)',
          type: 'text',
        },
        {
          name: 'guestCount',
          label: 'Guest Count',
          type: 'text',
        },
        {
          name: 'cateringNeeds',
          label: 'Catering Needs',
          type: 'text',
        },
        {
          name: 'expectedDraw',
          label: 'Expected Draw',
          type: 'text',
        },
        {
          name: 'details',
          label: 'Details / Notes',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // ── Career Applications ──────────────────────────────────────────────────
    {
      slug: 'career-applications',
      labels: {
        singular: 'Career Application',
        plural: 'Career Applications',
      },
      access: {
        create: () => false,
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'position', 'email', 'createdAt'],
        group: 'HR',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return

            const position = escapeHtml(doc.position)
            const name = escapeHtml(doc.name)
            const email = escapeHtml(doc.email)
            const phone = escapeHtml(doc.phone)
            const availability = escapeHtml(doc.availability)
            const startDate = escapeHtml(doc.startDate)
            const message = escapeHtml(doc.message)
            const education = escapeHtml(doc.education)
            const submissionMethod = escapeHtml(doc.submissionMethod)
            const resume = doc.resume
            const job1 = doc.job1
            const job2 = doc.job2
            const job3 = doc.job3

            const row = (label: string, value: string | undefined) =>
              value
                ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">${label}</td>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${value}</td>
                  </tr>`
                : ''

            let experienceHtml = ''
            if (submissionMethod === 'resume' && resume) {
              const fileUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${resume.url}`
              experienceHtml = row('Resume', `<a href="${validateUrl(fileUrl)}" style="color:#D6AF00;">Download / View Resume</a>`)
            } else if (submissionMethod === 'manual') {
              type JobType = { company?: string; title?: string; dates?: string; responsibilities?: string }
              const formatJob = (job: JobType | undefined, index: number) => {
                if (!job || !job.company) return ''
                const company = escapeHtml(job.company)
                const title = escapeHtml(job.title)
                const dates = escapeHtml(job.dates)
                const responsibilities = escapeHtml(job.responsibilities)
                return `
                  <tr>
                    <td colspan="2" style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;line-height:1.5;">
                      <strong style="color:#D6AF00;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Job ${index}</strong><br/>
                      <strong>${company}</strong> — ${title} (${dates})<br/>
                      <div style="margin-top:4px;color:rgba(255,255,255,0.7);">${responsibilities.replace(/\n/g, '<br/>') || ''}</div>
                    </td>
                  </tr>
                `
              }
              experienceHtml = `
                ${formatJob(job1, 1)}
                ${formatJob(job2, 2)}
                ${formatJob(job3, 3)}
                ${education ? row('Education', education.replace(/\n/g, '<br/>')) : ''}
              `
            }

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Career Application</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">${position}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  ${row('Name', name)}
                  ${row('Email', `<a href="mailto:${email}" style="color:#D6AF00;">${email}</a>`)}
                  ${phone ? row('Phone', phone) : ''}
                  ${row('Position', position)}
                  ${row('Availability', availability)}
                  ${startDate ? row('Available Start Date', startDate) : ''}
                  ${experienceHtml}
                  ${row('Message', message?.replace(/\n/g, '<br/>'))}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to: 'careers@thehiddenkitchen62.com',
                replyTo: email.replace(/[\r\n]/g, ''),
                subject: `[New Career App: ${position}] ${name}`.replace(/[\r\n]/g, ''),
                html,
              })
            } catch (err) {
              console.error('[career-applications] afterChange email error:', err)
            }
          },
        ],
      },
      fields: [
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'availability',
          label: 'Availability',
          type: 'text',
          required: true,
        },
        {
          name: 'startDate',
          label: 'Available Start Date',
          type: 'text',
        },
        {
          name: 'submissionMethod',
          type: 'text',
          required: true,
        },
        {
          name: 'resume',
          type: 'upload',
          relationTo: 'resumes',
        },
        {
          name: 'job1',
          type: 'group',
          fields: [
            { name: 'company', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'dates', type: 'text' },
            { name: 'responsibilities', type: 'textarea' },
          ],
        },
        {
          name: 'job2',
          type: 'group',
          fields: [
            { name: 'company', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'dates', type: 'text' },
            { name: 'responsibilities', type: 'textarea' },
          ],
        },
        {
          name: 'job3',
          type: 'group',
          fields: [
            { name: 'company', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'dates', type: 'text' },
            { name: 'responsibilities', type: 'textarea' },
          ],
        },
        {
          name: 'education',
          type: 'textarea',
        },
        {
          name: 'message',
          label: 'Why do you want to join our family?',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // ── Reservations (Custom booking form) ─────────────────────────────
    {
      slug: 'reservations',
      labels: {
        singular: 'Reservation',
        plural: 'Reservations',
      },
      access: {
        create: () => false,
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'date', 'time', 'partySize', 'status'],
        group: 'Events',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return

            const name = escapeHtml(doc.name)
            const email = escapeHtml(doc.email)
            const phone = escapeHtml(doc.phone)
            const date = escapeHtml(doc.date)
            const time = escapeHtml(doc.time)
            const partySize = escapeHtml(doc.partySize)
            const specialRequests = escapeHtml(doc.specialRequests)

            const row = (label: string, value: string | undefined) =>
              value
                ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">${label}</td>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${value}</td>
                  </tr>`
                : ''

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Reservation Request</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">${date} at ${time} for ${partySize}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  ${row('Name', name)}
                  ${row('Email', `<a href="mailto:${email}" style="color:#D6AF00;">${email}</a>`)}
                  ${row('Phone', phone)}
                  ${row('Party Size', String(partySize))}
                  ${row('Date', date)}
                  ${row('Time', time)}
                  ${specialRequests ? row('Special Requests', specialRequests.replace(/\n/g, '<br/>')) : ''}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to: 'reservations@thehiddenkitchen62.com',
                replyTo: email.replace(/[\r\n]/g, ''),
                subject: `[Reservation Request] ${date} - ${name} (${partySize} guests)`.replace(/[\r\n]/g, ''),
                html,
              })
            } catch (err) {
              console.error('[reservations] afterChange email error:', err)
            }
          },
        ],
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'date', type: 'text', required: true },
        { name: 'time', type: 'text', required: true },
        { name: 'partySize', type: 'number', required: true },
        { name: 'specialRequests', type: 'textarea' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Scheduled', value: 'scheduled' },
          ],
        },
      ],
    },

    // ── Lineup (The Stage schedule) ───────────────────────────────────────────
    {
      slug: 'lineup',
      access: {
        read: () => true,
      },
      labels: {
        singular: 'Stage Act / Event',
        plural: 'The Stage Lineup',
      },
      admin: {
        useAsTitle: 'act',
        defaultColumns: ['act', 'day', 'category', 'socialUrl', 'facebookUrl'],
        group: 'Stage & Content',
      },
      fields: [
        {
          name: 'act',
          label: 'Act / Performer Name',
          type: 'text',
          required: true,
        },
        {
          name: 'socialUrl',
          label: 'Act Social / Web Page Link',
          type: 'text',
          admin: {
            description: 'URL opened when clicking the act name (e.g. Instagram, Spotify, Website)',
          },
        },
        {
          name: 'facebookUrl',
          label: 'Facebook Event / RSVP Link',
          type: 'text',
          admin: {
            description: 'URL opened when clicking the RSVP button (Facebook Event)',
          },
        },
        {
          name: 'day',
          label: 'Display Date (e.g. Jul 22)',
          type: 'text',
          required: true,
        },
        {
          name: 'weekday',
          label: 'Weekday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)',
          type: 'number',
          min: 0,
          max: 6,
          required: true,
          defaultValue: 3,
        },
        {
          name: 'hour',
          label: 'Start Hour 24h (e.g. 17 for 5:00 PM)',
          type: 'number',
          required: true,
          defaultValue: 17,
        },
        {
          name: 'endHour',
          label: 'End Hour 24h (e.g. 20 for 8:00 PM)',
          type: 'number',
          defaultValue: 20,
          admin: {
            description: 'End time in 24-hour format (e.g. 20 for 8:00 PM). If empty, defaults to 3 hours after start hour.',
          },
        },
        {
          name: 'timeStr',
          label: 'Display Time String (e.g. 8:30 PM – 10:30 PM)',
          type: 'text',
          admin: {
            description: 'Custom display time text shown on the website (e.g. 8:30 PM – 10:30 PM). Overrides numeric start/end hour formatting.',
          },
        },
        {
          name: 'dateStr',
          label: 'Full Date (YYYY-MM-DD)',
          type: 'text',
          admin: {
            description: 'Required for calendar export & countdown (e.g. 2026-07-22)',
          },
        },
        {
          name: 'monthKey',
          label: 'Month Key',
          type: 'select',
          defaultValue: 'JUL',
          options: [
            { label: 'July', value: 'JUL' },
            { label: 'August', value: 'AUG' },
            { label: 'September', value: 'SEP' },
            { label: 'October', value: 'OCT' },
            { label: 'November', value: 'NOV' },
            { label: 'December', value: 'DEC' },
          ],
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          defaultValue: 'Live Music',
          options: [
            { label: 'Live Music', value: 'Live Music' },
            { label: 'Stand-Up Comedy', value: 'Stand-Up Comedy' },
            { label: 'Trivia Night', value: 'Trivia Night' },
            { label: 'Special Event', value: 'Special Event' },
            { label: 'Storytelling', value: 'Storytelling' },
            { label: 'Watch Party', value: 'Watch Party' },
          ],
        },
        {
          name: 'genre',
          label: 'Genre / Subtitle',
          type: 'text',
        },
      ],
    },

    // ── Menu ──────────────────────────────────────────────────────────────────
    {
      slug: 'menu',
      access: {
        read: () => true,
      },
      labels: {
        singular: 'Menu Category',
        plural: 'The Menu',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'key', 'sortOrder', 'bannerNote'],
        group: 'Menu & Food',
      },
      fields: [
        {
          name: 'key',
          label: 'Category Key (slug)',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'title',
          label: 'Category Title (e.g. Starters, Pastas)',
          type: 'text',
          required: true,
        },
        {
          name: 'sortOrder',
          label: 'Display Sort Order (1, 2, 3...)',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'bannerNote',
          label: 'Category Subtitle / Banner Note',
          type: 'text',
        },
        {
          name: 'items',
          label: 'Menu Items',
          type: 'array',
          fields: [
            {
              name: 'name',
              label: 'Item Name',
              type: 'text',
              required: true,
            },
            {
              name: 'note',
              label: 'Description / Details',
              type: 'textarea',
            },
            {
              name: 'price',
              label: 'Price (optional)',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  plugins: [
    s3Storage({
      collections: {
        resumes: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true,
      },
    }),
  ],
})