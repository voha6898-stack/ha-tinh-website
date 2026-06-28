import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'fs'
import { join, extname } from 'path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filename = path.join('/')

  // Check persistent volume path first (Railway production)
  const dataPath = join(process.cwd(), 'data', 'uploads', filename)
  // Fallback: git-committed files in public/uploads (always present from build)
  const publicPath = join(process.cwd(), 'public', 'uploads', filename)

  const filePath = existsSync(dataPath)
    ? dataPath
    : existsSync(publicPath)
    ? publicPath
    : null

  if (!filePath) {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext = extname(filename).toLowerCase()
  const mime = MIME[ext] || 'application/octet-stream'
  const buffer = readFileSync(filePath)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
