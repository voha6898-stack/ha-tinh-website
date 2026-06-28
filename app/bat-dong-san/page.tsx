export const dynamic = 'force-dynamic'

import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { MapPin, BedDouble, Bath, SquareArrowOutUpRight, Phone, Search, Building2, Home, Landmark, Store, Tag } from 'lucide-react'
import AdSlot from '@/components/AdSlot'

type BDSItem = {
  id: string; title: string; type: 'ban' | 'cho-thue'
  category: string; price: number; priceText: string
  area: number; bedrooms: number; bathrooms: number; floors: number
  address: string; district: string; description: string
  image: string; contactName: string; phone: string
  features: string[]; visible: boolean; featured: boolean
  status: string; postedAt: string
}

function readBDS(): BDSItem[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'realestate.json'), 'utf8')
    return (JSON.parse(raw).items ?? []).filter((i: BDSItem) => i.visible && i.status === 'active')
  } catch { return [] }
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  'Nhà ở':       <Home size={14} />,
  'Đất nền':     <Landmark size={14} />,
  'Căn hộ':      <Building2 size={14} />,
  'Mặt bằng KD': <Store size={14} />,
  'Nhà trọ':     <Tag size={14} />,
}

function formatPrice(p: number) {
  if (p >= 1_000_000_000) return (p / 1_000_000_000).toFixed(p % 1_000_000_000 === 0 ? 0 : 1) + ' tỷ'
  if (p >= 1_000_000)     return (p / 1_000_000).toFixed(0) + ' triệu'
  return p.toLocaleString('vi-VN') + 'đ'
}

function timeSince(iso: string) {
  const d = Date.now() - new Date(iso).getTime()
  const days = Math.floor(d / 86400000)
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  return `${days} ngày trước`
}

