"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import type { GalleryImage } from "@/lib/types"

export default function GallerySection({ items }: { items: GalleryImage[] }) {
  return (
    <section id="gallery" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <Camera size={14} />
            Ảnh đẹp
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Gallery{" "}
            <span className="text-amber-400">Hà Tĩnh</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Hà Tĩnh qua từng khoảnh khắc — vẻ đẹp bốn mùa của vùng đất thiêng
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        {items.length === 0 ? (
          <p className="text-center text-slate-500">Chưa có ảnh nào trong gallery.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {items.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                  i === 0 ? "md:col-span-2 row-span-2 h-80 md:h-[480px]" :
                  i === 3 ? "row-span-2 h-80 md:h-[380px]" :
                  "h-44 md:h-[220px]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  unoptimized={img.src.startsWith('/')}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white text-sm font-semibold">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
