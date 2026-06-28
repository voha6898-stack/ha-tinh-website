"use client"

import { motion } from "framer-motion"
import { Map, Waves, Building2, Landmark } from "lucide-react"
import { siteConfig } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  map: <Map size={28} />,
  waves: <Waves size={28} />,
  building: <Building2 size={28} />,
  landmark: <Landmark size={28} />,
}

export default function StatsBar() {
  return (
    <section id="stats" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {siteConfig.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-forest-800 mb-4 transition-colors duration-300">
                {iconMap[stat.icon]}
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-100" />
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-forest-800" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      </div>
    </section>
  )
}
