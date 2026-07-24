import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Category label map for email display ─────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'live-music':    'Live Music',
  'comedy':        'Comedy & Stage Acts',
  'private-event': 'Private Event / Party',
  'community':     'Community / Public Host',
}

export default buildConfig({
  admin: {
    user: 'users',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'events@thehiddenkitchen62.com',
    defaultFromName: 'The Hidden Kitchen Website',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
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
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'email', 'createdAt'],
        group: 'Events',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return

            const {
              category, name, email, phone,
              preferredDates, details,
              musicLink, actType, setLength,
              mediaLink, guestCount, cateringNeeds,
              expectedDraw,
            } = doc

            const categoryLabel = CATEGORY_LABELS[category] ?? category

            // ── Build optional field rows ─────────────────────────────────────
            const row = (label: string, value: string | undefined) =>
              value
                ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">${label}</td>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">${value}</td>
                  </tr>`
                : ''

            const categoryRows = [
              musicLink     ? row('Music Link',      `<a href="${musicLink}" style="color:#D6AF00;">${musicLink}</a>`) : '',
              actType       ? row('Act Type',         actType)       : '',
              mediaLink     ? row('Media Link',       `<a href="${mediaLink}" style="color:#D6AF00;">${mediaLink}</a>`) : '',
              setLength     ? row('Set Length',       setLength)     : '',
              guestCount    ? row('Guest Count',      guestCount)    : '',
              cateringNeeds ? row('Catering Needs',   cateringNeeds) : '',
              expectedDraw  ? row('Expected Draw',    expectedDraw)  : '',
            ].join('')

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Stage Request</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">${categoryLabel}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  ${row('Name',             name)}
                  ${row('Email',            `<a href="mailto:${email}" style="color:#D6AF00;">${email}</a>`)}
                  ${phone ? row('Phone', phone) : ''}
                  ${row('Category',         categoryLabel)}
                  ${row('Preferred Dates',  preferredDates)}
                  ${categoryRows}
                  ${row('Details',          details?.replace(/\n/g, '<br/>'))}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to:      'events@thehiddenkitchen62.com',
                replyTo: email,
                subject: `[New ${categoryLabel} Booking] ${name}`,
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
            { label: 'Live Music',              value: 'live-music'    },
            { label: 'Comedy & Stage Acts',     value: 'comedy'        },
            { label: 'Private Event / Party',   value: 'private-event' },
            { label: 'Community / Public Host', value: 'community'     },
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
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'position', 'email', 'createdAt'],
        group: 'HR',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return


            const {
              position, name, email, phone, availability, message,
              submissionMethod, resume, job1, job2, job3, education
            } = doc

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
              experienceHtml = row('Resume', `<a href="${fileUrl}" style="color:#D6AF00;">Download / View Resume</a>`)
            } else if (submissionMethod === 'manual') {
              const formatJob = (job: any, index: number) => {
                if (!job || !job.company) return ''
                return `
                  <tr>
                    <td colspan="2" style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;line-height:1.5;">
                      <strong style="color:#D6AF00;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Job ${index}</strong><br/>
                      <strong>${job.company}</strong> — ${job.title} (${job.dates})<br/>
                      <div style="margin-top:4px;color:rgba(255,255,255,0.7);">${job.responsibilities?.replace(/\\n/g, '<br/>') || ''}</div>
                    </td>
                  </tr>
                `
              }
              experienceHtml = `
                ${formatJob(job1, 1)}
                ${formatJob(job2, 2)}
                ${formatJob(job3, 3)}
                ${education ? row('Education', education.replace(/\\n/g, '<br/>')) : ''}
              `
            }

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Career Application</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">\${position}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  \${row('Name',             name)}
                  \${row('Email',            \`<a href="mailto:\${email}" style="color:#D6AF00;">\${email}</a>\`)}
                  \${phone ? row('Phone', phone) : ''}
                  \${row('Position',         position)}
                  \${row('Availability',     availability)}
                  \${experienceHtml}
                  \${row('Message',          message?.replace(/\\n/g, '<br/>'))}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to:      'careers@thehiddenkitchen62.com',
                replyTo: email,
                subject: `[New Career App: \${position}] \${name}`,
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
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'date', 'time', 'partySize', 'status'],
        group: 'Events',
      },
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation !== 'create') return

            const { name, email, phone, date, time, partySize, specialRequests } = doc

            const row = (label: string, value: string | undefined) =>
              value
                ? `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D6AF00;width:160px;vertical-align:top;">\${label}</td>
                    <td style="padding:12px 0;border-bottom:1px solid rgba(214,175,0,0.12);font-size:14px;color:#ffffff;vertical-align:top;line-height:1.5;">\${value}</td>
                  </tr>`
                : ''

            const html = `
              <div style="font-family:'Georgia',serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8d8a0;padding:40px;border:1px solid rgba(214,175,0,0.3);border-radius:12px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <p style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#D6AF00;margin:0 0 8px;">The Hidden Kitchen</p>
                  <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0;color:#ffffff;letter-spacing:-0.02em;">New Reservation Request</h1>
                  <p style="margin:10px 0 0;font-size:13px;color:#D6AF00;letter-spacing:0.05em;">\${date} at \${time} for \${partySize}</p>
                </div>

                <table style="width:100%;border-collapse:collapse;">
                  \${row('Name', name)}
                  \${row('Email', \`<a href="mailto:\${email}" style="color:#D6AF00;">\${email}</a>\`)}
                  \${row('Phone', phone)}
                  \${row('Party Size', String(partySize))}
                  \${row('Date', date)}
                  \${row('Time', time)}
                  \${specialRequests ? row('Special Requests', specialRequests.replace(/\\n/g, '<br/>')) : ''}
                </table>

                <p style="margin-top:36px;font-size:10px;color:rgba(214,175,0,0.45);text-align:center;letter-spacing:0.2em;text-transform:uppercase;">
                  Submitted via thehiddenkitchen62.com
                </p>
              </div>
            `

            try {
              await req.payload.sendEmail({
                to: 'reservations@thehiddenkitchen62.com',
                replyTo: email,
                subject: `[Reservation Request] \${date} - \${name} (\${partySize} guests)`,
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
        singular: 'The Stage',
        plural: 'The Stage',
      },
      admin: {
        useAsTitle: 'act',
      },
      fields: [
        {
          name: 'day',
          type: 'text',
          required: true,
        },
        {
          name: 'weekday',
          type: 'number',
          min: 0,
          max: 6,
          required: true,
        },
        {
          name: 'act',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          defaultValue: 'Live Music',
          options: [
            { label: 'Live Music',      value: 'Live Music'      },
            { label: 'Stand-Up Comedy', value: 'Stand-Up Comedy' },
            { label: 'Trivia Night',    value: 'Trivia Night'    },
            { label: 'Special Event',   value: 'Special Event'   },
            { label: 'Storytelling',    value: 'Storytelling'    },
            { label: 'Watch Party',     value: 'Watch Party'     },
          ],
        },
        {
          name: 'genre',
          type: 'text',
        },
        {
          name: 'facebookUrl',
          label: 'Facebook Event URL',
          type: 'text',
        },
        {
          name: 'hour',
          type: 'number',
          required: true,
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
        singular: 'The Menu',
        plural: 'The Menu',
      },
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'bannerNote',
          type: 'text',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'note',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
})
