"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Store, MapPin, Phone, Clock, Star, ChevronRight, Eye } from "lucide-react"
import type { Shop } from "@/lib/types"

const categoryColors: Record<string, string> = {
  "Ẩm thực":  "bg-orange-100 text-orange-700",
  "Đặc sản":  "bg-amber-100 text-amber-700",
  "Nông sản": "bg-green-100 text-green-700",
  "Lưu niệm": "bg-purple-100 text-purple-700",
  "Đồ uống":  "bg-sky-100 text-sky-700",
  "Khác":     "bg-gray-100 text-gray-700",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={12}
            className={n <= Math.round(rating) ? "text-vn-gold-500 fill-vn-gold-500" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function ShopsSection({ items }: { items: Shop[] }) {
  if (!items.length) return null

  const sorted = [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  return (
    <section id="gian-hang" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-forest-800 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <Store size={14} />
            Địa chỉ tin cậy
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 gold-line inline-block">
            Gian Hàng &{" "}
            <span className="text-forest-800">Quán Ăn</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mt-4">
            Các cơ sở uy tín, địa chỉ mua đặc sản và thưởng thức ẩm thực
            được người địa phương tin dùng.
          </p>
        </motion.div>

        {/* Shops grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {sorted.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl card-depth border transition-all duration-300 ${
                shop.featured
                  ? "bg-amber-50/60 border-yellow-400/60 shadow-yellow-100"
                  : "bg-white border-gray-100"
              }`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={shop.image}
                  alt={shop.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[shop.category] || 'bg-gray-100 text-gray-700'}`}>
                    {shop.category}
                  </span>
                </div>

                {/* Featured badge */}
                {shop.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                      ⭐ Nổi Bật
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-4 left-4">
                  <StarRating rating={shop.rating} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-black text-slate-900 text-lg mb-1 group-hover:text-forest-700 transition-colors line-clamp-1">
                  {shop.name}
                </h3>

                {shop.specialty && (
                  <p className="text-vn-gold-600 text-xs font-semibold mb-3 line-clamp-1">
                    ✦ {shop.specialty}
                  </p>
                )}

                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {shop.description}
                </p>

                {/* Info */}
                <div className="space-y-2 text-xs text-slate-500 border-t border-gray-50 pt-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-forest-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{shop.address}</span>
                  </div>
                  {shop.hours && (
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-vn-gold-500 flex-shrink-0" />
                      <span>{shop.hours}</span>
                    </div>
                  )}
                  {shop.priceRange && (
                    <div className="flex items-center gap-2">
                      <span className="text-forest-600 font-bold">₫</span>
                      <span>{shop.priceRange}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  {shop.phone && (
                    <a
                      href={`tel:${shop.phone.replace(/\s/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-forest-800 hover:bg-forest-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Phone size={13} />
                      Gọi ngay
                    </a>
                  )}
                  <Link
                    href={`/shops/${shop.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-forest-700 text-forest-700 hover:bg-forest-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye size={13} />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add shop CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-slate-400 text-sm">
            Bạn là chủ cơ sở tại Hà Tĩnh?{" "}
            <Link href="/dang-ky-gian-hang" className="text-forest-700 font-semibold hover:underline">
              Đăng ký gian hàng →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
