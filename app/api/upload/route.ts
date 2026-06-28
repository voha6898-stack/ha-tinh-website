import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join, extname } from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

// Verify actual image bytes — prevents disguised file uploads
function isAllowedImageBytes(buf: Buffer): boolean {
  if (buf.length < 12) return false
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true
  // GIF: 47 49 46 38 37/39 61  (GIF87a / GIF89a)
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true
  // WebP: RIFF????WEBP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return true
  return false
}

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('ha_tinh_admin')?.value === 'authenticated'
}

export async function POST(request: NextRequest) {
  // Auth check (middleware also blocks, this is defense-in-depth)
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Không có file được gửi lên' }, { status: 400 })
    }

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File quá lớn. Tối đa 5MB (file của bạn: ${(file.size / 1024 / 1024).toFixed(1)}MB)` }, { status: 400 })
    }

    // Extension check
    const ext = extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Định dạng không được phép. Chỉ chấp nhận: ${[...ALLOWED_EXTENSIONS].join(', ')}` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Magic bytes check — reject if actual bytes don't match an image format
    if (!isAllowedImageBytes(buffer)) {
      return NextResponse.json({ error: 'File không phải ảnh hợp lệ (magic bytes không khớp)' }, { status: 400 })
    }

    const uploadDir = process.env.NODE_ENV === 'production'
      ? join(process.cwd(), 'data', 'uploads')
      : join(process.cwd(), 'public', 'uploads')
    mkdirSync(uploadDir, { recursive: true })

    // Random filename prevents enumeration and path traversal
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    writeFileSync(join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Lỗi server khi upload' }, { status: 500 })
  }
}
