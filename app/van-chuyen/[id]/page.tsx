export const dynamic = 'force-dynamic'

import { readFileSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ReviewSection from '@/components/ReviewSection'
import { Phone, MessageCircle, MapPin, Clock, Star, ShieldCheck, Users, Car, ChevronLeft, CheckCircle, Route, Wrench } from 'lucide-react'

type TransportItem = {
  id: string; name: string; type: string; vehicle: string; seats: number
  licensePlate: string; phone: string; zalo: string; facebook: string
  areas: string[]; description: string; priceText: string; priceKm: number
  services: string[]; routes: string[]; workingHours: string
  image: string; gallery: string[]; verified: boolean
  featured: boolean; available: boolean; visible: boolean
}

const TYPE_MAP: Record<string, { label: string; color: string; bg: string; dark: string }> = {
  'taxi':       { label: 'Taxi',        color: 'text-yellow-700', bg: 'bg-yellow-100', dark: 'bg-yellow-500' },
  'xe-dich-vu': { label: 'Xe dịch vụ', color: 'text-blue-700',   bg: 'bg-blue-100',   dark: 'bg-blue-500'   },
  'lai-xe-ho':  { label: 'Lái xe hộ',  color: 'text-purple-700', bg: 'bg-purple-100', dark: 'bg-purple-500' },
  'xe-ghep':    { label: 'Xe ghép',     color: 'text-green-700',  bg: 'bg-green-100',  dark: 'bg-green-600'  },
}

function readTransport(): TransportItem[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'data', 'transport.json'), 'utf8')).items ?? []
  } catch { return [] }
}

interface Props { params: Promise<{ id: string }> }

export default async function TransportDetailPage({ params }: Props) {
  const { id } = await params
  const items = readTransport()
  const item = items.find(i => i.id === id && i.visible)
  if (!item) notFound()

  const typeInfo = TYPE_MAP[item.type] ?? { label: item.type, color: 'text-gray-700', bg: 'bg-gray-100', dark: 'bg-gray-500' }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero image banner */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-slate-900">
        <Image src={item.image} alt={item.name} fill className="object-cover opacity-60" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-5xl mx-auto">
          <Link href="/van-chuyen" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} /> Vận chuyển Hà Tĩnh
          </Link>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${typeInfo.dark} text-white`}>{typeInfo.label}</span>
            {item.verified && (
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-green-500 text-white">
                <ShieldCheck size={11} /> Đã xác minh
              </span>
            )}
            {item.featured && (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500 text-white">⭐ Nổi bật</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">{item.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Car size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Phương tiện</div>
                  <div className="font-bold text-sm text-gray-800">{item.vehicle}</div>
                </div>
              </div>
              {item.seats > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Số chỗ</div>
                    <div className="font-bold text-sm text-gray-800">{item.seats} chỗ</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Hoạt động</div>
                  <div className="font-bold text-sm text-gray-800">{item.workingHours}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-blue-500" />
                Giới thiệu
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{item.description}</p>
            </div>

            {/* Services */}
            {item.services.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench size={16} className="text-blue-500" /> Dịch vụ cung cấp
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.services.map((s, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Routes */}
            {item.routes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Route size={16} className="text-blue-500" /> Tuyến đường thường chạy
                </h2>
                <ul className="space-y-2">
                  {item.routes.map((r, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-blue-50 rounded-xl px-4 py-2.5">
                      <MapPin size={13} className="text-blue-500 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas */}
            {item.areas.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" /> Khu vực phục vụ
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.areas.map((a, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-xl">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {item.gallery.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-black text-gray-900 mb-4">Hình ảnh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img} alt={`${item.name} ${i+1}`} fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <ReviewSection itemId={item.id} itemType="transport" itemName={item.name} />
            </div>
          </div>

          {/* Contact sidebar */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-5">
                <div className="text-2xl font-black text-blue-700 mb-1">{item.priceText}</div>
                {item.priceKm > 0 && (
                  <div className="text-xs text-gray-400">{item.priceKm.toLocaleString('vi-VN')}đ/km</div>
                )}
              </div>

              <div className="space-y-3 mb-5">
                <a href={`tel:${item.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl transition-colors text-sm">
                  <Phone size={16} /> Gọi ngay: {item.phone}
                </a>
                {item.zalo && (
                  <a href={`https://zalo.me/${item.zalo}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 rounded-xl transition-colors text-sm">
                    <MessageCircle size={16} /> Chat Zalo
                  </a>
                )}
                {item.facebook && (
                  <a href={item.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-colors text-sm">
                    Facebook
                  </a>
                )}
              </div>

              {/* Info list */}
              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Car size={14} className="text-gray-400 flex-shrink-0" /> {item.vehicle}
                </div>
                {item.seats > 0 && (
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Users size={14} className="text-gray-400 flex-shrink-0" /> {item.seats} hành khách
                  </div>
                )}
                {item.licensePlate && (
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <div className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-gray-400">BKS</span>
                    </div>
                    {item.licensePlate}
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Clock size={14} className="text-gray-400 flex-shrink-0" /> {item.workingHours}
                </div>
                {item.verified && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 rounded-lg px-3 py-2">
                    <ShieldCheck size={14} /> Đã được xác minh
                  </div>
                )}
              </div>
            </div>

            {/* Safety note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
              <div className="font-bold mb-1">Lưu ý an toàn</div>
              Luôn thỏa thuận giá trước khi đi. Giữ biên lai hoặc xác nhận đặt xe qua Zalo để đảm bảo quyền lợi.
            </div>

            {/* Back link */}
            <Link href="/van-chuyen"
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold transition-colors">
              <ChevronLeft size={14} /> Xem thêm dịch vụ khác
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
