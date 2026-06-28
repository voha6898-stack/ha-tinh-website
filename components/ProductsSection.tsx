"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, BadgeCheck, Calendar, MapPin } from "lucide-react"
import type { LocalProduct } from "@/lib/types"

export default function ProductsSection({ items }: { items: LocalProduct[] }) {
  return (
    <section id="dac-san" className="py-24 bg-white vn-pattern">
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
            <ShoppingBag size={14} />
            Mang về làm quà
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Đặc Sản{" "}
            <span className="text-forest-800">Hà Tĩnh</span>
          </h2>
          <div className="w-12 h-0.5 bg-vn-gold-500 mx-auto mt-4 mb-5 rounded-full" />
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Bưởi Phúc Trạch GI, Cam Bù Hương Sơn, Kẹo Cu Đơ OCOP... Những tinh hoa
            nông sản được đất trời Hà Tĩnh ưu ái.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <Link href={`/products/${product.id}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm card-depth border border-gray-100">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-forest-800/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {product.unit}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-forest-800 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex flex-col gap-2 mb-5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-forest-600 flex-shrink-0" />
                    <span>{product.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={11} className="text-vn-gold-500 flex-shrink-0" />
                    <span>Thu hoạch: {product.harvestSeason}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      <BadgeCheck size={11} />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-vn-gold-300/15 border border-vn-gold-400/25 rounded-2xl px-8 py-5">
            <ShoppingBag className="text-vn-gold-600 flex-shrink-0" size={22} />
            <div className="text-left">
              <div className="font-bold text-slate-800 text-sm">Mua đặc sản tại chỗ</div>
              <div className="text-slate-500 text-xs mt-0.5">
                Chợ trung tâm Hà Tĩnh · Siêu thị Coopmart · Các cửa hàng OCOP toàn tỉnh
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
