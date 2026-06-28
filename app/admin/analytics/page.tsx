"use client"

import { useEffect, useState } from 'react'
import { Users, Eye, TrendingUp, Calendar, BarChart2, Globe } from 'lucide-react'

type DayStats = { pageviews: number; visitors: number; paths: Record<string, number> }
type Analytics = { daily: Record<string, DayStats> }

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const days = getLast30Days()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const todayStats = data?.daily[today] ?? { pageviews: 0, visitors: 0, paths: {} }
  const yesterdayStats = data?.daily[yesterday] ?? { pageviews: 0, visitors: 0, paths: {} }

  const totalPageviews = Object.values(data?.daily ?? {}).reduce((s, d) => s + d.pageviews, 0)
  const totalVisitors = Object.values(data?.daily ?? {}).reduce((s, d) => s + d.visitors, 0)

  const maxPV = Math.max(...days.map(d => data?.daily[d]?.pageviews ?? 0), 1)

  // Top pages aggregated
  const allPaths: Record<string, number> = {}
  for (const stats of Object.values(data?.daily ?? {})) {
    for (const [p, c] of Object.entries(stats.paths || {})) {
      allPaths[p] = (allPaths[p] || 0) + c
    }
  }
  const topPages = Object.entries(allPaths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Thống kê truy cập</h1>
        <p className="text-slate-500 text-sm mt-1">Dữ liệu được ghi nhận khi người dùng thực sự truy cập trang web</p>
      </div>

      {/* Today highlight */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="opacity-70" />
          <span className="text-sm font-semibold opacity-80">Hôm nay — {formatDate(today)}</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-green-200 text-sm">Lượt truy cập</p>
            <p className="text-4xl font-black mt-1">{todayStats.pageviews.toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm">Người dùng duy nhất</p>
            <p className="text-4xl font-black mt-1">{todayStats.visitors.toLocaleString('vi-VN')}</p>
          </div>
        </div>
        {yesterdayStats.pageviews > 0 && (
          <p className="text-green-300 text-xs mt-4">
            Hôm qua: {yesterdayStats.pageviews} lượt / {yesterdayStats.visitors} người
          </p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng lượt xem (90 ngày)"
          value={totalPageviews.toLocaleString('vi-VN')}
          icon={Eye}
          color="bg-blue-500"
        />
        <StatCard
          label="Tổng người dùng (90 ngày)"
          value={totalVisitors.toLocaleString('vi-VN')}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          label="Lượt xem / ngày (TB)"
          value={days.length > 0
            ? Math.round(days.reduce((s, d) => s + (data?.daily[d]?.pageviews ?? 0), 0) / 30).toLocaleString('vi-VN')
            : '0'}
          sub="30 ngày qua"
          icon={TrendingUp}
          color="bg-amber-500"
        />
        <StatCard
          label="Trang phổ biến nhất"
          value={topPages[0]?.[0] ?? '—'}
          sub={topPages[0] ? `${topPages[0][1]} lượt` : undefined}
          icon={BarChart2}
          color="bg-green-600"
        />
      </div>

      {/* 30-day bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-black text-slate-800 mb-1 flex items-center gap-2">
          <BarChart2 size={16} className="text-green-600" />
          Lượt truy cập 30 ngày qua
        </h2>
        <p className="text-xs text-slate-400 mb-6">Mỗi cột = 1 ngày. Màu xanh đậm = hôm nay.</p>
        <div className="flex items-end gap-[3px] h-40">
          {days.map(d => {
            const pv = data?.daily[d]?.pageviews ?? 0
            const pct = maxPV > 0 ? (pv / maxPV) * 100 : 0
            const isToday = d === today
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className={`w-full rounded-t-sm transition-all ${isToday ? 'bg-[#1B5E20]' : 'bg-green-300 group-hover:bg-green-500'}`}
                  style={{ height: `${Math.max(pct, pv > 0 ? 4 : 0)}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="bg-slate-800 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                    <div className="font-bold">{formatDate(d)}</div>
                    <div>{pv} lượt xem</div>
                    <div>{data?.daily[d]?.visitors ?? 0} người</div>
                  </div>
                  <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
                </div>
              </div>
            )
          })}
        </div>
        {/* X-axis labels (every 5 days) */}
        <div className="flex mt-2">
          {days.map((d, i) => (
            <div key={d} className="flex-1 text-center">
              {i % 5 === 0 && (
                <span className="text-[9px] text-slate-400">{formatDate(d)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top pages + daily detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Globe size={16} className="text-blue-600" />
            Trang được xem nhiều nhất
          </h2>
          {topPages.length === 0 ? (
            <p className="text-slate-400 text-sm">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topPages.map(([path, count], i) => {
                const total = topPages.reduce((s, [, c]) => s + c, 0)
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={path}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-slate-400 w-5 text-right">{i + 1}.</span>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]" title={path}>
                          {path === '/' ? 'Trang chủ' : path}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="text-xs text-slate-400">{pct}%</span>
                        <span className="text-sm font-bold text-slate-800">{count.toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Last 7 days table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            Chi tiết 7 ngày gần nhất
          </h2>
          <div className="space-y-0">
            <div className="grid grid-cols-3 text-xs font-semibold text-slate-400 pb-2 border-b border-gray-100">
              <span>Ngày</span>
              <span className="text-center">Lượt xem</span>
              <span className="text-right">Người dùng</span>
            </div>
            {days.slice(-7).reverse().map(d => {
              const s = data?.daily[d]
              const isToday = d === today
              return (
                <div key={d} className={`grid grid-cols-3 py-2.5 text-sm border-b border-gray-50 ${isToday ? 'font-bold text-green-700' : 'text-slate-600'}`}>
                  <span className="flex items-center gap-1.5">
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
                    {formatDate(d)}{isToday ? ' (hôm nay)' : ''}
                  </span>
                  <span className="text-center">{s ? s.pageviews.toLocaleString('vi-VN') : '0'}</span>
                  <span className="text-right">{s ? s.visitors.toLocaleString('vi-VN') : '0'}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* GA4 setup hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="text-sm font-black text-blue-800 mb-2 flex items-center gap-2">
          <Globe size={14} />
          Tích hợp Google Analytics 4 (tùy chọn)
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed mb-3">
          Để có thêm số liệu nâng cao (realtime map, bounce rate, thiết bị, nguồn traffic…), thêm Measurement ID vào file <code className="bg-blue-100 px-1 rounded">.env.local</code>:
        </p>
        <code className="block bg-blue-900 text-green-300 text-xs px-4 py-3 rounded-xl font-mono">
          NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
        </code>
        <p className="text-xs text-blue-600 mt-2">
          Tạo tại: <span className="font-semibold">analytics.google.com</span> → Tạo tài khoản → Tạo Property → Copy Measurement ID
        </p>
      </div>
    </div>
  )
}
