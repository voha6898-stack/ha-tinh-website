export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/server-data'
import type { NewsArticle } from '@/lib/types'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, User, Tag, Newspaper, ChevronRight } from 'lucide-react'
import AdSlot from '@/components/AdSlot'

const CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  'dia-phuong': { label: 'Địa Phương', color: 'text-green-700', bg: 'bg-green-100' },
  'xa-hoi':     { label: 'Xã Hội',    color: 'text-blue-700',  bg: 'bg-blue-100'  },
  'chinh-tri':  { label: 'Chính Trị', color: 'text-red-700',   bg: 'bg-red-100'   },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ArticleCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  const cat = CATEGORIES[article.category]
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 flex flex-col ${featured ? 'lg:flex-row' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${featured ? 'lg:w-1/2 h-56 lg:h-auto' : 'h-48'}`}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          unoptimized={article.image.startsWith('/')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${cat.bg} ${cat.color}`}>
          {cat.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className={`font-black text-slate-900 group-hover:text-green-700 transition-colors leading-snug mb-2 ${featured ? 'text-xl lg:text-2xl' : 'text-base'}`}>
          {article.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><User size={11} />{article.author}</span>
            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(article.publishedAt)}</span>
          </div>
          <span className="text-green-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            Đọc tiếp <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allNews = getNews()
  const filtered = category ? allNews.filter(n => n.category === category) : allNews
  const [featured, ...rest] = filtered

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <Newspaper size={12} />
              Tin tức
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Tin Tức <span className="text-amber-400">Hà Tĩnh</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Cập nhật thông tin mới nhất về kinh tế, xã hội, văn hóa và chính trị tỉnh Hà Tĩnh
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/tin-tuc"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!category ? 'bg-green-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Tất cả ({allNews.length})
            </Link>
            {Object.entries(CATEGORIES).map(([key, val]) => {
              const c = allNews.filter(n => n.category === key).length
              return (
                <Link
                  key={key}
                  href={`/tin-tuc?category=${key}`}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${category === key ? 'bg-green-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {val.label} ({c})
                </Link>
              )
            })}
          </div>

          {/* Ad: banner trên grid bài viết */}
          <div className="py-3">
            <AdSlot slotId="news-top-banner" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
              <p>Chưa có bài viết nào trong mục này.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured article */}
              {featured && <ArticleCard article={featured} featured />}

              {/* Rest in grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <AdSlot slotId="global-prefooter" />
      <Footer />
    </>
  )
}
