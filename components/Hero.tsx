"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Compass, Utensils } from "lucide-react"
import type { SiteConfig } from "@/lib/types"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
})
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, delay },
})

const TITLE_SIZE: Record<string, string> = {
  sm: "clamp(3rem, 10vw, 8rem)",
  md: "clamp(4rem, 13vw, 11rem)",
  lg: "clamp(5rem, 16vw, 14rem)",
  xl: "clamp(6rem, 20vw, 18rem)",
}
const SUBTITLE_SIZE: Record<string, string> = {
  sm: "clamp(1.8rem, 5vw, 5rem)",
  md: "clamp(2.3rem, 7vw, 6.5rem)",
  lg: "clamp(2.8rem, 9vw, 8rem)",
  xl: "clamp(3.5rem, 11vw, 10rem)",
}
const TEXT_COLOR: Record<string, string> = {
  white: "text-white",
  gold:  "text-vn-gold-400",
  red:   "text-red-400",
}
const TEXT_SHADOW: Record<string, string> = {
  white: "0 0 80px rgba(0,0,0,0.5), 0 4px 30px rgba(0,0,0,0.4)",
  gold:  "0 0 60px rgba(212,160,23,0.4)",
  red:   "0 0 60px rgba(248,113,113,0.4)",
}

export default function Hero({ config }: { config: SiteConfig }) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.1)`
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Resolve style config with defaults
  const textAlign    = config.heroTextAlign    ?? "left"
  const vertAlign    = config.heroVerticalAlign ?? "center"
  const titleSize    = config.heroTitleSize    ?? "lg"
  const titleColor   = config.heroTitleColor   ?? "white"
  const subtitleColor = config.heroSubtitleColor ?? "gold"
  const overlayOpacity = config.heroOverlayOpacity ?? 55

  const stats = [config.heroStat1, config.heroStat2, config.heroStat3, config.heroStat4].filter(Boolean)

  // Horizontal alignment classes
  const alignClass: Record<string, string> = {
    left:   "items-start text-left",
    center: "items-center text-center",
    right:  "items-end text-right",
  }
  const contentAlign = alignClass[textAlign] ?? alignClass.left

  // Vertical alignment
  const vertClass: Record<string, string> = {
    top:    "justify-start pt-40",
    center: "justify-center",
    bottom: "justify-end pb-28",
  }
  const verticalClass = vertClass[vertAlign] ?? vertClass.center

  // Gold separator direction
  const separatorClass = textAlign === "right"
    ? "ml-auto bg-gradient-to-l from-vn-gold-400 via-vn-gold-300 to-transparent"
    : textAlign === "center"
    ? "mx-auto bg-gradient-to-r from-transparent via-vn-gold-400 to-transparent"
    : "bg-gradient-to-r from-vn-gold-400 via-vn-gold-300 to-transparent"

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">

      {/* Background with parallax */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${config.heroImage}')` }}
        />
      </div>

      {/* Overlays — opacity driven by config */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"
        style={{ opacity: overlayOpacity / 100 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vn-red-800 via-vn-gold-400 to-vn-red-800" />

      {/* Decorative vertical accent — only for left layout */}
      {textAlign === "left" && (
        <motion.div
          {...fadeIn(1.2)}
          className="absolute left-10 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-vn-gold-500/50 to-transparent hidden lg:block"
        />
      )}

      {/* Corner ornaments */}
      <div className="absolute top-20 left-8 w-16 h-16 border-l border-t border-vn-gold-500/25 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-20 right-8 w-16 h-16 border-r border-t border-vn-gold-500/25 rounded-tr-2xl pointer-events-none" />

      {/* Main content */}
      <div className={`relative z-10 flex-1 flex flex-col ${verticalClass}`}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-16">
          <div className={`w-full flex flex-col ${contentAlign}`}>

            {/* Accent tag */}
            <motion.div {...fadeUp(0.1)} className="mb-6">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.3em] text-vn-gold-400/80 uppercase">
                {textAlign !== "right" && <span className="w-6 h-px bg-vn-gold-400/60" />}
                {config.heroAccentText || "KHÁM PHÁ · BẮC TRUNG BỘ · VIỆT NAM"}
                {textAlign !== "left" && <span className="w-6 h-px bg-vn-gold-400/60" />}
              </span>
            </motion.div>

            {/* Main title — horizontal, no max-width constraint */}
            <motion.div {...fadeUp(0.2)} className="w-full">
              <h1 className="font-black leading-none tracking-tight select-none">
                {/* HÀ TĨNH + CÓ GÌ? on the same line */}
                <div
                  className={`flex flex-row items-baseline gap-x-4 lg:gap-x-7 ${
                    textAlign === "center" ? "justify-center" :
                    textAlign === "right"  ? "justify-end"    : "justify-start"
                  }`}
                  style={{ flexWrap: "nowrap" }}
                >
                  <span
                    className={TEXT_COLOR[titleColor] ?? "text-white"}
                    style={{
                      fontSize: TITLE_SIZE[titleSize] ?? TITLE_SIZE.lg,
                      textShadow: TEXT_SHADOW[titleColor] ?? TEXT_SHADOW.white,
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {config.heroTitle || "HÀ TĨNH"}
                  </span>

                  <span
                    className={`font-black italic ${TEXT_COLOR[subtitleColor] ?? "text-vn-gold-400"}`}
                    style={{
                      fontSize: SUBTITLE_SIZE[titleSize] ?? SUBTITLE_SIZE.lg,
                      letterSpacing: "-0.01em",
                      textShadow: TEXT_SHADOW[subtitleColor] ?? TEXT_SHADOW.gold,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {config.heroSubtitle || "CÓ GÌ?"}
                  </span>
                </div>

                {/* Gold separator */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.55 }}
                  className="mt-3 lg:mt-4"
                  style={{ transformOrigin: textAlign === "right" ? "right" : textAlign === "center" ? "center" : "left" }}
                >
                  <span className={`block w-32 lg:w-48 h-0.5 rounded-full ${separatorClass}`} />
                </motion.div>
              </h1>
            </motion.div>

            {/* Tagline — capped width */}
            <motion.p
              {...fadeUp(0.5)}
              className={`mt-7 text-sm sm:text-base lg:text-lg text-white/65 max-w-xl leading-relaxed font-light tracking-wide ${
                textAlign === "center" ? "mx-auto" : textAlign === "right" ? "ml-auto" : ""
              }`}
            >
              {config.heroTagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              {...fadeUp(0.65)}
              className={`flex flex-col sm:flex-row gap-3 mt-10 ${
                textAlign === "center" ? "justify-center" : textAlign === "right" ? "justify-end" : ""
              }`}
            >
              <a
                href="#du-lich"
                className="group inline-flex items-center justify-center gap-2.5 bg-vn-gold-500 hover:bg-vn-gold-400 text-black font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 hover:scale-105 shadow-xl shadow-vn-gold-500/20"
              >
                <Compass size={16} />
                Khám phá địa điểm
              </a>
              <a
                href="#am-thuc"
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-vn-gold-400/70 text-white/85 hover:text-vn-gold-300 font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
              >
                <Utensils size={16} />
                Ẩm thực đặc sắc
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats — visually prominent cards */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 pb-10 pt-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat, i) => {
              const parts = stat.trim().split(' ')
              const emoji = parts[0]
              const rest = parts.slice(1).join(' ')
              // Detect leading number: "137km bờ biển" → ["137km", "bờ biển"]
              const numMatch = rest.match(/^([0-9][^\s]*)\s+(.+)$/)

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="group relative bg-white/8 hover:bg-white/13 backdrop-blur-md border border-white/12 hover:border-vn-gold-400/60 rounded-2xl p-4 lg:p-5 transition-all duration-300 overflow-hidden cursor-default h-full">
                    {/* Gold shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-vn-gold-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                    {/* Bottom gold line */}
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-vn-gold-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                    <div className="relative">
                      {/* Emoji icon */}
                      <span className="text-3xl lg:text-4xl leading-none block mb-3 filter drop-shadow-lg">
                        {emoji}
                      </span>

                      {numMatch ? (
                        <>
                          {/* Bold number */}
                          <span className="block text-white font-black text-xl lg:text-2xl leading-tight tracking-tight group-hover:text-vn-gold-200 transition-colors duration-300">
                            {numMatch[1]}
                          </span>
                          {/* Label */}
                          <span className="block text-white/55 text-xs lg:text-sm mt-1 font-medium leading-snug">
                            {numMatch[2]}
                          </span>
                        </>
                      ) : (
                        <span className="block text-white font-bold text-sm lg:text-base leading-snug group-hover:text-vn-gold-200 transition-colors duration-300">
                          {rest}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#du-lich"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-20 right-8 lg:right-16 text-white/30 hover:text-vn-gold-400 transition-colors hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-semibold rotate-90 origin-center mb-4">Cuộn xuống</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