export default async function BatDongSanPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; cat?: string; district?: string; q?: string }>
}) {
  const sp = await searchParams
  const allItems = readBDS()

  // Filters
  let items = allItems
  if (sp.type && sp.type !== 'all') items = items.filter(i => i.type === sp.type)
  if (sp.cat)                       items = items.filter(i => i.category === sp.cat)
  if (sp.district)                  items = items.filter(i => i.district === sp.district)
  if (sp.q)                         items = items.filter(i =>
    i.title.toLowerCase().includes(sp.q!.toLowerCase()) ||
    i.address.toLowerCase().includes(sp.q!.toLowerCase()) ||
    i.description.toLowerCase().includes(sp.q!.toLowerCase())
  )

  const featured = items.filter(i => i.featured)
  const normal   = items.filter(i => !i.featured)

  const categories = Array.from(new Set(allItems.map(i => i.category)))
  const districts  = Array.from(new Set(allItems.map(i => i.district)))

  const activeType   = sp.type ?? 'all'
  const activeCat    = sp.cat ?? ''
  const activeDistrict = sp.district ?? ''

  function filterHref(patch: Record<string, string>) {
    const params = new URLSearchParams()
    const merged = { type: activeType, cat: activeCat, district: activeDistrict, q: sp.q ?? '', ...patch }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'all') params.set(k, v) })
    const s = params.toString()
    return `/bat-dong-san${s ? `?${s}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs font-black uppercase tracking-widest text-green-300 border border-green-500/40 px-4 py-1.5 rounded-full mb-4">
              BẤT ĐỘNG SẢN · HÀ TĨNH
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Mua, Bán & Cho Thuê BĐS</h1>
            <p className="text-green-200 text-sm">Tin đăng uy tín từ chính chủ tại Hà Tĩnh</p>
          </div>

          {/* Search bar */}
          <form action="/bat-dong-san" className="max-w-2xl mx-auto">
            <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-lg">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input name="q" defaultValue={sp.q} type="text"
                  placeholder="Tìm kiếm nhà đất, khu vực..."
                  className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
              {(sp.type && sp.type !== 'all') && <input type="hidden" name="type" value={sp.type} />}
              {sp.cat     && <input type="hidden" name="cat" value={sp.cat} />}
              {sp.district && <input type="hidden" name="district" value={sp.district} />}
              <button type="submit"
                className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors hover:bg-[#2E7D32]">
                Tìm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR FILTERS */}
          <aside className="lg:w-56 flex-shrink-0 space-y-4">
            {/* Loại giao dịch */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Loại giao dịch</div>
              <div className="space-y-1">
                {[['all','Tất cả'],['ban','Mua bán'],['cho-thue','Cho thuê']].map(([v,l])=>(
                  <Link key={v} href={filterHref({type:v})}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${activeType===v?'bg-green-100 text-green-800':'text-gray-600 hover:bg-gray-50'}`}>
                    {l}
                    {activeType===v && <span className="w-2 h-2 rounded-full bg-green-600" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Loại BĐS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Loại BĐS</div>
              <div className="space-y-1">
                <Link href={filterHref({cat:''})}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${!activeCat?'bg-green-100 text-green-800':'text-gray-600 hover:bg-gray-50'}`}>
                  Tất cả
                </Link>
                {categories.map(cat => (
                  <Link key={cat} href={filterHref({cat})}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${activeCat===cat?'bg-green-100 text-green-800':'text-gray-600 hover:bg-gray-50'}`}>
                    {CAT_ICONS[cat]} {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Khu vực */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Khu vực</div>
              <div className="space-y-1">
                <Link href={filterHref({district:''})}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${!activeDistrict?'bg-green-100 text-green-800':'text-gray-600 hover:bg-gray-50'}`}>
                  Toàn tỉnh
                </Link>
                {districts.map(d => (
                  <Link key={d} href={filterHref({district:d})}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${activeDistrict===d?'bg-green-100 text-green-800':'text-gray-600 hover:bg-gray-50'}`}>
                    {d}
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad: sidebar BĐS */}
            <AdSlot slotId="bds-sidebar" />

            {/* CTA đăng tin */}
            <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl p-5 text-white text-center">
              <div className="font-black text-base mb-1">Đăng tin BĐS</div>
              <p className="text-green-200 text-xs mb-4">Tiếp cận hàng nghìn khách hàng tại Hà Tĩnh</p>
              <Link href="/dang-ky-gian-hang"
                className="block bg-white text-green-800 font-bold text-sm py-2.5 rounded-xl hover:bg-green-50 transition-colors">
                Đăng tin ngay
              </Link>
            </div>
          </aside>

          {/* MAIN LISTINGS */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-gray-500">
                Tìm thấy <span className="font-bold text-gray-900">{items.length}</span> tin đăng
                {sp.q && <> cho &ldquo;<span className="font-semibold text-green-700">{sp.q}</span>&rdquo;</>}
              </div>
              {featured.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
                  ⭐ {featured.length} tin nổi bật
                </span>
              )}
            </div>

            {/* Featured listings */}
            {featured.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600">Tin nổi bật</span>
                  <div className="flex-1 h-px bg-amber-100" />
                </div>
                <div className="grid gap-4">
                  {featured.map(item => <BDSCard key={item.id} item={item} featured />)}
                </div>
              </div>
            )}

            {/* Normal listings */}
            {normal.length > 0 && (
              <div className="grid gap-4">
                {normal.map(item => <BDSCard key={item.id} item={item} />)}
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Home size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="font-bold text-gray-500">Không có tin đăng nào</p>
                <p className="text-sm text-gray-400 mt-1">Thử bỏ bộ lọc hoặc tìm kiếm từ khác</p>
                <Link href="/bat-dong-san" className="mt-4 inline-block text-green-700 font-semibold text-sm hover:underline">
                  Xem tất cả BĐS
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSlot slotId="global-prefooter" />
      <Footer />
    </div>
  )
}

function BDSCard({ item, featured = false }: { item: BDSItem; featured?: boolean }) {
  const isRent = item.type === 'cho-thue'
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
      featured ? 'border-amber-200 ring-1 ring-amber-200' : 'border-gray-100 hover:border-green-200'
    }`}>
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link href={`/bat-dong-san/${item.id}`} className="sm:w-56 flex-shrink-0 block">
          <div className="relative h-44 sm:h-full min-h-[160px] bg-gray-100">
            <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 224px" />
            {featured && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">⭐ NỔI BẬT</div>
            )}
            <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-lg ${
              isRent ? 'bg-sky-600 text-white' : 'bg-green-700 text-white'
            }`}>
              {isRent ? 'CHO THUÊ' : 'BÁN'}
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
              {CAT_ICONS[item.category]}<span>{item.category}</span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <Link href={`/bat-dong-san/${item.id}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-green-700 transition-colors line-clamp-2 mb-1">
              {item.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{item.address}</span>
          </div>

          {/* Price + specs row */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-black text-green-700">{item.priceText}</span>
            {item.area > 0 && <span className="text-xs text-gray-400 flex items-center gap-0.5"><SquareArrowOutUpRight size={11}/>{item.area}m²</span>}
            {item.bedrooms > 0 && <span className="text-xs text-gray-400 flex items-center gap-0.5"><BedDouble size={11}/>{item.bedrooms}PN</span>}
            {item.bathrooms > 0 && <span className="text-xs text-gray-400 flex items-center gap-0.5"><Bath size={11}/>{item.bathrooms}WC</span>}
          </div>

          {/* Features */}
          {item.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.features.slice(0, 3).map(f => (
                <span key={f} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">{f}</span>
              ))}
              {item.features.length > 3 && <span className="text-[10px] text-gray-400">+{item.features.length-3}</span>}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div>
              <div className="text-xs font-bold text-gray-700">{item.contactName}</div>
              <div className="text-xs text-gray-400">{timeSince(item.postedAt)}</div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${item.phone.replace(/\s/g,'')}`}
                className="flex items-center gap-1 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors">
                <Phone size={12} /> Gọi ngay
              </a>
              <Link href={`/bat-dong-san/${item.id}`}
                className="px-3 py-2 border border-green-700 text-green-700 hover:bg-green-50 rounded-xl text-xs font-bold transition-colors">
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
