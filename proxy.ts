import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── In-memory rate limit stores ─────────────────────────────────────────────
const loginStore  = new Map<string, { count: number; resetAt: number }>()
const reviewStore = new Map<string, { count: number; resetAt: number }>()
const newsStore   = new Map<string, { count: number; resetAt: number }>()

function clientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

function rateCheck(
  store: Map<string, { count: number; resetAt: number }>,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const rec = store.get(key)
  if (!rec || now > rec.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (rec.count >= limit) return true
  rec.count++
  return false
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  // Minimal CSP: no iframe embedding, no plugins, no base-tag injection
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'; object-src 'none'; base-uri 'self';")
  return res
}

function unauthorized(): NextResponse {
  return addSecurityHeaders(
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = clientIP(request)

  // ── 1. Admin page auth guard ───────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get('ha_tinh_admin')
    if (cookie?.value !== 'authenticated') {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('redirect', pathname)
      return addSecurityHeaders(NextResponse.redirect(url))
    }
  }

  // ── 2. Content API mutations require admin cookie ─────────────────────────
  if (pathname.startsWith('/api/content/') && request.method === 'PUT') {
    if (request.cookies.get('ha_tinh_admin')?.value !== 'authenticated') {
      return unauthorized()
    }
  }

  // ── 3. Upload API requires admin cookie ───────────────────────────────────
  if (pathname === '/api/upload') {
    if (request.cookies.get('ha_tinh_admin')?.value !== 'authenticated') {
      return unauthorized()
    }
  }

  // ── 4. Subscribers list requires admin cookie ─────────────────────────────
  if (pathname === '/api/newsletter/subscribers') {
    if (request.cookies.get('ha_tinh_admin')?.value !== 'authenticated') {
      return unauthorized()
    }
  }

  // ── 5. Rate limit: login (5 attempts / 15 min per IP) ─────────────────────
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    if (rateCheck(loginStore, ip, 5, 15 * 60 * 1000)) {
      const res = NextResponse.json(
        { error: 'Quá nhiều lần thử đăng nhập. Vui lòng chờ 15 phút.' },
        { status: 429 }
      )
      res.headers.set('Retry-After', '900')
      return addSecurityHeaders(res)
    }
  }

  // ── 6. Rate limit: reviews (3 / 1 hour per IP) ───────────────────────────
  if (pathname.startsWith('/api/reviews/') && request.method === 'POST') {
    if (rateCheck(reviewStore, ip, 3, 60 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Bạn đã gửi quá nhiều đánh giá. Vui lòng thử lại sau 1 giờ.' },
          { status: 429 }
        )
      )
    }
  }

  // ── 7. Rate limit: newsletter (3 / 1 hour per IP) ─────────────────────────
  if (pathname === '/api/newsletter/subscribe' && request.method === 'POST') {
    if (rateCheck(newsStore, ip, 3, 60 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.' },
          { status: 429 }
        )
      )
    }
  }

  return addSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
