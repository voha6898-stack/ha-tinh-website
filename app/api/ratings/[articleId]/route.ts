import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'ratings.json')

type Ratings = Record<string, { total: number; count: number }>

function readRatings(): Ratings {
  try { return JSON.parse(readFileSync(FILE, 'utf8')) } catch { return {} }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await params
  const all = readRatings()
  const r = all[articleId] ?? { total: 0, count: 0 }
  return NextResponse.json({
    average: r.count > 0 ? Math.round((r.total / r.count) * 10) / 10 : 0,
    count: r.count,
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await params
  const { score } = await req.json() as { score: number }

  if (!score || score < 1 || score > 5) {
    return NextResponse.json({ error: 'Score must be 1–5' }, { status: 400 })
  }

  const all = readRatings()
  const prev = all[articleId] ?? { total: 0, count: 0 }
  all[articleId] = { total: prev.total + score, count: prev.count + 1 }

  writeFileSync(FILE, JSON.stringify(all, null, 2), 'utf8')

  const updated = all[articleId]
  return NextResponse.json({
    average: Math.round((updated.total / updated.count) * 10) / 10,
    count: updated.count,
  })
}
