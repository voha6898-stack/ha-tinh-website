'use client'

import { useEffect, useState } from 'react'
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp, Award } from 'lucide-react'

type Review = {
  id: string
  authorName: string
  rating: number
  content: string
  createdAt: string
}

const RATING_LABELS = ['', 'Kém', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc!']

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={36}
            className={`transition-colors ${
              i <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className={`text-sm font-bold ml-1 ${
          (hovered || value) >= 5 ? 'text-amber-500' :
          (hovered || value) >= 4 ? 'text-green-600' :
          (hovered || value) >= 3 ? 'text-blue-500' : 'text-red-400'
        }`}>
          {RATING_LABELS[hovered || value]}
        </span>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {review.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{review.authorName}</div>
            <div className="text-xs text-gray-400">{date}</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14}
              className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
        <ThumbsUp size={12} />
        <span className="font-semibold">Đã trải nghiệm thực tế</span>
      </div>
    </div>
  )
}

function RatingSummary({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const counts = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: Math.round(reviews.filter(r => r.rating === n).length / reviews.length * 100),
  }))

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-6">
        {/* Big number */}
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-black text-amber-600">{avg.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={14}
                className={i <= Math.round(avg) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">{reviews.length} đánh giá</div>
        </div>
        {/* Bar chart */}
        <div className="flex-1 space-y-1.5">
          {counts.map(({ n, count, pct }) => (
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-amber-700 font-bold">{n}</span>
              <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <div className="flex-1 bg-amber-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-5 text-amber-600 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {avg >= 4.5 && reviews.length >= 3 && (
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100 rounded-xl px-4 py-2.5">
          <Award size={18} className="text-amber-500" />
          Gian hàng được đề xuất — Đánh giá xuất sắc từ khách hàng thực tế!
        </div>
      )}
    </div>
  )
}

type Props = { shopId: string; shopName: string }

export default function ShopReviewSection({ shopId, shopName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [visited, setVisited] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews/${shopId}`)
      .then(r => r.json())
      .then(d => setReviews(d.items ?? []))
      .finally(() => setLoading(false))
  }, [shopId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) { setError('Vui lòng chọn số sao đánh giá'); return }
    if (!visited) { setError('Vui lòng xác nhận bạn đã đến trải nghiệm thực tế tại quán'); return }
    if (name.trim().length < 2) { setError('Vui lòng nhập tên của bạn (ít nhất 2 ký tự)'); return }
    if (content.trim().length < 20) { setError('Nhận xét cần ít nhất 20 ký tự'); return }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/reviews/${shopId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'shop',
          authorName: name.trim(),
          rating,
          content: content.trim(),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Gửi thất bại')
        return
      }
      setSubmitted(true)
      setShowForm(false)
      setName(''); setRating(0); setContent(''); setVisited(false)
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-amber-500 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
          {!loading && reviews.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
              {reviews.length} đánh giá
            </span>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <Star size={15} />
            Viết đánh giá
          </button>
        )}
      </div>

      {/* Rating summary */}
      {!loading && <RatingSummary reviews={reviews} />}

      {/* Success message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-green-800">Cảm ơn bạn đã đánh giá!</div>
            <div className="text-green-700 text-sm mt-0.5">
              Nhận xét của bạn sẽ được hiển thị sau khi được kiểm duyệt (thường trong 24 giờ).
            </div>
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <MessageSquare size={18} className="text-amber-500" />
            Viết đánh giá cho &ldquo;{shopName}&rdquo;
          </h3>
          <p className="text-xs text-gray-400 mb-5">Đánh giá trung thực giúp cộng đồng chọn được địa chỉ tốt nhất</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Đánh giá tổng thể <span className="text-red-500">*</span>
              </label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Tên của bạn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                maxLength={60}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-gray-300"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Nhận xét chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn — đồ ăn, phục vụ, không gian, giá cả... (ít nhất 20 ký tự)"
                rows={4}
                maxLength={1000}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none placeholder:text-gray-300"
              />
              <div className="text-right text-xs text-gray-300 mt-1">{content.length}/1000</div>
            </div>

            {/* Visited confirmation */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={visited}
                  onChange={e => setVisited(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  visited ? 'bg-amber-500 border-amber-500' : 'border-gray-300 group-hover:border-amber-400'
                }`}>
                  {visited && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold">Tôi xác nhận đã đến trải nghiệm thực tế</span> tại quán này
                theo thông tin từ website <span className="text-amber-600 font-semibold">Hà Tĩnh Có Gì?</span>
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors"
              >
                <Send size={15} />
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError('') }}
                className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <Star size={32} className="mx-auto text-gray-200 fill-gray-200 mb-3" />
          <p className="text-gray-500 font-semibold text-sm">Chưa có đánh giá nào</p>
          <p className="text-gray-400 text-xs mt-1">Hãy là người đầu tiên chia sẻ trải nghiệm!</p>
          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Viết đánh giá ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </section>
  )
}
