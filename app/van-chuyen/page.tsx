export const dynamic = 'force-dynamic'

import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AdSlot from '@/components/AdSlot'
import { Phone, MessageCircle, MapPin, Clock, Star, ShieldCheck, Users, Car, Search, CheckCircle } from 'lucide-react'

type TransportItem = {
  id: string; name: string; type: string; vehicle: string; seats: number
  phone: string; zalo: string; areas: string[]; description: string
  priceText: string; services: string[]; routes: string[]
  workingHours: string; image: string; verified: boolean
  featured: boolean; available: boolean; visible: boolean
}

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'taxi':       { label: 'Taxi',         color: 'text-yellow-700',  bg: 'bg-yellow-100' },
  'xe-dich-vu': { label: 'Xe dịch vụ',  color: 'text-blue-700',    bg: 'bg-blue-100'   },
  'lai-xe-ho':  { label: 'Lái xe hộ',   color: 'text-purple-700',  bg: 'bg-purple-100' },
  'xe-ghep':    { label: 'Xe ghép',      color: 'text-green-700',   bg: 'bg-green-100'  },
}

function readTransport(): TransportItem[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'data', 'transport.json'), 'utf8')).items ?? []
  } catch { return [] }
}

interface Props { searchParams: Promise<Record<string, string>> }

export default async function VanChuyenPage({ searchParams }: Props) {
  const sp = await searchParams
  const allItems = readTransport().filter(i => i.visible)

  let items = allItems
  if (sp.type && sp.type !== 'all') items = items.filter(i => i.type === sp.type)
  if (sp.q) {
    const q = sp.q.toLowerCase()
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.vehicle.toLowerCase().includes(q) ||
      i.areas.some(a => a.toLowerCase().includes(q)) ||
      i.services.some(s => s.toLowerCase().includes(q))
    )
  }
  if (sp.verified === '1') items = items.filter(i => i.verified)

  const featured = items.filter(i => i.featured)
  const normal   = items.filter(i => !i.featured)
  const activeType = sp.type ?? 'all'

  const TYPE_TABS = [
    { value: 'all',        label: 'Tất cả' },
    { value: 'taxi',       label: 'Taxi' },
    { value: 'xe-dich-vu', label: 'Xe dịch vụ' },
    { value: 'lai-xe-ho',  label: 'Lái xe hộ' },
    { value: 'xe-ghep',    label: 'Xe ghép' },
  ]

  function filterHref(patch: Record<string, string>) {
    const params = new URLSearchParams()
    const merged = { type: activeType, q: sp.q ?? '', verified: sp.verified ?? '', ...patch }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'all') params.set(k, v) })
    const s = params.toString()
    return `/van-chuyen${s ? `?${s}` : ''}`
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Car size={20} className="text-blue-300" />
            </div>
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">Vận chuyển Hà Tĩnh</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Taxi · Xe dịch vụ · Lái xe hộ</h1>
          <p className="text-slate-400 max-w-xl mb-6">Tìm tài xế uy tín, giá minh bạch tại Hà Tĩnh. Đánh giá thực từ khách hàng đã sử dụng dịch vụ.</p>

          {/* Search */}
          <form action="/van-chuyen" method="get" className="flex gap-2 max-w-xl">
            {activeType !== 'all' && <input type="hidden" name="type" value={activeType} />}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q" defaultValue={sp.q ?? ''}
                placeholder="Tìm theo tên, xe, khu vực..."
                className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm outline-none focus:bg-white/15 focus:border-white/40"
              />
            </div>
            <button type="submit" className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors">
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {TYPE_TABS.map(tab => (
            <Link key={tab.value} href={filterHref({ type: tab.value })}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeType === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-gray-100'
              }`}>
              {tab.label}
            </Link>
          ))}
          <div className="ml-auto flex-shrink-0">
            <Link href={filterHref({ verified: sp.verified === '1' ? '' : '1' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                sp.verified === '1' ? 'bg-green-600 text-white' : 'text-slate-500 border border-gray-200 hover:bg-gray-50'
              }`}>
              <ShieldCheck size={14} /> Đã xác minh
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 text-sm text-slate-500">
          <span>Tìm thấy <strong className="text-slate-800">{items.length}</strong> dịch vụ</span>
          {sp.q && <span>cho "<strong className="text-blue-600">{sp.q}</strong>"</span>}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <Car size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold">Không tìm thấy dịch vụ phù hợp</p>
            <Link href="/van-chuyen" className="mt-3 inline-block text-blue-600 hover:underline text-sm">Xem tất cả</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured */}
            {featured.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="font-black text-gray-900">Dịch vụ nổi bật</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.map(item => <TransportCard key={item.id} item={item} highlight />)}
                </div>
              </div>
            )}

            {/* Normal */}
            {normal.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Car size={16} className="text-slate-400" />
                    <span className="font-black text-gray-900">Tất cả dịch vụ</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {normal.map(item => <TransportCard key={item.id} item={item} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AdSlot slotId="global-prefooter" />
      <Footer />
    </div>
  )
}

function TransportCard({ item, highlight = false }: { item: TransportItem; highlight?: boolean }) {
  const typeInfo = TYPE_MAP[item.type] ?? { label: item.type, color: 'text-gray-700', bg: 'bg-gray-100' }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group ${
      highlight ? 'border-amber-200 ring-2 ring-amber-100' : 'border-gray-100 hover:border-blue-200'
    }`}>
      <div className="flex gap-0">
        {/* Image */}
        <div className="relative w-36 flex-shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="144px" />
          {item.verified && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ShieldCheck size={9} /> Đã xác minh
            </div>
          )}
          {highlight && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">⭐ Nổi bật</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={`/van-chuyen/${item.id}`} className="font-black text-gray-900 hover:text-blue-700 transition-colors text-sm leading-tight line-clamp-2">
              {item.name}
            </Link>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeInfo.bg} ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1"><Car size={11} /> {item.vehicle}</span>
            {item.seats > 0 && <span className="flex items-center gap-1"><Users size={11} /> {item.seats} chỗ</span>}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin size={11} />
            <span className="truncate">{item.areas.slice(0, 2).join(', ')}{item.areas.length > 2 ? '...' : ''}</span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Clock size={11} className="text-gray-400" />
            <span className="text-xs text-gray-500">{item.workingHours}</span>
            <span className="mx-1 text-gray-300">·</span>
            <span className="text-xs font-bold text-blue-700">{item.priceText}</span>
          </div>

          <div className="flex gap-1.5">
            <a href={`tel:${item.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Phone size={11} /> Gọi ngay
            </a>
            {item.zalo && (
              <a href={`https://zalo.me/${item.zalo}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                <MessageCircle size={11} /> Zalo
              </a>
            )}
            <Link href={`/van-chuyen/${item.id}`}
              className="ml-auto flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Chi tiết →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
