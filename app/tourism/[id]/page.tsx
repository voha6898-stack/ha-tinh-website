export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Ticket, Sun, Lightbulb, Navigation, Share2, ChevronRight } from 'lucide-react'
import { getTourismById, getTourism } from '@/lib/server-data'
import GalleryGrid from '@/components/GalleryGrid'
import ReviewSection from '@/components/ReviewSection'
import AdSlot from '@/components/AdSlot'

interface Props {
  params: Promise<{ id: string }>
}

const TAG_COLORS: Record<string, string> = {
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default async function TourismDetailPage({ params }: Props) {
  const { id } = await params
  const spot = getTourismById(id)
  if (!spot) notFound()

  const allSpots = getTourism()
  const related = allSpots.filter(s => s.id !== id).slice(0, 3)

  const tagClass = TAG_COLORS[spot.tagColor] || TAG_COLORS.sky

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/#du-lich" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-forest-800 transition-colors">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm text-gray-400">Du lịch</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm font-semibold text-gray-800 truncate">{spot.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px]">
        <Image
          src={spot.image}
          alt={spot.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${tagClass}`}>
              {spot.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">{spot.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin size={14} className="flex-shrink-0" />
              <span>{spot.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-vn-red-800 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Giới thiệu</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">{spot.description}</p>
              {spot.highlight && (
                <div className="mt-4 bg-forest-100 border-l-4 border-forest-700 rounded-r-xl px-5 py-3">
                  <p className="text-forest-800 font-semibold italic">✦ {spot.highlight}</p>
                </div>
              )}
            </div>

            {/* Gallery */}
            {spot.gallery && spot.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-gold-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                </div>
                <GalleryGrid images={spot.gallery} alt={spot.name} />
              </div>
            )}

            {/* Tips */}
            {spot.tips && spot.tips.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-amber-400 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Bí kíp du lịch</h2>
                </div>
                <div className="space-y-3">
                  {spot.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick info */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Thông tin nhanh</h3>
              {spot.openHours && (
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-forest-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">Giờ mở cửa</div>
                    <div className="text-sm text-gray-700">{spot.openHours}</div>
                  </div>
                </div>
              )}
              {spot.ticketPrice && (
                <div className="flex items-start gap-3">
                  <Ticket size={16} className="text-vn-red-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">Giá vé</div>
                    <div className="text-sm text-gray-700">{spot.ticketPrice}</div>
                  </div>
                </div>
              )}
              {spot.bestTime && (
                <div className="flex items-start gap-3">
                  <Sun size={16} className="text-vn-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">Thời điểm tốt nhất</div>
                    <div className="text-sm text-gray-700">{spot.bestTime}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Địa điểm</div>
                  <div className="text-sm text-gray-700">{spot.location}</div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              {spot.mapLink && (
                <a
                  href={spot.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-forest-800 hover:bg-forest-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
                >
                  <Navigation size={16} />
                  Xem trên Google Maps
                </a>
              )}
              <Link
                href="/#gian-hang"
                className="flex items-center justify-center gap-2 w-full border border-forest-700 text-forest-700 hover:bg-forest-50 font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
              >
                Tìm quán ăn gần đây
              </Link>
            </div>

            {/* Ad: sidebar rectangle */}
            <AdSlot slotId="detail-sidebar" />

            {/* Share */}
            <div className="bg-vn-gold-300/15 border border-vn-gold-400/25 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Chia sẻ điểm đến này</p>
              <div className="flex justify-center gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hatinh.vn/tourism/${spot.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://zalo.me/share?url=${encodeURIComponent(`https://hatinh.vn/tourism/${spot.id}`)}&text=${encodeURIComponent(spot.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Zalo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ad: banner trước reviews */}
        <div className="py-4">
          <AdSlot slotId="detail-bottom-banner" />
        </div>

        {/* Reviews */}
        <ReviewSection itemId={id} itemType="tourism" itemName={spot.name} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Điểm đến khác tại Hà Tĩnh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(s => (
                <Link key={s.id} href={`/tourism/${s.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-forest-200 hover:shadow-md transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${TAG_COLORS[s.tagColor] || TAG_COLORS.sky}`}>{s.tag}</span>
                    <h3 className="font-bold text-gray-900 mt-2 group-hover:text-forest-800 transition-colors">{s.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={11} />{s.location.split('—')[0]}</p>
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
