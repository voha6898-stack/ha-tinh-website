'use client'

import { useEffect, useState } from 'react'
import { Mail, Download, Users, RefreshCw } from 'lucide-react'

interface Subscriber {
  email: string
  subscribedAt: string
  active: boolean
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showExport, setShowExport] = useState(false)

  async function fetchSubscribers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter/subscribers')
      if (!res.ok) throw new Error('Không thể tải dữ liệu')
      const data = await res.json()
      setSubscribers(data.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubscribers() }, [])

  const activeCount = subscribers.filter((s) => s.active).length
  const exportText = subscribers.map((s) => s.email).join('\n')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Subscribers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Danh sách người đăng ký nhận tin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
          >
            <RefreshCw size={15} />
            Làm mới
          </button>
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B5E20] text-white text-sm font-semibold hover:bg-[#2E7D32] transition-colors"
          >
            <Download size={15} />
            Xuất danh sách
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-green-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{subscribers.length}</div>
            <div className="text-xs text-slate-500 font-medium">Tổng số</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Mail size={20} className="text-blue-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{activeCount}</div>
            <div className="text-xs text-slate-500 font-medium">Đang hoạt động</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-amber-700" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{subscribers.length - activeCount}</div>
            <div className="text-xs text-slate-500 font-medium">Đã huỷ</div>
          </div>
        </div>
      </div>

      {/* Export textarea */}
      {showExport && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-sm">Danh sách email ({subscribers.length})</h2>
            <button
              onClick={() => navigator.clipboard.writeText(exportText)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Copy tất cả
            </button>
          </div>
          <textarea
            readOnly
            value={exportText}
            rows={8}
            className="w-full text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 resize-none outline-none"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-500 text-sm">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Mail size={32} className="opacity-40" />
            <span className="text-sm">Chưa có subscriber nào</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">#</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ngày đăng ký</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((sub, i) => (
                <tr key={sub.email} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{sub.email}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(sub.subscribedAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sub.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {sub.active ? 'Hoạt động' : 'Đã huỷ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
