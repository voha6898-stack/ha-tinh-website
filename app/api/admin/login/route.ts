import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

// Track consecutive failures per IP to give informative error after lockout
// (the actual lockout enforcement happens in middleware.ts)
const failCounts = new Map<string, number>()

function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) {
      // Still do a comparison to prevent timing leak on length difference
      timingSafeEqual(bufA, Buffer.alloc(bufA.length))
      return false
    }
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

function clientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'
}

export async function POST(request: NextRequest) {
  const ip = clientIP(request)

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  const { password } = body
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hatinh2025'

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Vui lòng nhập mật khẩu' }, { status: 400 })
  }

  if (safeEqual(password, ADMIN_PASSWORD)) {
    failCounts.delete(ip)
    const response = NextResponse.json({ success: true })
    response.cookies.set('ha_tinh_admin', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    })
    return response
  }

  // Track failures (for user-facing count in error message)
  const fails = (failCounts.get(ip) ?? 0) + 1
  failCounts.set(ip, fails)

  const remaining = Math.max(0, 5 - fails)
  const message = remaining > 0
    ? `Mật khẩu không đúng. Còn ${remaining} lần thử.`
    : 'Tài khoản bị khóa tạm thời. Vui lòng chờ 15 phút.'

  // Deliberate 300ms delay to further slow down automation
  await new Promise(r => setTimeout(r, 300))

  return NextResponse.json({ error: message }, { status: 401 })
}
