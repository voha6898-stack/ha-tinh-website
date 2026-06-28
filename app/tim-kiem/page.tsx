'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Search, Loader2 } from 'lucide-react'

type ResultType = 'tourism' | 'cuisine' | 'product' | 'shop' | 'news'

type SearchResult = {
  id: string
  type: ResultType
  title: string
  subtitle: string
  href: string
  image: string
}

const TYPE_META: Record<ResultType, { label: string; icon: string }> = {
  tourism: { label: 'Du lịch',  icon: '🏛️' },
  cuisine: { label: 'Ẩm thực',  icon: '🍜' },
  product: { label: 'Đặc sản',  icon: '🛍️' },
  shop:    { label: 'Gian hàng', icon: '🏪' },
  news:    { label: 'Tin tức',   icon: '📰' },
}

const TYPE_ORDER: ResultType[] = ['tourism', 'cuisine', 'product', 'shop', 'news']

function TimKiemContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQ = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(urlQ)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const doSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([])
      setSearched(query.trim().length > 0)
      return
    }
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: ctrl.signal,
      })
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setResults(data.results ?? [])
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount if URL has q
  useEffect(() => {
    if (urlQ) {
      setInputValue(urlQ)
      doSearch(urlQ)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputValue.trim()
    if (q.length < 2) return
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`)
    doSearch(q)
  }

  // Group results by type
  const grouped = TYPE_ORDER.reduce<Record<ResultType, SearchResult[]>>(
    (acc, t) => {
      acc[t] = results.filter((r) => r.type === t)
      return acc
    },
    { tourism: [], cuisine: [], product: [], shop: [], news: [] }
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Tìm kiếm</h1>
            <p className="text-gray-500 text-sm">Khám phá du lịch, ẩm thực, đặc sản và tin tức Hà Tĩnh</p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm... (ít nhất 2 ký tự)"
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base outline-none"
                autoFocus
              />
              {loading && <Loader2 size={18} className="text-green-600 animate-spin flex-shrink-0" />}
              <button
                type="submit"
                disabled={inputValue.trim().length < 2 || loading}
                className="px-4 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* Results */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-base">Đang tìm kiếm…</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-gray-700 mb-1">Không tìm thấy kết quả</p>
              <p className="text-gray-400 text-sm">
                Thử từ khóa khác như &quot;biển&quot;, &quot;kẹo cu đơ&quot;, &quot;bưởi&quot;…
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-8">
              <p className="text-sm text-gray-500">
                Tìm thấy <span className="font-semibold text-gray-800">{results.length}</span> kết quả
                {urlQ && (
                  <> cho &quot;<span className="font-semibold text-green-700">{urlQ}</span>&quot;</>
                )}
              </p>

              {TYPE_ORDER.map((type) => {
                const group = grouped[type]
                if (group.length === 0) return null
                const meta = TYPE_META[type]
                return (
                  <section key={type}>
                    {/* Group header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{meta.icon}</span>
                      <h2 className="text-base font-bold text-gray-800">{meta.label}</h2>
                      <span className="text-xs text-gray-400 font-medium ml-1">({group.length})</span>
                    </div>

                    {/* Result cards */}
                    <ul className="space-y-2">
                      {group.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-green-200 hover:shadow-md transition-all duration-200 group"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  unoptimized={item.image.startsWith('/')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">
                                  {meta.icon}
                                </div>
                              )}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-700 transition-colors">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="text-xs text-gray-400 truncate mt-0.5">{item.subtitle}</p>
                              )}
                            </div>

                            {/* Arrow */}
                            <svg
                              className="w-4 h-4 text-gray-300 group-hover:text-green-500 flex-shrink-0 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}

          {/* Initial empty state */}
          {!loading && !searched && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-4">🔎</p>
              <p className="text-base">Nhập từ khóa để bắt đầu tìm kiếm</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function TimKiemPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-green-600" />
      </div>
    }>
      <TimKiemContent />
    </Suspense>
  )
}
