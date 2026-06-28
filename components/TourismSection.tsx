"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, ArrowRight } from "lucide-react"
import type { TourismSpot } from "@/lib/types"

const tagStyles: Record<string, string> = {
  sky:    "bg-sky-100 text-sky-700",
  green:  "bg-green-100 text-green-700",
  red:    "bg-red-100 text-red-700",
  amber:  "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-700",
}

export default function TourismSection({ items }: { items: TourismSpot[] }) {
  return (
    <section id="du-lich" className="py-24 bg-white vn-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <MapPin size={14} />
            Địa điểm nổi bật
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Du Lịch{" "}
            <span className="text-forest-800">Hà Tĩnh</span>
          </h2>
          <div className="w-12 h-0.5 bg-vn-gold-500 mx-auto mt-4 mb-5 rounded-full" />
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Từ bãi biển hoang sơ đến rừng nguyên sinh, từ di tích lịch sử đến danh lam thắng cảnh —
            Hà Tĩnh có đủ vẻ đẹp cho mọi hành trình.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <Link href={`/tourism/${spot.id}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm card-depth border border-gray-100">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={spot.image}
                  alt={spot.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${tagStyles[spot.tagColor] || tagStyles.green}`}>
                    {spot.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-forest-600 font-medium mb-3">
                  <MapPin size={11} className="flex-shrink-0" />
                  <span className="line-clamp-1">{spot.location}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-forest-800 transition-colors">
                  {spot.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
                  {spot.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-vn-gold-600 bg-vn-gold-300/20 px-3 py-1.5 rounded-full border border-vn-gold-400/20">
                    ✦ {spot.highlight}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-forest-800 flex items-center justify-center transition-all duration-300 group-hover:text-white text-slate-500">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
