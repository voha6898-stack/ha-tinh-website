import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'analytics.json')

type Analytics = {
  daily: Record<string, { pageviews: number; visitors: number; paths: Record<string, number> }>
  sessions: Record<string, string[]>
}

function read(): Analytics {
  if (!existsSync(FILE)) return { daily: {}, sessions: {} }
  try { return JSON.parse(readFileSync(FILE, 'utf8')) }
  catch { return { daily: {}, sessions: {} } }
}

function write(data: Analytics) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const min = cutoff.toISOString().split('T')[0]
  const out: Analytics = { daily: {}, sessions: {} }
  for (const [d, v] of Object.entries(data.daily)) if (d >= min) out.daily[d] = v
  for (const [d, v] of Object.entries(data.sessions)) if (d >= min) out.sessions[d] = v
  writeFileSync(FILE, JSON.stringify(out, null, 2), 'utf8')
}

const BOT = /bot|crawler|spider|headless|puppeteer|selenium|lighthouse|prerender|Googlebot|bingbot|facebookexternalhit/i

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') || ''
  if (BOT.test(ua)) return NextResponse.json({ ok: true })

  let body: { path?: string; sessionId?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ ok: false }, { status: 400 }) }

  const { path, sessionId } = body
  if (!path || typeof path !== 'string') return NextResponse.json({ ok: false }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]
  const data = read()

  if (!data.daily[today]) data.daily[today] = { pageviews: 0, visitors: 0, paths: {} }
  if (!data.sessions[today]) data.sessions[today] = []

  data.daily[today].pageviews++
  data.daily[today].paths[path] = (data.daily[today].paths[path] || 0) + 1

  if (sessionId && !data.sessions[today].includes(sessionId)) {
    data.sessions[today].push(sessionId)
    data.daily[today].visitors++
  }

  write(data)
  return NextResponse.json({ ok: true })
}
