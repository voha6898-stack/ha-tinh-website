import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { cookies } from 'next/headers'

const FILE = join(process.cwd(), 'data', 'analytics.json')

export async function GET(req: NextRequest) {
  const jar = await cookies()
  const token = jar.get('ha_tinh_admin')?.value
  if (token !== 'authenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!existsSync(FILE)) return NextResponse.json({ daily: {}, sessions: {} })
  try {
    const raw = JSON.parse(readFileSync(FILE, 'utf8'))
    // Strip session arrays from response (only send counts)
    const daily = raw.daily || {}
    return NextResponse.json({ daily })
  } catch {
    return NextResponse.json({ daily: {} })
  }
}
