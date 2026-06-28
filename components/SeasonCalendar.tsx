"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Waves, TreePine, Leaf, Snowflake } from "lucide-react"

const SEASONS = [
  {
    id: "spring",
    name: "Mùa Xuân",
    months: "Tháng 1 – 3",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    active: "bg-green-600",
    items: [
      { emoji: "🌸", title: "Lễ hội Đền Hồng Sơn", desc: "Tháng 1 âm lịch, lễ hội văn hóa đặc sắc" },
      { emoji: "🍊", title: "Cam Bù Hương Sơn", desc: "Cuối vụ cam — ngọt đậm nhất mùa này" },
      { emoji: "🦑", title: "Mực Nhảy Vũng Áng", desc: "Bắt đầu mùa từ tháng 2 âm lịch" },
      { emoji: "🌊", title: "Bãi biển vắng", desc: "Biển yên, lý tưởng khám phá Xuân Thành" },
    ]
  },
  {
    id: "summer",
    name: "Mùa Hè",
    months: "Tháng 4 – 8",
    icon: Waves,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    active: "bg-sky-600",
    items: [
      { emoji: "🏖️", title: "Biển Thiên Cầm cao điểm", desc: "Tháng 6–8 nước đẹp nhất, đông khách nhất" },
      { emoji: "🍈", title: "Bưởi Phúc Trạch", desc: "Tháng 8–9 — đúng mùa thu hoạch GI" },
      { emoji: "🐙", title: "Mực nhảy Vũng Áng", desc: "Đỉnh mùa tháng 4–7 âm lịch" },
      { emoji: "🌿", title: "Sứa Lá Dung Kỳ Ninh", desc: "Tháng 4–9 — mùa sứa tươi ngon nhất" },
    ]
  },
  {
    id: "autumn",
    name: "Mùa Thu",
    months: "Tháng 9 – 11",
    icon: TreePine,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    active: "bg-amber-600",
    items: [
      { emoji: "🏞️", title: "Hồ Kẻ Gỗ đẹp nhất", desc: "Tháng 10–11 nước hồ đầy, rừng xanh mướt" },
      { emoji: "⛰️", title: "Leo núi Hồng Lĩnh", desc: "Tiết trời mát mẻ, mây mù lãng mạn" },
      { emoji: "🍂", title: "Lễ hội Nguyễn Du", desc: "10/8 âm lịch — lễ hội văn hóa văn học lớn" },
      { emoji: "🫙", title: "Mắm Nhượng Bình", desc: "Sau mùa cá cơm — nước mắm vừa đủ tuổi" },
    ]
  },
  {
    id: "winter",
    name: "Mùa Đông",
    months: "Tháng 11 – 1",
    icon: Snowflake,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    active: "bg-blue-600",
    items: [
      { emoji: "🏛️", title: "Ngã Ba Đồng Lộc", desc: "Tránh nắng, phù hợp thăm di tích lịch sử" },
      { emoji: "📜", title: "Khu Lưu Niệm Nguyễn Du", desc: "Khám phá di sản văn học trời mát mẻ" },
      { emoji: "🍵", title: "Chè Hương Sơn nóng", desc: "Ly chè thơm nóng hổi giữa núi rừng" },
      { emoji: "🎊", title: "Tết Nguyên Đán", desc: "Hà Tĩnh rực rỡ — mua kẹo Cu Đơ, rượu quà" },
    ]
  },
]

export default function SeasonCalendar() {
  const [active, setActive] = useState("summer")
  const season = SEASONS.find(s => s.id === active)!

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-vn-gold-300/20 text-vn-gold-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-vn-gold-400/20">
            <Leaf size={14} />
            Lịch du lịch thông minh
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Du Lịch Hà Tĩnh{" "}
            <span className="text-vn-gold-600">Theo Mùa</span>
          </h2>
          <div className="w-12 h-0.5 bg-vn-gold-500 mx-auto mt-4 mb-5 rounded-full" />
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Biết mùa nào đi đâu, ăn gì, mua gì để có chuyến du lịch Hà Tĩnh hoàn hảo nhất.
          </p>
        </motion.div>

        {/* Season tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {SEASONS.map(s => {
            const Icon = s.icon
            const isActive = s.id === active
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                  isActive
                    ? `${s.active} text-white border-transparent shadow-md scale-105`
                    : `${s.bg} ${s.color} ${s.border} hover:scale-105`
                }`}
              >
                <Icon size={16} />
                <span>{s.name}</span>
                <span className={`text-xs font-normal ${isActive ? 'text-white/80' : 'opacity-60'}`}>{s.months}</span>
              </button>
            )
          })}
        </div>

        {/* Season content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {season.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`${season.bg} border ${season.border} rounded-2xl p-5`}
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h4 className={`font-bold ${season.color} mb-2 text-sm`}>{item.title}</h4>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro tip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 bg-slate-950 rounded-3xl p-8 text-center"
        >
          <p className="text-vn-gold-400 font-bold text-sm mb-2">✦ Gợi ý lịch trình tối ưu</p>
          <p className="text-white/80 text-base max-w-3xl mx-auto">
            Tháng <span className="text-vn-gold-400 font-bold">6–8</span>: Biển Thiên Cầm + ăn hải sản Vũng Áng + mua kẹo Cu Đơ |
            Tháng <span className="text-vn-gold-400 font-bold">8–9</span>: Vườn Bưởi Phúc Trạch + Hồ Kẻ Gỗ + Đồng Lộc |
            Tháng <span className="text-vn-gold-400 font-bold">10–3</span>: Leo Núi Hồng + Khu Nguyễn Du + trà Hương Sơn
          </p>
        </motion.div>
      </div>
    </section>
  )
}
