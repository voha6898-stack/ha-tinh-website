"use client"

import { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical, Save, Eye, EyeOff, Zap } from 'lucide-react'

type Message = { id: string; text: string; visible: boolean }
type TickerData = {
  enabled: boolean
  speed: 'slow' | 'normal' | 'fast'
  bgColor: 'amber' | 'green' | 'red' | 'blue' | 'black'
  messages: Message[]
}

const SPEED_OPTS = [
  { value: 'slow',   label: '🐢 Chậm',  desc: '~60 giây/vòng' },
  { value: 'normal', label: '🚶 Vừa',    desc: '~35 giây/vòng' },
  { value: 'fast',   label: '🚀 Nhanh', desc: '~18 giây/vòng' },
]
const COLOR_OPTS = [
  { value: 'amber', label: 'Vàng LED',   preview: 'bg-[#1a1000] text-amber-300' },
  { value: 'green', label: 'Xanh lá',   preview: 'bg-[#001a00] text-green-300' },
  { value: 'red',   label: 'Đỏ',         preview: 'bg-[#1a0000] text-red-300' },
  { value: 'blue',  label: 'Xanh dương', preview: 'bg-[#00061a] text-blue-300' },
  { value: 'black', label: 'Trắng/Đen',  preview: 'bg-[#0a0a0a] text-white' },
]

const DEFAULT: TickerData = {
  enabled: true, speed: 'normal', bgColor: 'amber', messages: []
}

