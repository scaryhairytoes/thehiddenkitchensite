import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

const initialLineupShows = [
  { dateStr: '2026-07-22', day: 'Jul 22', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events', socialUrl: '' },
  { dateStr: '2026-07-29', day: 'Jul 29', weekday: 3, act: 'Taylor Kearney', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'JUL', facebookUrl: 'https://facebook.com/events', socialUrl: '' },
  { dateStr: '2026-08-05', day: 'Aug 5', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'AUG', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-08-12', day: 'Aug 12', weekday: 3, act: 'Tim Crosby', genre: 'Singer-Songwriter', category: 'Live Music', hour: 17, monthKey: 'AUG', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-08-26', day: 'Aug 26', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'AUG', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-09-09', day: 'Sep 9', weekday: 3, act: 'Saint City 2', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'SEP', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-09-16', day: 'Sep 16', weekday: 3, act: 'Isaiah Cunningham', genre: 'Acoustic Set', category: 'Live Music', hour: 17, monthKey: 'SEP', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-09-23', day: 'Sep 23', weekday: 3, act: 'Edwin Linson', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'SEP', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-09-30', day: 'Sep 30', weekday: 3, act: 'Jonny Coller', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'SEP', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-10-07', day: 'Oct 7', weekday: 3, act: 'Max Dalton', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'OCT', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-10-14', day: 'Oct 14', weekday: 3, act: 'Christopher John Davis Chamness', genre: 'Acoustic & Vocals', category: 'Live Music', hour: 17, monthKey: 'OCT', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-10-21', day: 'Oct 21', weekday: 3, act: 'Matt Basler', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'OCT', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-10-28', day: 'Oct 28', weekday: 3, act: 'Logan Allen Chapman', genre: 'Live Performance', category: 'Live Music', hour: 17, monthKey: 'OCT', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-11-04', day: 'Nov 4', weekday: 3, act: 'Isaiah Cunningham', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'NOV', facebookUrl: '', socialUrl: '' },
  { dateStr: '2026-12-02', day: 'Dec 2', weekday: 3, act: 'Jermaine Bollinger', genre: 'Live Music', category: 'Live Music', hour: 17, monthKey: 'DEC', facebookUrl: '', socialUrl: '' },
]

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    let result = await payload.find({
      collection: 'lineup',
      limit: 100,
    })

    if (result.totalDocs === 0) {
      console.log('[API /api/lineup] Auto-seeding stage lineup acts into Payload CMS...')
      for (const show of initialLineupShows) {
        await payload.create({
          collection: 'lineup',
          data: show as any,
        })
      }
      result = await payload.find({
        collection: 'lineup',
        limit: 100,
      })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API /api/lineup] Error:', error)
    return NextResponse.json({ docs: [], error: error.message }, { status: 500 })
  }
}
