"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { UtensilsCrossed, Clock, MapPin, ArrowRight } from "lucide-react"
import type { CuisineItem } from "@/lib/types"

const badgeStyles: Record<string, string> = {
  amber:  "bg-amber-100 text-amber-800 border border-amber-200",
  sky:    "bg-sky-100 text-sky-800 border border-sky-200",
  green:  "bg-green-100 text-green-800 border border-green-200",
  red:    "bg-red-100 text-red-800 border border-red-200",
  purple: "bg-purple-100 text-purple-800 border border-purple-200",
}

export default function CuisineSection({ items }: { items: CuisineItem[] }) {
  if (!items.length) return null
  const [featured, ...rest] = items

  return (
    <section id="am-thuc" className="py-24 bg-cream wave-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-vn-gold-500/15 text-vn-gold-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-vn-gold-500/20">
            <UtensilsCrossed size={14} />
            Hương vị đặc trưng
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Ẩm Thực{" "}
            <span className="text-vn-red-700">Hà Tĩnh</span>
          </h2>
          <div className="w-12 h-0.5 bg-vn-gold-500 mx-auto mt-4 mb-5 rounded-full" />
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Từ kẹo cu đơ OCOP đến mực nhảy Vũng Áng — ẩm thực Hà Tĩnh là hành trình
            của hương vị chân thật, đậm đà bản sắc vùng miền.
          </p>
        </motion.div>

        {/* Featured item */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 group"
        >
          <Link href={`/cuisine/${featured.id}`} className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 card-depth">
          <div className="relative h-72 md:h-auto min-h-[280px] overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeStyles[featured.badgeColor] || badgeStyles.amber}`}>
                {featured.badge}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8">
            <div className="text-vn-gold-600 text-xs font-bold uppercase tracking-widest mb-3">
              {featured.type}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 group-hover:text-vn-red-700 transition-colors">
              {featured.name}
            </h3>
            <div className="w-10 h-0.5 bg-vn-gold-500 rounded-full mb-4" />
            <p className="text-slate-500 leading-relaxed mb-6 text-base">
              {featured.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={13} className="text-forest-600" />
                <span>{featured.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={13} className="text-vn-gold-500" />
                <span>{featured.season}</span>
              </div>
            </div>
          </div>
          </Link>
        </motion.div>

        {/* Rest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {rest.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group"
            >
              <Link href={`/cuisine/${item.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm card-depth border border-gray-100">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeStyles[item.badgeColor] || badgeStyles.amber}`}>
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-vn-gold-600 font-semibold uppercase tracking-wide mb-1.5 line-clamp-1">
                  {item.type}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-vn-red-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin size={11} className="text-forest-600" />
                  <span className="line-clamp-1">{item.origin}</span>
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
