"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Props {
  articleId: string
  initialAverage?: number
  initialCount?: number
}

export default function StarRating({ articleId, initialAverage = 0, initialCount = 0 }: Props) {
  const [average, setAverage] = useState(initialAverage)
  const [count, setCount] = useState(initialCount)
  const [hovered, setHovered] = useState(0)
  const [voted, setVoted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [justVoted, setJustVoted] = useState(false)

  const storageKey = `rating_${articleId}`

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVoted(!!localStorage.getItem(storageKey))
    }
  }, [storageKey])

  const handleVote = async (score: number) => {
    if (voted || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/ratings/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      })
      const data = await res.json()
      setAverage(data.average)
      setCount(data.count)
      setVoted(true)
      setJustVoted(true)
      localStorage.setItem(storageKey, String(score))
      setTimeout(() => setJustVoted(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  const display = hovered > 0 && !voted ? hovered : average

  return (
    <div className="flex flex-col items-center gap-3 py-6 px-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10">
      <p className="text-white/60 text-sm font-medium">
        {voted ? (justVoted ? '✨ Cảm ơn bạn đã đánh giá!' : 'Bạn đã đánh giá bài viết này') : 'Bạn thấy bài viết này thế nào?'}
      </p>

      {/* Stars */}
      <div
        className="flex gap-1.5"
        onMouseLeave={() => !voted && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= (voted ? average : (hovered || 0))
          const halfFilled = !filled && star <= display + 0.5

          return (
            <button
              key={star}
              disabled={voted || submitting}
              onClick={() => handleVote(star)}
              onMouseEnter={() => !voted && setHovered(star)}
              className={`transition-all duration-150 ${voted ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
              title={voted ? undefined : `${star} sao`}
            >
              <Star
                size={32}
                className={`transition-colors duration-150 ${
                  star <= Math.floor(display)
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-transparent text-white/20'
                } ${!voted && hovered >= star ? 'fill-amber-300 text-amber-300' : ''}`}
              />
            </button>
          )
        })}
      </div>

      {/* Score display */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-amber-400 font-black text-2xl">
          {average > 0 ? average.toFixed(1) : '—'}
        </span>
        <div className="text-left">
          <p className="text-white/80 font-semibold text-xs">/ 5.0</p>
          <p className="text-white/40 text-xs">{count} lượt đánh giá</p>
        </div>
      </div>

      {!voted && (
        <p className="text-white/30 text-xs">Click vào sao để đánh giá</p>
      )}
    </div>
  )
}
