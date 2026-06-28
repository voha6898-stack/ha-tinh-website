'use client'

import { useState, useEffect } from 'react'
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp, Award } from 'lucide-react'
import { Review } from '@/lib/types'

type ItemType = 'tourism' | 'cuisine' | 'product' | 'shop' | 'transport'

const VISITED_TEXT: Record<ItemType, string> = {
  shop:      'Tôi xác nhận đã đến trải nghiệm thực tế tại quán này',
  tourism:   'Tôi xác nhận đã ghé thăm địa điểm này',
  cuisine:   'Tôi xác nhận đã thưởng thức món ăn này tại Hà Tĩnh',
  product:   'Tôi xác nhận đã mua và sử dụng sản phẩm này',
  transport: 'Tôi xác nhận đã sử dụng dịch vụ vận chuyển này',
}
const RATING_LABELS = ['', 'Kém', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc!']
const BTN_COLOR: Record<ItemType, string> = {
  shop:      'bg-amber-500 hover:bg-amber-400',
  tourism:   'bg-sky-600 hover:bg-sky-500',
  cuisine:   'bg-red-700 hover:bg-red-600',
  product:   'bg-green-700 hover:bg-green-600',
  transport: 'bg-blue-600 hover:bg-blue-500',
}
const ACCENT_BAR: Record<ItemType, string> = {
  shop: 'bg-amber-500', tourism: 'bg-sky-500', cuisine: 'bg-red-700', product: 'bg-green-600', transport: 'bg-blue-600',
}
const SUMMARY_BG: Record<ItemType, string> = {
  shop: 'bg-amber-50 border-amber-200', tourism: 'bg-sky-50 border-sky-200',
  cuisine: 'bg-red-50 border-red-200', product: 'bg-green-50 border-green-200',
  transport: 'bg-blue-50 border-blue-200',
}
const SUMMARY_NUM: Record<ItemType, string> = {
  shop: 'text-amber-600', tourism: 'text-sky-600', cuisine: 'text-red-700', product: 'text-green-600', transport: 'text-blue-600',
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95">
          <Star size={34} className={`transition-colors ${i <= (hovered || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className={`text-sm font-bold ml-1 ${(hovered||value)>=5?'text-amber-500':(hovered||value)>=4?'text-green-600':(hovered||value)>=3?'text-blue-500':'text-red-400'}`}>
          {RATING_LABELS[hovered || value]}
        </span>
      )}
    </div>
  )
}

function RatingSummary({ reviews, itemType }: { reviews: Review[]; itemType: ItemType }) {
  if (!reviews.length) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const counts = [5,4,3,2,1].map(n => ({
    n, count: reviews.filter(r => r.rating === n).length,
    pct: Math.round(reviews.filter(r => r.rating === n).length / reviews.length * 100),
  }))
  return (
    <div className={`rounded-2xl p-5 mb-6 border ${SUMMARY_BG[itemType]}`}>
      <div className="flex items-center gap-6">
        <div className="text-center flex-shrink-0">
          <div className={`text-5xl font-black ${SUMMARY_NUM[itemType]}`}>{avg.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(i=>(
              <Star key={i} size={13} className={i<=Math.round(avg)?'text-amber-400 fill-amber-400':'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <div className="text-xs font-semibold mt-1 text-gray-500">{reviews.length} đánh giá</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {counts.map(({n,count,pct})=>(
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-gray-600 font-bold">{n}</span>
              <Star size={9} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{width:`${pct}%`}} />
              </div>
              <span className="w-4 text-gray-400 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
      {(itemType === 'shop' || itemType === 'transport') && avg >= 4.5 && reviews.length >= 3 && (
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100 rounded-xl px-4 py-2.5">
          <Award size={16} className="text-amber-500" />
          {itemType === 'transport' ? 'Tài xế được đề xuất — Đánh giá xuất sắc từ hành khách thực tế!' : 'Gian hàng được đề xuất — Đánh giá xuất sắc từ khách hàng thực tế!'}
        </div>
      )}
    </div>
  )
}

interface Props { itemId: string; itemType: ItemType; itemName: string }

export default function ReviewSection({ itemId, itemType, itemName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')
  const [name, setName]         = useState('')
  const [rating, setRating]     = useState(0)
  const [content, setContent]   = useState('')
  const [visited, setVisited]   = useState(false)

  useEffect(() => {
    fetch(`/api/reviews/${itemId}`)
      .then(r => r.json())
      .then(d => setReviews(d.items ?? []))
      .finally(() => setLoading(false))
  }, [itemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!rating)              { setError('Vui lòng chọn số sao đánh giá'); return }
    if (!visited)             { setError('Vui lòng xác nhận đã trải nghiệm thực tế'); return }
    if (name.trim().length<2) { setError('Vui lòng nhập tên (ít nhất 2 ký tự)'); return }
    if (content.trim().length<10){ setError('Nhận xét cần ít nhất 10 ký tự'); return }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/reviews/${itemId}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ itemType, authorName: name.trim(), rating, content: content.trim() }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Gửi thất bại'); return }
      setSubmitted(true); setShowForm(false)
      setName(''); setRating(0); setContent(''); setVisited(false)
    } catch { setError('Không thể kết nối. Vui lòng thử lại.') }
    finally   { setSubmitting(false) }
  }

  const btn = BTN_COLOR[itemType]
  const bar = ACCENT_BAR[itemType]

  return (
    <section className="mt-12 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-6 rounded-full ${bar}`} />
          <h2 className="text-xl font-bold text-gray-900">Đánh giá từ cộng đồng</h2>
          {!loading && reviews.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-bold">{reviews.length}</span>
          )}
        </div>
        {!showForm && !submitted && (
          <button onClick={() => setShowForm(true)}
            className={`flex items-center gap-2 px-4 py-2 ${btn} text-white rounded-xl text-sm font-bold transition-colors shadow-sm`}>
            <Star size={14} /> Viết đánh giá
          </button>
        )}
      </div>

      {!loading && <RatingSummary reviews={reviews} itemType={itemType} />}

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <CheckCircle size={22} className="text-green-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-green-800">Cảm ơn bạn đã đánh giá!</div>
            <div className="text-green-700 text-sm mt-0.5">Nhận xét hiển thị sau khi được kiểm duyệt (trong 24h).</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <MessageSquare size={17} className="text-gray-500" /> Đánh giá &ldquo;{itemName}&rdquo;
          </h3>
          <p className="text-xs text-gray-400 mb-5">Đánh giá thực tế giúp cộng đồng có lựa chọn tốt hơn</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Đánh giá <span className="text-red-500">*</span></label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên của bạn <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="VD: Nguyễn Văn A" maxLength={60}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nhận xét <span className="text-red-500">*</span></label>
              <textarea value={content} onChange={e=>setContent(e.target.value)} rows={4} maxLength={1000}
                placeholder={itemType==='shop'?'Đồ ăn, phục vụ, không gian, giá cả... (ít nhất 10 ký tự)':itemType==='tourism'?'Phong cảnh, cơ sở vật chất, trải nghiệm... (ít nhất 10 ký tự)':itemType==='transport'?'Xe sạch sẽ, tài xế thân thiện, đúng giờ, giá cả... (ít nhất 10 ký tự)':'Hương vị, giá cả, nơi mua... (ít nhất 10 ký tự)'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder:text-gray-300" />
              <div className="text-right text-xs text-gray-300 mt-1">{content.length}/1000</div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={visited} onChange={e=>setVisited(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${visited?'bg-green-500 border-green-500':'border-gray-300 group-hover:border-green-400'}`}>
                  {visited && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold">{VISITED_TEXT[itemType]}</span>
                {' '}theo gợi ý của <span className="text-green-700 font-semibold">Hà Tĩnh Có Gì?</span>
              </span>
            </label>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className={`flex items-center gap-2 px-6 py-2.5 ${btn} disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors`}>
                <Send size={14} />{submitting?'Đang gửi...':'Gửi đánh giá'}
              </button>
              <button type="button" onClick={()=>{setShowForm(false);setError('')}}
                className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2].map(i=><div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          <Star size={28} className="mx-auto text-gray-200 fill-gray-200 mb-2" />
          <p className="text-gray-500 font-semibold text-sm">Chưa có đánh giá nào</p>
          <p className="text-gray-400 text-xs mt-1">Hãy là người đầu tiên chia sẻ trải nghiệm!</p>
          {!showForm && !submitted && (
            <button onClick={()=>setShowForm(true)} className={`mt-3 px-5 py-2 ${btn} text-white rounded-xl text-sm font-bold transition-colors`}>
              Viết đánh giá ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {r.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{r.authorName}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'})}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i=>(
                    <Star key={i} size={13} className={i<=r.rating?'text-amber-400 fill-amber-400':'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{r.content}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
                <ThumbsUp size={11} /><span className="font-semibold">Đã xác nhận trải nghiệm thực tế</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
