export const dynamic = 'force-dynamic'

import { readFileSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import { ArrowLeft, MapPin, BedDouble, Bath, Home, Ruler, ChevronRight, Phone, MessageCircle, Navigation as Nav, CheckCircle, Building2, Calendar, Tag } from 'lucide-react'

type BDSItem = {
  id: string; title: string; type: 'ban' | 'cho-thue'
  category: string; price: number; priceText: string
  area: number; bedrooms: number; bathrooms: number; floors: number
  address: string; district: string; description: string
  image: string; gallery: string[]; contactName: string; phone: string; zalo: string
  features: string[]; visible: boolean; featured: boolean
  status: string; postedAt: string; mapLink?: string
}

function readBDS(): BDSItem[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'data', 'realestate.json'), 'utf8')).items ?? []
  } catch { return [] }
}

function timeSince(iso: string) {
  const d = Date.now() - new Date(iso).getTime()
  const days = Math.floor(d / 86400000)
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  return `${days} ngày trước`
}

interface Props { params: Promise<{ id: string }> }

export default async function BDSDetailPage({ params }: Props) {
  const { id } = await params
  const all = readBDS()
  const item = all.find(i => i.id === id && i.visible)
  if (!item) notFound()

  const related = all.filter(i => i.id !== id && i.visible && i.category === item.category).slice(0, 3)
  const isRent = item.type === 'cho-thue'

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <Link href="/bat-dong-san" className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 transition-colors">
            <ArrowLeft size={16} /> Bất động sản
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="font-semibold text-gray-800 truncate">{item.title}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[320px] bg-gray-200">
        <Image src={item.image} alt={item.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-black px-3 py-1.5 rounded-full ${isRent?'bg-sky-500 text-white':'bg-green-600 text-white'}`}>
                {isRent ? 'CHO THUÊ' : 'MUA BÁN'}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {item.category}
              </span>
              {item.featured && <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 text-white">⭐ Tin nổi bật</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{item.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
              <MapPin size={14} /><span>{item.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
                <div className="text-2xl font-black text-green-700">{item.priceText}</div>
                <div className="text-xs text-green-600 font-semibold mt-0.5">{isRent?'Giá thuê':'Giá bán'}</div>
              </div>
              {item.area > 0 && (
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                  <div className="text-2xl font-black text-blue-700">{item.area}m²</div>
                  <div className="text-xs text-blue-600 font-semibold mt-0.5">Diện tích</div>
                </div>
              )}
              {item.bedrooms > 0 && (
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                  <div className="text-2xl font-black text-purple-700">{item.bedrooms}</div>
                  <div className="text-xs text-purple-600 font-semibold mt-0.5">Phòng ngủ</div>
                </div>
              )}
              {item.bathrooms > 0 && (
                <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-black text-amber-700">{item.bathrooms}</div>
                  <div className="text-xs text-amber-600 font-semibold mt-0.5">Nhà vệ sinh</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-green-600 rounded-full" />
                <h2 className="font-black text-gray-900">Mô tả chi tiết</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* Features */}
            {item.features.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-amber-500 rounded-full" />
                  <h2 className="font-black text-gray-900">Đặc điểm nổi bật</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {item.features.map(f => (
                    <div key={f} className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {item.gallery && item.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-sky-500 rounded-full" />
                  <h2 className="font-black text-gray-900">Hình ảnh thực tế</h2>
                </div>
                <GalleryGrid images={item.gallery} alt={item.title} />
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-20">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-black text-lg">
                  {item.contactName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.contactName}</div>
                  <div className="text-xs text-gray-400">Người đăng tin</div>
                </div>
              </div>

              <div className="space-y-4 mb-5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Địa chỉ</div>
                    <div className="text-sm text-gray-700">{item.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Khu vực</div>
                    <div className="text-sm text-gray-700">{item.district}</div>
                  </div>
                </div>
                {item.area > 0 && (
                  <div className="flex items-start gap-3">
                    <Ruler size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">Diện tích</div>
                      <div className="text-sm text-gray-700">{item.area} m²</div>
                    </div>
                  </div>
                )}
                {item.floors > 0 && (
                  <div className="flex items-start gap-3">
                    <Home size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">Số tầng</div>
                      <div className="text-sm text-gray-700">{item.floors} tầng</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Ngày đăng</div>
                    <div className="text-sm text-gray-700">{timeSince(item.postedAt)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <a href={`tel:${item.phone.replace(/\s/g,'')}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                  <Phone size={16} /> Gọi {item.phone}
                </a>
                {item.zalo && (
                  <a href={`https://zalo.me/${item.zalo}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                    <MessageCircle size={16} /> Chat Zalo
                  </a>
                )}
                {item.mapLink && (
                  <a href={item.mapLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 px-4 rounded-xl transition-colors text-sm">
                    <Nav size={16} /> Xem bản đồ
                  </a>
                )}
              </div>

              {/* Price per m² */}
              {item.area > 0 && item.price > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <div className="text-xs text-gray-400">Giá/m²</div>
                  <div className="font-black text-green-700">
                    {(item.price / item.area / 1_000_000).toFixed(1)} triệu/m²
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-xs text-yellow-800">
              <div className="font-bold mb-1">⚠️ Lưu ý khi giao dịch BĐS</div>
              <p>Luôn gặp trực tiếp, xem thực địa và kiểm tra pháp lý kỹ trước khi đặt cọc. Trang web không chịu trách nhiệm về nội dung tin đăng.</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-5">BĐS tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} href={`/bat-dong-san/${r.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-green-200 hover:shadow-md transition-all">
                  <div className="relative h-40 bg-gray-100">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className={`absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-lg ${r.type==='cho-thue'?'bg-sky-600 text-white':'bg-green-700 text-white'}`}>
                      {r.type==='cho-thue'?'CHO THUÊ':'BÁN'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-1">{r.title}</div>
                    <div className="text-green-700 font-black">{r.priceText}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/>{r.district}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
