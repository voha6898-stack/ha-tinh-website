"use client"

import { useState, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Share2, Copy, CheckCircle, Smartphone } from 'lucide-react'

const PRESETS = [
  { label: 'Trang chủ', url: 'https://ha-tinh-website-production.up.railway.app', icon: '🏠' },
  { label: 'Du lịch', url: 'https://ha-tinh-website-production.up.railway.app/#du-lich', icon: '🏖️' },
  { label: 'Ẩm thực', url: 'https://ha-tinh-website-production.up.railway.app/#am-thuc', icon: '🍜' },
  { label: 'Đặc sản', url: 'https://ha-tinh-website-production.up.railway.app/#dac-san', icon: '🛍️' },
  { label: 'Đăng ký gian hàng', url: 'https://ha-tinh-website-production.up.railway.app/dang-ky-gian-hang', icon: '🏪' },
]

const QR_SIZES = [
  { value: 200, label: 'Nhỏ (200px)', desc: 'Danh thiếp, tờ rơi A5' },
  { value: 300, label: 'Vừa (300px)', desc: 'Tờ rơi A4, poster nhỏ' },
  { value: 500, label: 'Lớn (500px)', desc: 'Poster A3, banner' },
]

const QR_COLORS = [
  { fg: '#1B5E20', bg: '#ffffff', label: 'Xanh forest', preview: 'bg-[#1B5E20]' },
  { fg: '#000000', bg: '#ffffff', label: 'Đen trắng',   preview: 'bg-black' },
  { fg: '#B45309', bg: '#fffbeb', label: 'Vàng đồng',   preview: 'bg-[#B45309]' },
  { fg: '#1e3a5f', bg: '#e0f0ff', label: 'Navy xanh',   preview: 'bg-[#1e3a5f]' },
]

export default function QRAdminPage() {
  const [url, setUrl] = useState(PRESETS[0].url)
  const [size, setSize] = useState(300)
  const [colorIdx, setColorIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const svgRef = useRef<HTMLDivElement>(null)

  const color = QR_COLORS[colorIdx]

  const downloadSVG = useCallback(() => {
    if (!svgRef.current) return
    const svg = svgRef.current.querySelector('svg')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `ha-tinh-qr-${Date.now()}.svg`; a.click()
  }, [])

  const downloadPNG = useCallback(async () => {
    if (!svgRef.current) return
    const svg = svgRef.current.querySelector('svg')
    if (!svg) return
    const canvas = document.createElement('canvas')
    const px = size + 40
    canvas.width = px; canvas.height = px
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
    img.onload = () => {
      ctx.fillStyle = color.bg
      ctx.fillRect(0, 0, px, px)
      ctx.drawImage(img, 20, 20, size, size)
      // Add label
      ctx.fillStyle = color.fg
      ctx.font = `bold 18px Arial`
      ctx.textAlign = 'center'
      ctx.fillText('HÀ TĨNH CÓ GÌ?', px / 2, px - 8)
      const a = document.createElement('a')
      a.download = `ha-tinh-qr-${Date.now()}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = URL.createObjectURL(svgBlob)
  }, [size, color])

  const copyUrl = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Smartphone size={24} className="text-green-700" />
          Mã QR Code
        </h1>
        <p className="text-slate-500 text-sm mt-1">Tạo mã QR dẫn vào website để in lên tờ rơi, bảng hiệu, menu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Config */}
        <div className="space-y-5">

          {/* URL Presets */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Chọn trang nhanh</div>
            <div className="space-y-2">
              {PRESETS.map(p => (
                <button key={p.url}
                  onClick={() => setUrl(p.url)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 text-left transition-all ${
                    url === p.url
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  {p.label}
                  {url === p.url && <CheckCircle size={14} className="ml-auto text-green-600" />}
                </button>
              ))}
            </div>

            {/* Custom URL */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Hoặc nhập URL tùy chỉnh</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
                <button onClick={copyUrl}
                  className="p-2 border border-gray-200 rounded-xl text-slate-500 hover:bg-gray-50 transition-colors"
                  title="Copy URL">
                  {copied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kích thước</div>
            <div className="space-y-2">
              {QR_SIZES.map(s => (
                <button key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border-2 transition-all ${
                    size === s.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-xs opacity-60">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Màu sắc</div>
            <div className="grid grid-cols-2 gap-2">
              {QR_COLORS.map((c, i) => (
                <button key={i}
                  onClick={() => setColorIdx(i)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    colorIdx === i
                      ? 'border-green-500 ring-2 ring-green-200 bg-green-50'
                      : 'border-gray-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md ${c.preview} flex-shrink-0`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Preview + Download */}
        <div className="space-y-5">
          {/* QR Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 self-start">Preview</div>

            <div
              ref={svgRef}
              className="rounded-2xl p-5 shadow-md"
              style={{ background: color.bg }}
            >
              <QRCodeSVG
                value={url || 'https://ha-tinh-website-production.up.railway.app'}
                size={Math.min(size, 260)}
                fgColor={color.fg}
                bgColor={color.bg}
                level="M"
                includeMargin={false}
              />
              <div className="mt-3 text-center font-black text-xs tracking-widest" style={{ color: color.fg }}>
                HÀ TĨNH CÓ GÌ?
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">Quét bằng camera điện thoại để mở website</p>
          </div>

          {/* Download */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tải xuống</div>
            <button onClick={downloadPNG}
              className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
              <Download size={18} />
              Tải PNG — In ấn, mạng xã hội
            </button>
            <button onClick={downloadSVG}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 py-3 rounded-xl font-bold text-sm transition-colors">
              <Download size={18} />
              Tải SVG — Chất lượng vô hạn (Corel, AI)
            </button>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="font-bold text-green-800 text-sm mb-2 flex items-center gap-1.5">
              <Share2 size={14} /> Hướng dẫn sử dụng
            </div>
            <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
              <li>In PNG lên tờ rơi, banner, menu nhà hàng, túi đựng</li>
              <li>Dán lên cửa kính cửa hàng, bàn ăn</li>
              <li>Đăng lên Facebook/Zalo kêu gọi scan</li>
              <li>Dùng SVG để in kích thước lớn không mờ</li>
              <li>Tạo QR riêng cho từng trang (Du lịch, Đặc sản...)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
