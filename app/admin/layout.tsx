"use client"

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, MapPin, UtensilsCrossed, ShoppingBag, Store, LogOut, Globe, ChevronRight, Palette, Images, Newspaper, BarChart2, MessageSquare, Mail, Zap, QrCode, Building2, Megaphone, Car } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/tourism', label: 'Du Lịch', icon: MapPin },
  { href: '/admin/cuisine', label: 'Ẩm Thực', icon: UtensilsCrossed },
  { href: '/admin/products', label: 'Đặc Sản', icon: ShoppingBag },
  { href: '/admin/shops', label: 'Gian Hàng', icon: Store },
  { href: '/admin/realestate', label: 'Bất Động Sản', icon: Building2 },
  { href: '/admin/transport', label: 'Vận Chuyển', icon: Car },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/news', label: 'Tin Tức', icon: Newspaper },
  { href: '/admin/reviews', label: 'Duyệt Review', icon: MessageSquare },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
]

const settingsItems = [
  { href: '/admin/analytics', label: 'Thống kê truy cập',    icon: BarChart2 },
  { href: '/admin/ads',       label: 'Vị trí Quảng cáo',    icon: Megaphone },
  { href: '/admin/ticker',    label: 'Quảng cáo LED',        icon: Zap },
  { href: '/admin/qr',        label: 'Mã QR Code',           icon: QrCode },
  { href: '/admin/site',      label: 'Tiêu đề & Giao diện',  icon: Palette },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const currentSection = [...navItems, ...settingsItems].find(item =>
    'exact' in item && item.exact ? pathname === item.href : pathname.startsWith(item.href)
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B5E20] text-white flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4A017] flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <div className="font-black text-sm leading-tight">HÀ TĨNH CÓ GÌ?</div>
              <div className="text-green-300 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-green-400/60 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Quản lý nội dung
          </p>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-green-200 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            )
          })}

          <p className="text-green-400/60 text-xs font-semibold uppercase tracking-widest px-3 mt-6 mb-3">
            Cài đặt
          </p>
          {settingsItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-green-200 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-green-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Globe size={18} />
            Xem website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-green-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin" className="hover:text-slate-700">Admin</Link>
            {currentSection && currentSection.href !== '/admin' && (
              <>
                <ChevronRight size={14} />
                <span className="font-semibold text-slate-800">{currentSection.label}</span>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
