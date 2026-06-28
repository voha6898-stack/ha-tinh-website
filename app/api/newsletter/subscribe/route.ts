import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'subscribers.json')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Subscriber {
  email: string
  subscribedAt: string
  active: boolean
}

interface SubscribersData {
  items: Subscriber[]
}

function readSubscribers(): SubscribersData {
  try {
    if (!existsSync(FILE)) return { items: [] }
    return JSON.parse(readFileSync(FILE, 'utf8')) as SubscribersData
  } catch {
    return { items: [] }
  }
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
  }

  const data = readSubscribers()

  const alreadyExists = data.items.some((s) => s.email === email)
  if (alreadyExists) {
    return NextResponse.json({ error: 'Email này đã được đăng ký.' }, { status: 409 })
  }

  data.items.push({
    email,
    subscribedAt: new Date().toISOString(),
    active: true,
  })

  writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8')

  return NextResponse.json({ ok: true })
}