export default function TickerAdminPage() {
  const [data, setData] = useState<TickerData>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newText, setNewText] = useState('')

  useEffect(() => {
    fetch('/api/content/ticker')
      .then(r => r.json())
      .then(d => setData(d as TickerData))
  }, [])

  const save = async (d: TickerData) => {
    setSaving(true); setSaved(false)
    await fetch('/api/content/ticker', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const update = (patch: Partial<TickerData>) => {
    const next = { ...data, ...patch }
    setData(next); save(next)
  }

  const addMessage = () => {
    if (!newText.trim()) return
    const msg: Message = { id: `t${Date.now()}`, text: newText.trim(), visible: true }
    const next = { ...data, messages: [...data.messages, msg] }
    setData(next); save(next); setNewText('')
  }

  const updateMsg = (id: string, patch: Partial<Message>) => {
    const next = { ...data, messages: data.messages.map(m => m.id === id ? { ...m, ...patch } : m) }
    setData(next); save(next)
  }

  const deleteMsg = (id: string) => {
    const next = { ...data, messages: data.messages.filter(m => m.id !== id) }
    setData(next); save(next)
  }

  const visibleCount = data.messages.filter(m => m.visible).length

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap size={24} className="text-amber-500" />
            Quảng cáo LED Ticker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Thanh chữ chạy kiểu LED trên đầu website · {visibleCount}/{data.messages.length} tin đang hiện
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600 font-semibold">✓ Đã lưu</span>}
          {saving && <span className="text-xs text-slate-400">Đang lưu...</span>}
        </div>
      </div>

      {/* PREVIEW */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-slate-700 px-4 py-2 text-xs text-slate-300 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Preview trực tiếp (hover để dừng)
        </div>
        <div className={`relative overflow-hidden`}
          style={{
            background: data.bgColor === 'amber' ? '#1a1000' : data.bgColor === 'green' ? '#001a00' : data.bgColor === 'red' ? '#1a0000' : data.bgColor === 'blue' ? '#00061a' : '#0a0a0a',
            height: '48px',
          }}>
          <style>{`
            @keyframes preview-scroll {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .preview-led { animation: preview-scroll ${ data.speed === 'slow' ? '20s' : data.speed === 'fast' ? '8s' : '13s' } linear infinite; white-space: nowrap; }
            .preview-led:hover { animation-play-state: paused; }
          `}</style>
          {/* Label */}
          <div className={`absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 text-xs font-black uppercase ${
            data.bgColor === 'black' ? 'bg-white text-black' : 'bg-amber-500 text-black'
          }`} style={{ minWidth: '70px' }}>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />LIVE</span>
          </div>
          <div className="overflow-hidden h-full ml-[70px] flex items-center">
            {data.messages.filter(m => m.visible).length > 0 ? (
              <div className="preview-led font-mono font-bold text-sm"
                style={{
                  color: data.bgColor === 'amber' ? '#fcd34d' : data.bgColor === 'green' ? '#86efac' : data.bgColor === 'red' ? '#fca5a5' : data.bgColor === 'blue' ? '#93c5fd' : '#ffffff',
                  filter: 'drop-shadow(0 0 6px currentColor)',
                }}>
                {data.messages.filter(m => m.visible).map(m => m.text).join('   ·   ')}
              </div>
            ) : (
              <span className="text-white/30 text-xs ml-4">Chưa có tin nhắn nào...</span>
            )}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Bật/tắt */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">Bật ticker trên web</div>
              <div className="text-xs text-slate-400 mt-0.5">Hiện thanh LED ngay bên dưới navigation</div>
            </div>
            <button
              onClick={() => update({ enabled: !data.enabled })}
              className={`relative w-14 h-7 rounded-full transition-colors ${data.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.enabled ? 'translate-x-7' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tốc độ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tốc độ cuộn</div>
          <div className="flex gap-2">
            {SPEED_OPTS.map(opt => (
              <button key={opt.value}
                onClick={() => update({ speed: opt.value as 'slow' | 'normal' | 'fast' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  data.speed === opt.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Màu LED */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Màu LED</div>
        <div className="flex flex-wrap gap-3">
          {COLOR_OPTS.map(opt => (
            <button key={opt.value}
              onClick={() => update({ bgColor: opt.value as TickerData['bgColor'] })}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                data.bgColor === opt.value
                  ? 'border-green-500 ring-2 ring-green-200'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className={`w-6 h-4 rounded flex items-center justify-center ${opt.preview} text-[8px] font-mono`}>LED</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* TIN NHẮN */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="font-bold text-slate-800">Nội dung quảng cáo</div>
          <span className="text-xs text-slate-400">{data.messages.length} dòng</span>
        </div>

        {/* Add new */}
        <div className="px-5 py-4 border-b border-gray-100 bg-green-50/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMessage()}
              placeholder="Nhập nội dung quảng cáo... (Enter để thêm)"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
            <button
              onClick={addMessage}
              disabled={!newText.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
            >
              <Plus size={16} /> Thêm
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Tip: Dùng emoji đầu câu cho sinh động · VD: 🏖️ Biển Thiên Cầm đang vào mùa đẹp nhất!</p>
        </div>

        {/* Messages list */}
        <div className="divide-y divide-gray-50">
          {data.messages.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">
              Chưa có nội dung nào. Thêm tin nhắn đầu tiên ở trên.
            </div>
          )}
          {data.messages.map((msg, idx) => (
            <div key={msg.id} className={`flex items-center gap-3 px-5 py-3 transition-colors ${msg.visible ? '' : 'opacity-40'}`}>
              <GripVertical size={16} className="text-gray-300 flex-shrink-0 cursor-grab" />
              <span className="text-xs text-slate-400 w-5 flex-shrink-0 font-mono">{idx + 1}</span>
              <input
                type="text"
                value={msg.text}
                onChange={e => updateMsg(msg.id, { text: e.target.value })}
                onBlur={() => save(data)}
                className="flex-1 text-sm text-slate-700 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-green-400 focus:outline-none py-1 transition-colors"
              />
              <button
                onClick={() => updateMsg(msg.id, { visible: !msg.visible })}
                title={msg.visible ? 'Ẩn tin này' : 'Hiện tin này'}
                className={`p-1.5 rounded-lg transition-colors ${msg.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {msg.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                onClick={() => deleteMsg(msg.id)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
        <div className="font-bold mb-2">💡 Mẹo sử dụng hiệu quả</div>
        <ul className="space-y-1 text-xs list-disc list-inside text-amber-700">
          <li>Mỗi tin nên ngắn gọn, 1–2 câu, có emoji đầu câu để thu hút</li>
          <li>Dùng &quot;Đăng ký gian hàng&quot; hoặc số điện thoại liên hệ để tăng khách</li>
          <li>Thay đổi nội dung theo mùa: lễ hội, mùa thu hoạch, khuyến mãi...</li>
          <li>Hover vào thanh LED trên web để dừng cuộn và đọc kỹ</li>
        </ul>
      </div>
    </div>
  )
}
