"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, MapPin } from "lucide-react"
import SearchBox from "@/components/SearchBox"

const navLinks = [
  { href: "/#du-lich",       label: "Du Lịch"     },
  { href: "/#am-thuc",       label: "Ẩm Thực"     },
  { href: "/#dac-san",       label: "Đặc Sản"     },
  { href: "/#gallery",       label: "Gallery"     },
  { href: "/tin-tuc",        label: "Tin Tức"     },
  { href: "/bat-dong-san",   label: "Bất Động Sản"},
  { href: "/van-chuyen",     label: "Vận Chuyển"  },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: scrolled ? 'var(--ht-primary)' : 'var(--ht-accent)' }}
            >
              <MapPin size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-black text-base tracking-tight transition-colors ${
                  scrolled ? "text-slate-800" : "text-white"
                }`}
              >
                HÀ TĨNH
              </span>
              <span
                className="font-bold text-xs tracking-widest transition-colors"
                style={{ color: scrolled ? 'var(--ht-accent)' : 'var(--ht-accent-light)' }}
              >
                CÓ GÌ?
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-70 relative group ${scrolled ? "text-slate-700" : "text-white"}`}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: scrolled ? 'var(--ht-primary)' : 'var(--ht-accent)' }}
                />
              </Link>
            ))}
            <SearchBox scrolled={scrolled} />
            <a
              href="#du-lich"
              className="px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:opacity-90"
              style={{
                backgroundColor: scrolled ? 'var(--ht-primary)' : 'var(--ht-accent)',
                color: scrolled ? '#fff' : '#000',
              }}
            >
              Khám phá
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-slate-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-1">
          <div className="px-1 pb-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const q = (e.currentTarget.elements.namedItem('mq') as HTMLInputElement).value.trim()
                if (q.length >= 2) {
                  window.location.href = `/tim-kiem?q=${encodeURIComponent(q)}`
                  setMobileOpen(false)
                }
              }}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                name="mq"
                type="text"
                placeholder="Tìm kiếm địa điểm, món ăn…"
                className="bg-transparent flex-1 text-sm outline-none text-slate-700 placeholder-slate-400"
              />
            </form>
          </div>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-slate-700 font-semibold rounded-xl hover:bg-green-50 hover:text-forest-800 transition-colors">
              {link.label}
            </Link>
          ))}
          <a
            href="#du-lich"
            onClick={() => setMobileOpen(false)}
            className="block mt-3 text-center px-4 py-3 text-white font-bold rounded-xl transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--ht-primary)' }}
          >
            Khám phá ngay
          </a>
        </div>
      </div>
    </nav>
  )
}
