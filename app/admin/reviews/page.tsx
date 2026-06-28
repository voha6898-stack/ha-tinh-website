"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, MessageSquare, Star, Award, TrendingUp, ExternalLink } from 'lucide-react'
import { Review } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ShopItem = { id: string; name: string; featured?: boolean; autoFeatured?: boolean }

const ITEM_TYPE_LABELS: Record<string, string> = {
  tourism: '🏛️ Du Lịch',
  cuisine: '🍜 Ẩm Thực',
  product: '🛍️ Đặc Sản',
  shop:    '🏪 Gian Hàng',
}
const ITEM_TYPE_COLORS: Record<string, string> = {
  tourism: 'bg-sky-100 text-sky-700 border-sky-200',
  cuisine: 'bg-amber-100 text-amber-700 border-amber-200',
  product: 'bg-green-100 text-green-700 border-green-200',
  shop:    'bg-purple-100 text-purple-700 border-purple-200',
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </span>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

function ReviewCard({
  review, shopName, onApprove, onReject, updating, approvedStats,
}: {
  review: Review
  shopName?: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
  updating: string | null
  approvedStats?: { count: number; avgRating: number; wasPromoted?: boolean }
}) {
  const isUpdating = updating === review.id
  const isShop = review.itemType === 'shop'

  return (
    <div className={`border rounded-2xl p-4 transition-all ${
      review.approved
        ? 'border-green-200 bg-green-50/40'
        : 'border-amber-200 bg-amber-50/30'
    }`}>
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {review.authorName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 text-sm">{review.authorName}</span>
            <StarDisplay rating={review.rating} />
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${ITEM_TYPE_COLORS[review.itemType] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {ITEM_TYPE_LABELS[review.itemType] ?? review.itemType}
            </span>
          </div>

          {/* Shop name / item identifier */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 font-medium">
              {shopName || `#${review.itemId}`}
            </span>
            {isShop && (
              <a href={`/shops/${review.itemId}`} target="_blank" rel="noreferrer"
                className="text-slate-400 hover:text-blue-500 transition-colors">
                <ExternalLink size={11} />
              </a>
            )}
            <span className="text-xs text-slate-300">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!review.approved && (
            <button
              onClick={() => onApprove(review.id)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <CheckCircle size={13} /> Duyệt
            </button>
          )}
          {review.approved && (
            <button
              onClick={() => onReject(review.id)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-xs font-bold rounded-lg transition-colors"
            >
              <XCircle size={13} /> Ẩn
            </button>
          )}
          {!review.approved && (
            <button
              onClick={() => onReject(review.id)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-bold rounded-lg transition-colors"
            >
              <XCircle size={13} /> Từ chối
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-700 text-sm leading-relaxed ml-12">{review.content}</p>

      {/* Auto-promotion notice */}
      {approvedStats && approvedStats.wasPromoted && (
        <div className="ml-12 mt-3 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 rounded-lg px-3 py-2">
          <Award size={14} />
          Gian hàng vừa được tự động đề xuất! ({approvedStats.count} đánh giá · TB {approvedStats.avgRating}⭐)
        </div>
      )}
      {approvedStats && !approvedStats.wasPromoted && approvedStats.count > 0 && (
        <div className="ml-12 mt-3 flex items-center gap-2 text-xs text-slate-400">
          <TrendingUp size={12} />
          {approvedStats.count} đánh giá được duyệt · Điểm TB {approvedStats.avgRating}/5
        </div>
      )}
    </div>
  )
}

// Shop avg stats computed from all reviews
function computeShopStats(reviews: Review[]): Record<string, { count: number; avg: number }> {
  const stats: Record<string, { count: number; avg: number }> = {}
  const shopReviews = reviews.filter(r => r.itemType === 'shop' && r.approved)
  const grouped = shopReviews.reduce<Record<string, Review[]>>((acc, r) => {
    acc[r.itemId] = acc[r.itemId] ?? []
    acc[r.itemId].push(r)
    return acc
  }, {})
  for (const [id, rs] of Object.entries(grouped)) {
    stats[id] = {
      count: rs.length,
      avg: Math.round(rs.reduce((s, r) => s + r.rating, 0) / rs.length * 10) / 10,
    }
  }
  return stats
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [shops, setShops] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending')
  const [promotionNotices, setPromotionNotices] = useState<Record<string, boolean>>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/reviews/_all?all=true').then(r => r.ok ? r.json() : Promise.reject('auth')),
      fetch('/api/content/shops').then(r => r.json()),
    ])
      .then(([reviewData, shopData]) => {
        setReviews(reviewData.items ?? [])
        setShops(shopData.items ?? [])
      })
      .catch(() => setError('Không thể tải dữ liệu. Vui lòng đăng nhập lại.'))
      .finally(() => setLoading(false))
  }, [])

  const shopNames: Record<string, string> = shops.reduce((acc, s) => {
    acc[s.id] = s.name; return acc
  }, {} as Record<string, string>)

  const shopStats = computeShopStats(reviews)

  const patchReview = async (reviewId: string, approved: boolean) => {
    setUpdating(reviewId)
    const review = reviews.find(r => r.id === reviewId)
    if (!review) { setUpdating(null); return }

    try {
      const res = await fetch(`/api/reviews/${review.itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approved }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Lỗi khi cập nhật.')
        return
      }
      const result = await res.json()
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved } : r))

      // Track if shop got promoted this action
      if (review.itemType === 'shop' && approved && result.stats) {
        const { count, avgRating } = result.stats
        const wasPromoted = count >= 3 && avgRating >= 4.5
        if (wasPromoted) {
          setPromotionNotices(prev => ({ ...prev, [reviewId]: true }))
          setTimeout(() => setPromotionNotices(prev => { const n = { ...prev }; delete n[reviewId]; return n }), 8000)
        }
      }
    } catch {
      setError('Không thể kết nối máy chủ.')
    } finally {
      setUpdating(null)
    }
  }

  const handleApprove = (id: string) => patchReview(id, true)
  const handleReject  = (id: string) => patchReview(id, false)

  const pending  = reviews.filter(r => !r.approved)
  const approved = reviews.filter(r => r.approved)
  const displayList = activeTab === 'pending' ? pending : approved

  // Featured shops with review-driven stats
  const featuredShops = shops.filter(s => s.featured)

  const typeOrder: Array<Review['itemType']> = ['shop', 'tourism', 'cuisine', 'product']
  const grouped = displayList.reduce<Record<string, Review[]>>((acc, r) => {
    acc[r.itemType] = acc[r.itemType] ?? []; acc[r.itemType].push(r); return acc
  }, {})

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquare size={24} className="text-purple-600" />
          Quản lý Đánh giá
        </h1>
        <p className="text-slate-500 text-sm mt-1">Duyệt nhận xét · Gian hàng ≥ 4.5⭐ (min 3 đánh giá) sẽ tự động được đề xuất</p>
      </div>

      {/* Featured shops summary */}
      {featuredShops.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-amber-600" />
            <span className="font-bold text-amber-800">{featuredShops.length} Gian hàng đang được đề xuất</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {featuredShops.map(s => (
              <div key={s.id} className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs">
                <span className="font-semibold text-amber-800">{s.name}</span>
                {shopStats[s.id] && (
                  <span className="text-amber-600">{shopStats[s.id].avg}⭐ ({shopStats[s.id].count})</span>
                )}
                {s.autoFeatured && <span className="text-green-600 font-bold">AUTO</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <div className="text-3xl font-black text-amber-700">{pending.length}</div>
            <div className="text-amber-600 text-xs font-semibold">Chờ duyệt</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-3xl font-black text-green-700">{approved.length}</div>
            <div className="text-green-600 text-xs font-semibold">Đã duyệt</div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Award size={20} className="text-purple-600" />
          </div>
          <div>
            <div className="text-3xl font-black text-purple-700">{featuredShops.length}</div>
            <div className="text-purple-600 text-xs font-semibold">Được đề xuất</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(['pending', 'approved'] as const).map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-white border border-b-white border-slate-200 text-slate-800 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
            {tab === 'pending' && pending.length > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>
            )}
            {tab === 'approved' && (
              <span className="ml-1.5 text-slate-400 text-xs">({approved.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 text-sm mb-4">{error}</div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-slate-400 text-sm py-12 text-center">
          {activeTab === 'pending' ? '✅ Không có nhận xét nào đang chờ duyệt.' : 'Chưa có nhận xét nào được duyệt.'}
        </div>
      ) : (
        <div className="space-y-8">
          {typeOrder.map(type => {
            const group = grouped[type]
            if (!group?.length) return null
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold ${ITEM_TYPE_COLORS[type]}`}>
                    {ITEM_TYPE_LABELS[type]}
                  </span>
                  <span className="text-slate-400 text-xs">{group.length} nhận xét</span>
                </div>
                <div className="space-y-3">
                  {group.map(review => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      shopName={shopNames[review.itemId]}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      updating={updating}
                      approvedStats={
                        review.itemType === 'shop' && shopStats[review.itemId]
                          ? {
                              count: shopStats[review.itemId].count,
                              avgRating: shopStats[review.itemId].avg,
                              wasPromoted: promotionNotices[review.id],
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Needed for the inline Clock import used above
function Clock({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
