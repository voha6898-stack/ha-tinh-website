"use client"

import { motion } from "framer-motion"
import type { SiteConfig } from "@/lib/types"

export default function AtmosphereSection({ config }: { config: SiteConfig }) {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${config.atmosphereImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/92 via-forest-950/75 to-forest-950/92" />

      {/* Decorative elements */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 w-px h-32 bg-vn-gold-500/30" />
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-px h-32 bg-vn-gold-500/30" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Decorative ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-16 bg-vn-gold-500/40" />
          <div className="text-vn-gold-400 text-2xl">✦</div>
          <div className="h-px w-16 bg-vn-gold-500/40" />
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-8 atmosphere-text"
        >
          &ldquo;{config.atmosphereQuote}&rdquo;
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-vn-gold-300/80 text-base font-light tracking-wide max-w-xl mx-auto"
        >
          {config.atmosphereSubtext}
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <div className="h-px w-8 bg-vn-gold-500/30" />
          <div className="w-2 h-2 rounded-full bg-vn-gold-500/50" />
          <div className="h-px w-24 bg-vn-gold-500/50" />
          <div className="text-vn-gold-400 text-sm font-bold tracking-[0.3em]">HÀ TĨNH</div>
          <div className="h-px w-24 bg-vn-gold-500/50" />
          <div className="w-2 h-2 rounded-full bg-vn-gold-500/50" />
          <div className="h-px w-8 bg-vn-gold-500/30" />
        </motion.div>
      </div>
    </section>
  )
}
