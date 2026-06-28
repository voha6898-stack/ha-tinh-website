import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const VALID_SECTIONS = ['tourism', 'cuisine', 'products', 'shops', 'site', 'gallery', 'news', 'ratings', 'ticker', 'realestate', 'ads', 'transport']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  try {
    const data = JSON.parse(
      readFileSync(join(process.cwd(), 'data', `${section}.json`), 'utf8')
    )
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  try {
    const body = await request.json()
    writeFileSync(
      join(process.cwd(), 'data', `${section}.json`),
      JSON.stringify(body, null, 2),
      'utf8'
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
