"use client"

import { MapPin, ExternalLink } from "lucide-react"

const LOCATION_CHIPS = [
  { label: "Thiên Cầm", query: "Thiên Cầm, Hà Tĩnh" },
  { label: "Ngã Ba Đồng Lộc", query: "Ngã Ba Đồng Lộc, Hà Tĩnh" },
  { label: "Nghi Xuân – Quê Nguyễn Du", query: "Nghi Xuân Hà Tĩnh quê Nguyễn Du" },
  { label: "Hồng Lĩnh", query: "Hồng Lĩnh, Hà Tĩnh" },
  { label: "Chùa Hương Tích", query: "Chùa Hương Tích Hà Tĩnh" },
  { label: "Cửa Lò", query: "Cửa Lò, Nghệ An" },
]

export default function MapSection() {
  const handleChipClick = (query: string) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="ban-do" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <MapPin size={14} />
            <span>Khám phá địa lý</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--forest-deep)" }}
          >
            BẢN ĐỒ{" "}
            <span style={{ color: "var(--vn-gold)" }}>HÀ TĨNH</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Tỉnh Hà Tĩnh nằm ở vùng Bắc Trung Bộ Việt Nam — vùng đất giàu truyền thống văn hoá,
            lịch sử anh hùng và cảnh quan thiên nhiên tuyệt đẹp.
          </p>
        </div>

        {/* Map iframe */}
        <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-200">
          <div style={{ position: "relative", paddingBottom: "43.75%" /* 16:7 ratio */ }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.9!3d18.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139b01e4e8a9b7f%3A0xdc0b4538a2a2a30b!2zSOG6oBBUxKluaA!5e0!3m2!1svi!2svn!4v1234567890"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Hà Tĩnh"
            />
          </div>
        </div>

        {/* Location chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {LOCATION_CHIPS.map(({ label, query }) => (
            <button
              key={label}
              onClick={() => handleChipClick(query)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                         bg-white border border-slate-200 text-slate-700
                         hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50
                         active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
            >
              <MapPin size={13} className="shrink-0 text-amber-500" />
              {label}
              <ExternalLink size={11} className="shrink-0 opacity-50" />
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Nhấn vào địa danh để mở trên Google Maps &nbsp;·&nbsp; Bản đồ cung cấp bởi Google Maps
        </p>

      </div>
    </section>
  )
}
