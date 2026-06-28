import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Review } from '@/lib/types'

// ─── Auto-promotion thresholds ────────────────────────────────────────────────
const PROMOTE_MIN_REVIEWS  = 3    // need at least N approved reviews
const PROMOTE_MIN_AVG      = 4.5  // avg ≥ this → feature the shop
const DEMOTE_MAX_AVG       = 4.0  // avg < this (with ≥ N reviews) → remove feature

function syncShopFeaturedStatus(shopId: string, approvedReviews: Review[]) {
  try {
    const shopsFile = join(process.cwd(), 'data', 'shops.json')
    if (!existsSync(shopsFile)) return

    const shopsData: { items: Record<string, unknown>[] } = JSON.parse(readFileSync(shopsFile, 'utf8'))
    const shopIdx = shopsData.items.findIndex(s => s.id === shopId)
    if (shopIdx === -1) return

    const shopReviews = approvedReviews.filter(r => r.itemId === shopId && r.itemType === 'shop')
    if (shopReviews.length < PROMOTE_MIN_REVIEWS) return  // not enough data yet

    const avg = shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length
    const shop = shopsData.items[shopIdx]

    if (avg >= PROMOTE_MIN_AVG && !shop.featured) {
      shopsData.items[shopIdx] = { ...shop, featured: true, autoFeatured: true }
      writeFileSync(shopsFile, JSON.stringify(shopsData, null, 2), 'utf8')
    } else if (avg < DEMOTE_MAX_AVG && shop.autoFeatured) {
      // Only auto-demote shops that were auto-promoted (don't touch manually featured)
      shopsData.items[shopIdx] = { ...shop, featured: false, autoFeatured: false }
      writeFileSync(shopsFile, JSON.stringify(shopsData, null, 2), 'utf8')
    }
  } catch {
    // Non-fatal — don't break the review approval
  }
}

function syncTransportFeaturedStatus(transportId: string, approvedReviews: Review[]) {
  try {
    const file = join(process.cwd(), 'data', 'transport.json')
    if (!existsSync(file)) return
    const data: { items: Record<string, unknown>[] } = JSON.parse(readFileSync(file, 'utf8'))
    const idx = data.items.findIndex(s => s.id === transportId)
    if (idx === -1) return
    const itemReviews = approvedReviews.filter(r => r.itemId === transportId && r.itemType === 'transport')
    if (itemReviews.length < PROMOTE_MIN_REVIEWS) return
    const avg = itemReviews.reduce((s, r) => s + r.rating, 0) / itemReviews.length
    const item = data.items[idx]
    if (avg >= PROMOTE_MIN_AVG && !item.featured) {
      data.items[idx] = { ...item, featured: true, autoFeatured: true }
      writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
    } else if (avg < DEMOTE_MAX_AVG && item.autoFeatured) {
      data.items[idx] = { ...item, featured: false, autoFeatured: false }
      writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
    }
  } catch { /* non-fatal */ }
}

const FILE = join(process.cwd(), 'data', 'reviews.json')

function readReviews(): { items: Review[] } {
  try {
    return JSON.parse(readFileSync(FILE, 'utf8'))
  } catch {
    return { items: [] }
  }
}

function writeReviews(data: { items: Review[] }) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8')
}

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get('ha_tinh_admin')
  return cookie?.value === 'authenticated'
}

// GET /api/reviews/[itemId]
// - returns approved reviews for itemId
// - ?admin=1 with valid cookie returns all reviews
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params
  const url = new URL(req.url)
  const adminMode = url.searchParams.get('admin') === '1' && isAdmin(req)
  const allMode = url.searchParams.get('all') === 'true' && isAdmin(req)

  const { items } = readReviews()

  if (allMode) {
    // Return all reviews across all items (for admin moderation page)
    return NextResponse.json({ items })
  }

  const filtered = items.filter(r => {
    if (r.itemId !== itemId) return false
    if (!adminMode && !r.approved) return false
    return true
  })

  return NextResponse.json({ items: filtered })
}

// POST /api/reviews/[itemId]
// Body: { itemId, itemType, authorName, rating, content }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params

  let body: {
    itemId?: string
    itemType?: string
    authorName?: string
    rating?: number
    content?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { itemType, authorName, rating, content } = body

  // Validate
  if (!itemType || !['tourism', 'cuisine', 'product', 'shop', 'transport'].includes(itemType)) {
    return NextResponse.json({ error: 'itemType phải là tourism, cuisine, product, shop hoặc transport' }, { status: 400 })
  }
  if (!authorName || authorName.trim().length < 2) {
    return NextResponse.json({ error: 'Tên tác giả phải có ít nhất 2 ký tự' }, { status: 400 })
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: 'Đánh giá phải là số nguyên từ 1 đến 5' }, { status: 400 })
  }
  if (!content || content.trim().length < 10) {
    return NextResponse.json({ error: 'Nội dung nhận xét phải có ít nhất 10 ký tự' }, { status: 400 })
  }

  const newReview: Review = {
    id: String(Date.now()),
    itemId,
    itemType: itemType as Review['itemType'],
    authorName: authorName.trim(),
    rating,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    approved: false,
  }

  const data = readReviews()
  data.items.push(newReview)
  writeReviews(data)

  return NextResponse.json({ review: newReview }, { status: 201 })
}

// PATCH /api/reviews/[itemId]
// Admin only - approve or reject a review
// Body: { reviewId, approved: boolean }
export async function PATCH(
  req: NextRequest,
  { params: _params }: { params: Promise<{ itemId: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { reviewId?: string; approved?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { reviewId, approved } = body

  if (!reviewId || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'reviewId và approved (boolean) là bắt buộc' }, { status: 400 })
  }

  const data = readReviews()
  const idx = data.items.findIndex(r => r.id === reviewId)

  if (idx === -1) {
    return NextResponse.json({ error: 'Không tìm thấy review' }, { status: 404 })
  }

  data.items[idx].approved = approved
  writeReviews(data)

  // After approval change, sync featured status for shop/transport items
  const updatedReview = data.items[idx]
  const allApproved = data.items.filter(r => r.approved)
  if (updatedReview.itemType === 'shop') {
    syncShopFeaturedStatus(updatedReview.itemId, allApproved)
  } else if (updatedReview.itemType === 'transport') {
    syncTransportFeaturedStatus(updatedReview.itemId, allApproved)
  }

  // Compute updated avg rating for the item to return to client
  const itemApproved = data.items.filter(r => r.itemId === updatedReview.itemId && r.approved)
  const avgRating = itemApproved.length
    ? itemApproved.reduce((s, r) => s + r.rating, 0) / itemApproved.length
    : 0

  return NextResponse.json({
    review: data.items[idx],
    stats: { count: itemApproved.length, avgRating: Math.round(avgRating * 10) / 10 },
  })
}
