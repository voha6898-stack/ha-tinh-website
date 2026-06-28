"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, UtensilsCrossed, ShoppingBag, Store, ArrowRight, Globe } from 'lucide-react'

const sections = [
  {
    href: '/admin/tourism',
    label: 'Du Lịch',
    icon: MapPin,
    section: 'tourism',
    color: 'sky',
    description: 'Các địa điểm tham quan, bãi biển, di tích',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    href: '/admin/cuisine',
    label: 'Ẩm Thực',
    icon: UtensilsCrossed,
    section: 'cuisine',
    color: 'amber',
    description: 'Món đặc sản, hải sản, bữa sáng truyền thống',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    href: '/admin/products',
    label: 'Đặc Sản',
    icon: ShoppingBag,
    section: 'products',
    color: 'green',
    description: 'Nông sản, đặc sản, sản phẩm OCOP',
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    href: '/admin/shops',
    label: 'Gian Hàng',
    icon: Store,
    section: 'shops',
    color: 'purple',
    description: 'Quán ăn, cơ sở đặc sản, cửa hàng lưu niệm',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    sections.forEach(async (s) => {
      try {
        const res = await fetch(`/api/content/${s.section}`)
        const data = await res.json()
        setCounts((prev) => ({ ...prev, [s.section]: (data.items || []).length }))
      } catch { /* ignore */ }
    })
  }, [])

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500">Quản lý toàn bộ nội dung website <span className="font-semibold text-green-700">Hà Tĩnh Có Gì?</span></p>
      </div>

      {/* Quick guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
          <Globe size={20} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-amber-900 mb-1">Hướng dẫn sử dụng</div>
          <ul className="text-amber-800 text-sm space-y-1">
            <li>• Chọn mục bên trái để quản lý nội dung tương ứng</li>
            <li>• Nhấn <strong>Thêm mới</strong> để thêm địa điểm, món ăn, đặc sản hoặc gian hàng</li>
            <li>• Nhấn <strong>Sửa</strong> để thay hình ảnh (dán URL hoặc upload từ máy) và chỉnh nội dung</li>
            <li>• Nhấn biểu tượng <strong>mắt</strong> để ẩn/hiện mục trên website</li>
          </ul>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`group ${section.bg} border ${section.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${section.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className={section.iconColor} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-lg">{section.label}</div>
                    <div className="text-slate-500 text-sm">{section.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-800">
                    {counts[section.section] ?? '—'}
                  </div>
                  <div className="text-xs text-slate-400">mục</div>
                </div>
              </div>
              <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${section.iconColor} group-hover:gap-2 transition-all`}>
                Quản lý
                <ArrowRight size={14} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* View website */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 transition-colors"
        >
          <Globe size={16} />
          Xem website công khai →
        </Link>
      </div>
    </div>
  )
}
