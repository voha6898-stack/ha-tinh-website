export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getNewsBySlug, getNews } from '@/lib/server-data'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StarRating from '@/components/StarRating'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Calendar, User, Tag, ChevronRight, ArrowLeft, Newspaper, Share2 } from 'lucide-react'

const CATEGORIES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'dia-phuong': { label: 'Địa Phương', color: 'text-green-700', bg: 'bg-green-100',  border: 'border-green-200' },
  'xa-hoi':     { label: 'Xã Hội',    color: 'text-blue-700',  bg: 'bg-blue-100',   border: 'border-blue-200'  },
  'chinh-tri':  { label: 'Chính Trị', color: 'text-red-700',   bg: 'bg-red-100',    border: 'border-red-200'   },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

function getRatingData(articleId: string): { average: number; count: number } {
  try {
    const all: Record<string, { total: number; count: number }> = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'ratings.json'), 'utf8')
    )
    const r = all[articleId]
    if (!r || r.count === 0) return { average: 0, count: 0 }
    return { average: Math.round((r.total / r.count) * 10) / 10, count: r.count }
  } catch { return { average: 0, count: 0 } }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getNewsBySlug(slug)
  if (!article) notFound()

  const cat = CATEGORIES[article.category]
  const rating = getRatingData(article.id)

  // Related articles (same category, exclude current)
  const related = getNews()
    .filter(n => n.id !== article.id && n.category === article.category)
    .slice(0, 3)

  // Render content: split by double newline → paragraphs
  const paragraphs = article.content.split(/\n\n+/).filter(Boolean)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">

        {/* Hero image */}
        <div className="relative h-72 md:h-[420px] bg-slate-900 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
            unoptimized={article.image.startsWith('/')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 px-4 md:px-8">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-white/60 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight size={13} />
              <Link href="/tin-tuc" className="hover:text-white transition-colors">Tin tức</Link>
              <ChevronRight size={13} />
              <span className={`${cat.color.replace('text-', 'text-')} font-semibold`}>{cat.label}</span>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8">
            <div className="max-w-4xl mx-auto">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${cat.bg} ${cat.color}`}>
                {cat.label}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-b border-gray-200 pb-5">
                <span className="flex items-center gap-1.5"><User size={13} />{article.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(article.publishedAt)}</span>
                {rating.count > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                    ★ {rating.average.toFixed(1)} ({rating.count} đánh giá)
                  </span>
                )}
              </div>

              {/* Excerpt highlight */}
              <blockquote className="border-l-4 border-green-500 bg-green-50 px-5 py-4 rounded-r-xl text-green-900 text-base font-medium leading-relaxed italic">
                {article.excerpt}
              </blockquote>

              {/* Content paragraphs */}
              <div className="prose prose-slate max-w-none space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-slate-700 leading-[1.85] text-base">
                    {p}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Tag size={14} className="text-slate-400 mt-0.5" />
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium hover:bg-slate-200 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating section */}
              <div className="pt-6">
                <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-amber-400">★</span>
                  Đánh giá bài viết
                </h3>
                <StarRating
                  articleId={article.id}
                  initialAverage={rating.average}
                  initialCount={rating.count}
                />
              </div>

              {/* Back link */}
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-sm transition-colors"
              >
                <ArrowLeft size={14} />
                Quay lại trang tin tức
              </Link>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current rating card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-2">
                  <Newspaper size={14} className="text-green-600" />
                  Về bài viết này
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Danh mục</span>
                    <span className={`font-semibold ${cat.color}`}>{cat.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tác giả</span>
                    <span className="font-semibold">{article.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đánh giá</span>
                    <span className="font-semibold text-amber-600">
                      {rating.average > 0 ? `${rating.average.toFixed(1)}/5 ★` : 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lượt đánh giá</span>
                    <span className="font-semibold">{rating.count}</span>
                  </div>
                </div>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="text-sm font-black text-slate-700 mb-4">Bài viết liên quan</h4>
                  <div className="space-y-4">
                    {related.map(rel => (
                      <Link key={rel.id} href={`/tin-tuc/${rel.slug}`} className="flex gap-3 group">
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          <Image src={rel.image} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform"
                            sizes="64px" unoptimized={rel.image.startsWith('/')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 font-semibold leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                            {rel.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">{formatDate(rel.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
