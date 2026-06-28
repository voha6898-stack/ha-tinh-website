'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, ExternalLink, ToggleLeft, ToggleRight, Monitor, Smartphone, Megaphone, X, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

type SlotType = 'horizontal' | 'rectangle' | 'prefooter'

type AdSlot = {
  id: string
  name: string
  description: string
  type: SlotType
  pages: string[]
  size: string
  image: string
  linkUrl: string
  linkTarget: string
  enabled: boolean
  altText: string
}

type AdsData = { slots: AdSlot[] }

const TYPE_LABELS: Record<SlotType, { label: string; color: string }> = {
  horizontal: { label: 'Banner ngang', color: 'bg-blue-100 text-blue-700' },
  rectangle:  { label: 'Hộp sidebar',  color: 'bg-purple-100 text-purple-700' },
  prefooter:  { label: 'Banner to cuối trang', color: 'bg-amber-100 text-amber-700' },
}

export default function AdsAdminPage() {
  const [data, setData] = useState<AdsData | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/content/ads').then(r => r.json()).then(setData)
  }, [])

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function updateSlot(id: string, patch: Partial<AdSlot>) {
    if (!data) return
    setData({
      slots: data.slots.map(s => s.id === id ? { ...s, ...patch } : s)
    })
  }

  async function saveSlot(slot: AdSlot) {
    if (!data) return
    setSaving(slot.id)
    try {
      const res = await fetch('/api/content/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) showToast(`Đã lưu "${slot.name}"`)
      else showToast('Lưu thất bại', false)
    } catch {
      showToast('Lỗi kết nối', false)
    }
    setSaving(null)
  }

  async function uploadImage(slotId: string, file: File) {
    setUploading(slotId)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (json.url) {
        updateSlot(slotId, { image: json.url })
        showToast('Ảnh đã tải lên — nhớ Lưu lại!')
      } else {
        showToast('Upload ảnh thất bại', false)
      }
    } catch {
      showToast('Lỗi upload', false)
    }
    setUploading(null)
  }

  const activeCount = data?.slots.filter(s => s.enabled).length ?? 0

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Megaphone size={20} className="text-amber-700" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Quản lý Quảng cáo</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">Bật/tắt và cài đặt từng vị trí quảng cáo trên website</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm font-bold text-green-800">{activeCount}/{data.slots.length} slot đang bật</span>
        </div>
      </div>

      {/* Ad size guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="font-bold text-blue-900 mb-3 text-sm">Hướng dẫn kích thước ảnh quảng cáo chuẩn</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Monitor size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-800">Banner ngang</span>
            </div>
            <div className="text-xs text-gray-600">970 × 90 px (leaderboard)<br />728 × 90 px (mobile-friendly)<br />Định dạng: JPG, PNG, WebP</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={14} className="text-purple-600" />
              <span className="text-xs font-bold text-purple-800">Hộp sidebar</span>
            </div>
            <div className="text-xs text-gray-600">300 × 250 px (medium rectangle)<br />Tỉ lệ 6:5 · Hình vuông gần đúng<br />Định dạng: JPG, PNG, WebP</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Monitor size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-800">Banner to cuối trang</span>
            </div>
            <div className="text-xs text-gray-600">1200 × 160 px (billboard)<br />Hiển thị mọi trang website<br />Định dạng: JPG, PNG, WebP</div>
          </div>
        </div>
      </div>

      {/* Slot list */}
      <div className="space-y-5">
        {data.slots.map(slot => {
          const typeInfo = TYPE_LABELS[slot.type]
          return (
            <div key={slot.id}
              className={`bg-white rounded-2xl border-2 transition-all ${slot.enabled ? 'border-green-200 shadow-md shadow-green-50' : 'border-gray-100'}`}>
              <div className="p-6">
                {/* Slot header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{slot.size}</span>
                      {slot.pages.map(p => (
                        <span key={p} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">{p}</span>
                      ))}
                    </div>
                    <h3 className="font-black text-gray-900">{slot.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{slot.description}</p>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => updateSlot(slot.id, { enabled: !slot.enabled })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${
                      slot.enabled
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {slot.enabled
                      ? <><ToggleRight size={18} /> Đang bật</>
                      : <><ToggleLeft size={18} /> Đang tắt</>
                    }
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Preview */}
                  <div className="lg:col-span-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preview</div>
                    <div className={`relative overflow-hidden rounded-xl bg-gray-100 border-2 border-dashed ${slot.enabled ? 'border-green-300' : 'border-gray-200'} ${
                      slot.type === 'rectangle' ? 'w-full aspect-[300/250]'
                      : slot.type === 'prefooter' ? 'w-full aspect-[7/1]'
                      : 'w-full aspect-[970/90]'
                    }`}>
                      {slot.image ? (
                        <Image src={slot.image} alt="Preview" fill className="object-cover" sizes="300px" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                          <div className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh</div>
                          <div className="text-[10px]">{slot.size}</div>
                        </div>
                      )}
                    </div>

                    {/* Upload */}
                    <input
                      type="file" accept="image/*"
                      ref={el => { fileRefs.current[slot.id] = el }}
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) uploadImage(slot.id, f)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={() => fileRefs.current[slot.id]?.click()}
                      disabled={uploading === slot.id}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Upload size={14} />
                      {uploading === slot.id ? 'Đang tải...' : 'Tải ảnh lên'}
                    </button>
                    {slot.image && (
                      <button
                        onClick={() => updateSlot(slot.id, { image: '' })}
                        className="mt-1.5 w-full flex items-center justify-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-semibold py-1.5 rounded-xl transition-colors"
                      >
                        <X size={12} /> Xóa ảnh
                      </button>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Link URL */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Đường dẫn khi click vào quảng cáo
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={slot.linkUrl}
                          onChange={e => updateSlot(slot.id, { linkUrl: e.target.value })}
                          placeholder="https://website-khachhang.vn"
                          className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                        />
                        {slot.linkUrl && (
                          <a href={slot.linkUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0">
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Alt text */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Tên thương hiệu / Nội dung quảng cáo
                      </label>
                      <input
                        type="text"
                        value={slot.altText}
                        onChange={e => updateSlot(slot.id, { altText: e.target.value })}
                        placeholder="VD: Quảng cáo Resort Thiên Cầm"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                      />
                    </div>

                    {/* Open in new tab */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-700">Mở link trong tab mới</div>
                        <div className="text-xs text-gray-400">Khuyến nghị bật để giữ người dùng trên web</div>
                      </div>
                      <button
                        onClick={() => updateSlot(slot.id, { linkTarget: slot.linkTarget === '_blank' ? '_self' : '_blank' })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${slot.linkTarget === '_blank' ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${slot.linkTarget === '_blank' ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Giá tham khảo hint */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <div className="text-xs font-bold text-amber-800 mb-1">💡 Báo giá mẫu cho khách hàng</div>
                      <div className="text-xs text-amber-700 space-y-0.5">
                        {slot.type === 'horizontal' && <><p>• Banner ngang 1 tuần: 200.000 – 500.000đ</p><p>• Banner ngang 1 tháng: 500.000 – 1.500.000đ</p></>}
                        {slot.type === 'rectangle' && <><p>• Sidebar 1 tuần: 150.000 – 400.000đ</p><p>• Sidebar 1 tháng: 400.000 – 1.000.000đ</p></>}
                        {slot.type === 'prefooter' && <><p>• Banner cuối trang 1 tuần: 500.000 – 1.000.000đ</p><p>• Banner cuối trang 1 tháng: 1.500.000 – 3.000.000đ</p></>}
                      </div>
                    </div>

                    {/* Save button */}
                    <button
                      onClick={() => saveSlot(slot)}
                      disabled={saving === slot.id}
                      className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
                    >
                      <Save size={16} />
                      {saving === slot.id ? 'Đang lưu...' : 'Lưu cài đặt slot này'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all ${toast.ok ? 'bg-green-700' : 'bg-red-600'}`}>
          {toast.ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
