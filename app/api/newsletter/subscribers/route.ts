import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { cookies } from 'next/headers'

const FILE = join(process.cwd(), 'data', 'subscribers.json')

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

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('ha_tinh_admin')

  if (auth?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = readSubscribers()
  return NextResponse.json({ items: data.items, total: data.items.length })
}
