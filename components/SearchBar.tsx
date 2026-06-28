"use client"

import { useState, useCallback } from "react"
import { Search, X, MapPin, UtensilsCrossed, ShoppingBag, Store } from "lucide-react"
import Link from "next/link"
import type { TourismSpot, CuisineItem, LocalProduct, Shop } from "@/lib/types"

interface SearchData {
  tourism: TourismSpot[]
  cuisine: CuisineItem[]
  products: LocalProduct[]
  shops: Shop[]
}

interface SearchResult {
  type: 'tourism' | 'cuisine' | 'products' | 'shops'
  id: string
  name: string
  subtitle: string
  href: string
}

const TYPE_CONFIG = {
  tourism: { label: 'Du lịch', icon: MapPin, color: 'text-forest-600', bg: 'bg-forest-50' },
  cuisine: { label: 'Ẩm thực', icon: UtensilsCrossed, color: 'text-vn-red-700', bg: 'bg-red-50' },
  products: { label: 'Đặc sản', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  shops: { label: 'Gian hàng', icon: Store, color: 'text-sky-600', bg: 'bg-sky-50' },
}

export default function SearchBar({ data }: { data: SearchData }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const results: SearchResult[] = (() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()

    const tourism = data.tourism
      .filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
      .map(s => ({ type: 'tourism' as const, id: s.id, name: s.name, subtitle: s.location.split('—')[0].trim(), href: `/tourism/${s.id}` }))

    const cuisine = data.cuisine
      .filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map(c => ({ type: 'cuisine' as const, id: c.id, name: c.name, subtitle: c.type, href: `/cuisine/${c.id}` }))

    const products = data.products
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .map(p => ({ type: 'products' as const, id: p.id, name: p.name, subtitle: p.origin, href: `/products/${p.id}` }))

    const shops = data.shops
      .filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.specialty.toLowerCase().includes(q))
      .map(s => ({ type: 'shops' as const, id: s.id, name: s.name, subtitle: s.address.split(',')[0], href: `/shops/${s.id}` }))

    return [...tourism, ...cuisine, ...products, ...shops].slice(0, 8)
  })()

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 bg-white/90 backdrop-blur-sm border-2 transition-all rounded-2xl px-4 py-3 shadow-lg ${open ? 'border-vn-gold-400' : 'border-white/60'}`}>
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm, món ăn, đặc sản, quán hàng..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false) }} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {results.map((result, i) => {
            const conf = TYPE_CONFIG[result.type]
            const Icon = conf.icon
            return (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${i < results.length - 1 ? 'border-b border-gray-50' : ''}`}
                onClick={() => { setQuery(""); setOpen(false) }}
              >
                <div className={`w-8 h-8 rounded-lg ${conf.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} className={conf.color} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{result.name}</div>
                  <div className="text-xs text-gray-400 truncate">{conf.label} · {result.subtitle}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 z-50 text-center text-sm text-gray-400">
          Không tìm thấy kết quả cho &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
