export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Phone, Star, Navigation, MessageCircle, ChevronRight, UtensilsCrossed } from 'lucide-react'
import { getShopById, getShops } from '@/lib/server-data'
import GalleryGrid from '@/components/GalleryGrid'
import ReviewSection from '@/components/ReviewSection'

interface Props {
  params: Promise<{ id: string }>
}

const CATEGORY_COLORS: Record<string, string> = {
  'Ẩm thực': 'bg-red-100 text-red-700 border-red-200',
  'Đặc sản': 'bg-amber-100 text-amber-700 border-amber-200',
  'Nông sản': 'bg-green-100 text-green-700 border-green-200',
  'Đồ uống': 'bg-sky-100 text-sky-700 border-sky-200',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(rating) ? 'text-vn-gold-500 fill-vn-gold-500' : 'text-gray-200 fill-gray-200'} />
      ))}
      <span className="text-sm font-bold text-gray-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function ShopDetailPage({ params }: Props) {
  const { id } = await params
  const shop = getShopById(id)
  if (!shop) notFound()

  const allShops = getShops()
  const related = allShops.filter(s => s.id !== id).slice(0, 3)

  const catClass = CATEGORY_COLORS[shop.category] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/#gian-hang" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-vn-red-800 transition-colors">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm text-gray-400">Gian hàng</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm font-semibold text-gray-800 truncate">{shop.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[45vh] min-h-[300px]">
        <Image src={shop.image} alt={shop.name} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${catClass}`}>
              {shop.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">{shop.name}</h1>
            <StarRating rating={shop.rating} />
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
                <h2 className="text-xl font-bold text-gray-900">Giới thiệu</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{shop.description}</p>
              <div className="mt-4 bg-amber-50 border-l-4 border-vn-gold-500 rounded-r-xl px-5 py-3">
                <p className="text-amber-800 font-semibold text-sm">✦ Đặc sản nổi bật: {shop.specialty}</p>
              </div>
            </div>

            {/* Gallery */}
            {shop.gallery && shop.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-gold-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                </div>
                <GalleryGrid images={shop.gallery} alt={shop.name} />
              </div>
            )}

            {/* Menu */}
            {shop.menu && shop.menu.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-red-800 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Thực đơn / Sản phẩm</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                  {shop.menu.map((menuItem, i) => {
                    const [name, price] = menuItem.split(' – ')
                    return (
                      <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <UtensilsCrossed size={14} className="text-vn-gold-500 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{name}</span>
                        </div>
                        {price && (
                          <span className="text-sm font-bold text-vn-red-800 flex-shrink-0 ml-3">{price}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Thông tin liên hệ</h3>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-vn-red-800 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Địa chỉ</div>
                  <div className="text-sm text-gray-700">{shop.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-forest-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Giờ mở cửa</div>
                  <div className="text-sm text-gray-700">{shop.hours}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Điện thoại</div>
                  <div className="text-sm text-gray-700">{shop.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={16} className="text-vn-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Mức giá</div>
                  <div className="text-sm text-gray-700">{shop.priceRange}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={`tel:${shop.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 w-full bg-vn-red-800 hover:bg-vn-red-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
              >
                <Phone size={16} />
                Gọi ngay: {shop.phone}
              </a>
              {shop.zaloPhone && (
                <a
                  href={`https://zalo.me/${shop.zaloPhone.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
                >
                  <MessageCircle size={16} />
                  Chat Zalo
                </a>
              )}
              {shop.mapLink && (
                <a
                  href={shop.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-forest-700 text-forest-700 hover:bg-forest-50 font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
                >
                  <Navigation size={16} />
                  Chỉ đường tới đây
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-4">
          <ReviewSection itemId={id} itemType="shop" itemName={shop.name} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Gian hàng khác tại Hà Tĩnh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(s => (
                <Link key={s.id} href={`/shops/${s.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${CATEGORY_COLORS[s.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{s.category}</span>
                    <h3 className="font-bold text-gray-900 mt-2 group-hover:text-vn-red-800 transition-colors text-sm">{s.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="text-vn-gold-500 fill-vn-gold-500" />
                      <span className="text-xs text-gray-500">{s.rating}</span>
                    </div>
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
