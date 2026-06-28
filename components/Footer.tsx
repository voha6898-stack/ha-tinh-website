import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { MapPin, Phone, Mail, Heart } from "lucide-react"

const navLinks = [
  { href: "#du-lich", label: "Du Lịch" },
  { href: "#am-thuc", label: "Ẩm Thực" },
  { href: "#dac-san", label: "Đặc Sản" },
  { href: "#gallery", label: "Gallery" },
]

const highlights = [
  "Bãi biển Thiên Cầm",
  "Hồ Kẻ Gỗ",
  "Ngã Ba Đồng Lộc",
  "Khu lưu niệm Nguyễn Du",
  "Núi Hồng — Sông Lam",
  "Bưởi Phúc Trạch",
  "Kẹo Cu Đơ",
  "Mực nhảy Vũng Áng",
]

function getFooterConfig() {
  try {
    const path = join(process.cwd(), 'data', 'site.json')
    if (!existsSync(path)) return {}
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch { return {} }
}

export default function Footer() {
  const cfg = getFooterConfig()

  const address   = String(cfg.footerAddress   || 'Tỉnh Hà Tĩnh, Bắc Trung Bộ, Việt Nam')
  const phone     = String(cfg.footerPhone     || '0239 3852 xxx')
  const email     = String(cfg.footerEmail     || 'dulich@hatinh.gov.vn')
  const copyright = String(cfg.footerCopyright || '© 2025 Hà Tĩnh Có Gì? — Thông tin du lịch tỉnh Hà Tĩnh')

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ht-primary)' }}>
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-black text-lg leading-none">HÀ TĨNH</div>
                <div className="text-amber-400 font-bold text-sm">CÓ GÌ?</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Cổng thông tin khám phá du lịch, ẩm thực và đặc sản tỉnh Hà Tĩnh — vùng đất
              di sản ngàn năm của Việt Nam.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin size={14} className="flex-shrink-0" style={{ color: 'var(--ht-primary-light)' }} />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone size={14} className="flex-shrink-0" style={{ color: 'var(--ht-primary-light)' }} />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:opacity-70">
                  Đường dây du lịch: {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail size={14} className="flex-shrink-0" style={{ color: 'var(--ht-primary-light)' }} />
                <a href={`mailto:${email}`} className="transition-colors hover:opacity-70">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Khám phá
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Nổi bật
            </h4>
            <ul className="space-y-2.5 columns-2">
              {highlights.map((item) => (
                <li key={item} className="text-slate-400 text-sm break-inside-avoid">
                  <span className="text-amber-500 mr-1.5">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Seasons */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Mùa du lịch
            </h4>
            <div className="space-y-4">
              {[
                { season: "Mùa Xuân (2–4)", desc: "Hoa nở, lễ hội, thời tiết mát mẻ" },
                { season: "Mùa Hè (5–8)",   desc: "Bãi biển sôi động, mực nhảy Vũng Áng" },
                { season: "Mùa Thu (9–11)", desc: "Bưởi Phúc Trạch, cam bù Hương Sơn" },
                { season: "Mùa Đông (12–1)", desc: "Yên tĩnh, khám phá di tích lịch sử" },
              ].map(({ season, desc }) => (
                <div key={season} className="text-sm">
                  <div className="text-white font-semibold">{season}</div>
                  <div className="text-slate-400">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>{copyright}</div>
          <div className="flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-400 fill-red-400" /> for Hà Tĩnh
          </div>
        </div>
      </div>
    </footer>
  )
}
