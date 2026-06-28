export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, BadgeCheck, Utensils, ShoppingBag, ChevronRight, Star } from 'lucide-react'
import { getCuisineById, getCuisine } from '@/lib/server-data'
import GalleryGrid from '@/components/GalleryGrid'
import ReviewSection from '@/components/ReviewSection'
import AdSlot from '@/components/AdSlot'

interface Props {
  params: Promise<{ id: string }>
}

const BADGE_COLORS: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default async function CuisineDetailPage({ params }: Props) {
  const { id } = await params
  const item = getCuisineById(id)
  if (!item) notFound()

  const allCuisine = getCuisine()
  const related = allCuisine.filter(c => c.id !== id).slice(0, 3)

  const badgeClass = BADGE_COLORS[item.badgeColor] || BADGE_COLORS.amber

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/#am-thuc" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-vn-red-800 transition-colors">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm text-gray-400">Ẩm thực</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm font-semibold text-gray-800 truncate">{item.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[340px]">
        <Image src={item.image} alt={item.name} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${badgeClass}`}>
              {item.badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">{item.name}</h1>
            <p className="text-white/80 text-sm font-medium">{item.type}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-vn-red-800 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Giới thiệu món</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Gallery */}
            {item.gallery && item.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-gold-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                </div>
                <GalleryGrid images={item.gallery} alt={item.name} />
              </div>
            )}

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-green-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Nguyên liệu chính</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, i) => (
                    <span key={i} className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Where to eat */}
            {item.whereToEat && item.whereToEat.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-red-800 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Ăn ở đâu ngon nhất?</h2>
                </div>
                <div className="space-y-2">
                  {item.whereToEat.map((place, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-vn-red-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{place}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Thông tin nhanh</h3>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-vn-red-800 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Xuất xứ</div>
                  <div className="text-sm text-gray-700">{item.origin}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-vn-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Mùa ngon nhất</div>
                  <div className="text-sm text-gray-700">{item.season}</div>
                </div>
              </div>
              {item.price && (
                <div className="flex items-start gap-3">
                  <ShoppingBag size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Mức giá</div>
                    <div className="text-sm text-gray-700">{item.price}</div>
                  </div>
                </div>
              )}
              {item.pairsWith && (
                <div className="flex items-start gap-3">
                  <Utensils size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Ăn kèm ngon với</div>
                    <div className="text-sm text-gray-700">{item.pairsWith}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Ad: sidebar rectangle */}
            <AdSlot slotId="detail-sidebar" />

            <div className="bg-vn-red-800/5 border border-vn-red-800/15 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-vn-gold-500" fill="currentColor" />
                <span className="text-xs font-bold text-vn-red-800">Đặc sản Hà Tĩnh</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Đây là một trong những đặc sản ẩm thực đặc trưng của Hà Tĩnh, mang đậm bản sắc văn hóa địa phương.
              </p>
            </div>

            <Link
              href="/#gian-hang"
              className="flex items-center justify-center gap-2 w-full bg-vn-red-800 hover:bg-vn-red-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
            >
              <Utensils size={16} />
              Tìm quán ăn ngay
            </Link>
          </div>
        </div>

        {/* Ad: banner trước reviews */}
        <div className="py-4">
          <AdSlot slotId="detail-bottom-banner" />
        </div>

        {/* Reviews */}
        <ReviewSection itemId={id} itemType="cuisine" itemName={item.name} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Ẩm thực khác bạn sẽ thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(c => (
                <Link key={c.id} href={`/cuisine/${c.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-red-200 hover:shadow-md transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${BADGE_COLORS[c.badgeColor] || BADGE_COLORS.amber}`}>{c.badge}</span>
                    <h3 className="font-bold text-gray-900 mt-2 group-hover:text-vn-red-800 transition-colors">{c.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{c.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
