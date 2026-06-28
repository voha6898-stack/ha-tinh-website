"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Save, Upload, RefreshCw, CheckCircle, AlignLeft, AlignCenter, AlignRight, ArrowUp, AlignVerticalJustifyCenter, ArrowDown, Palette } from 'lucide-react'

// ─── Content fields ───────────────────────────────────────────────────────────
const CONTENT_FIELDS = [
  { key: 'heroTitle',      label: 'Tiêu đề chính',           type: 'text',     placeholder: 'HÀ TĨNH',      hint: 'Chữ lớn nhất trên trang chủ' },
  { key: 'heroSubtitle',   label: 'Tiêu đề phụ',              type: 'text',     placeholder: 'CÓ GÌ?',       hint: 'Dòng vàng phía dưới tiêu đề' },
  { key: 'heroAccentText', label: 'Nhãn nhỏ trên cùng',       type: 'text',     placeholder: 'KHÁM PHÁ · BẮC TRUNG BỘ · VIỆT NAM', hint: 'Dòng chữ nhỏ dạng CAPSLOCK' },
  { key: 'heroTagline',    label: 'Câu tagline mô tả',         type: 'textarea', placeholder: 'Vùng đất của di sản ngàn năm...', hint: 'Mô tả ngắn hiện dưới tiêu đề' },
  { key: 'heroImage',      label: 'Hình nền trang chủ',        type: 'image',    placeholder: '',              hint: 'Ảnh phong cảnh Hà Tĩnh chất lượng cao' },
  { key: 'heroStat1',      label: 'Thống kê 1',                type: 'text',     placeholder: '🏖️ 137km bờ biển', hint: 'Hiện ở thanh cuối hero' },
  { key: 'heroStat2',      label: 'Thống kê 2',                type: 'text',     placeholder: '⛰️ Núi Hồng 99 ngọn', hint: '' },
  { key: 'heroStat3',      label: 'Thống kê 3',                type: 'text',     placeholder: '🏛️ 73+ di tích quốc gia', hint: '' },
  { key: 'heroStat4',      label: 'Thống kê 4',                type: 'text',     placeholder: '🍜 Ẩm thực OCOP đặc sắc', hint: '' },
  { key: 'atmosphereQuote',   label: 'Câu trích dẫn (section giữa)', type: 'textarea', placeholder: 'Núi Hồng in bóng...', hint: 'Câu thơ/trích dẫn section khí quyển' },
  { key: 'atmosphereSubtext', label: 'Mô tả phụ section khí quyển', type: 'text',     placeholder: 'Hà Tĩnh — nơi hồn thiêng...', hint: '' },
  { key: 'atmosphereImage',   label: 'Hình nền section khí quyển',  type: 'image',    placeholder: '',  hint: 'Ảnh núi non/sông nước Hà Tĩnh' },
]

const PRESET_THEMES = [
  { name: '🌿 Lá Xanh',      primary: '#1B5E20', accent: '#D4A017', desc: 'Mặc định — xanh rừng & vàng đất' },
  { name: '🔴 Đỏ Việt',      primary: '#B71C1C', accent: '#FFC107', desc: 'Đỏ truyền thống & vàng rực' },
  { name: '🌊 Biển Xanh',    primary: '#0D47A1', accent: '#00BCD4', desc: 'Xanh dương đại dương & cyan' },
  { name: '🟤 Đất Vàng',     primary: '#4E342E', accent: '#FF8F00', desc: 'Nâu đất & cam mật' },
  { name: '💜 Tím Hoàng Gia', primary: '#4A148C', accent: '#FFD700', desc: 'Tím hoàng gia & vàng kim' },
  { name: '🌑 Đêm Tối',      primary: '#212121', accent: '#F44336', desc: 'Tối hiện đại & đỏ nhấn' },
]

const FOOTER_FIELDS = [
  { key: 'footerPhone',     label: 'Đường dây du lịch (SĐT)',  type: 'text',     placeholder: '0239 3852 xxx',                       hint: 'Số điện thoại hiển thị cuối trang' },
  { key: 'footerEmail',     label: 'Email liên hệ',             type: 'text',     placeholder: 'dulich@hatinh.gov.vn',                hint: 'Gmail / email liên hệ cuối trang' },
  { key: 'footerAddress',   label: 'Địa chỉ',                   type: 'text',     placeholder: 'Tỉnh Hà Tĩnh, Bắc Trung Bộ, Việt Nam', hint: 'Địa chỉ hiển thị trong footer' },
  { key: 'footerCopyright', label: 'Dòng bản quyền',            type: 'text',     placeholder: '© 2025 Hà Tĩnh Có Gì?',              hint: 'Text hiển thị ở thanh dưới cùng footer' },
]

// ─── Style option definitions ─────────────────────────────────────────────────
const TEXT_ALIGN_OPTIONS = [
  { value: 'left',   label: 'Trái',  Icon: AlignLeft },
  { value: 'center', label: 'Giữa', Icon: AlignCenter },
  { value: 'right',  label: 'Phải', Icon: AlignRight },
]
const VERT_ALIGN_OPTIONS = [
  { value: 'top',    label: 'Trên',  Icon: ArrowUp },
  { value: 'center', label: 'Giữa', Icon: AlignVerticalJustifyCenter },
  { value: 'bottom', label: 'Dưới', Icon: ArrowDown },
]
const TITLE_SIZE_OPTIONS = [
  { value: 'sm', label: 'Nhỏ',     preview: 'text-2xl' },
  { value: 'md', label: 'Vừa',     preview: 'text-3xl' },
  { value: 'lg', label: 'Lớn',     preview: 'text-4xl' },
  { value: 'xl', label: 'Rất lớn', preview: 'text-5xl' },
]
const COLOR_OPTIONS = [
  { value: 'white', label: 'Trắng', bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-700' },
  { value: 'gold',  label: 'Vàng',  bg: 'bg-amber-400', border: 'border-amber-500', text: 'text-amber-900' },
  { value: 'red',   label: 'Đỏ',    bg: 'bg-red-400', border: 'border-red-500', text: 'text-red-900' },
]

type SiteData = Record<string, string | number>

export default function AdminSitePage() {
  const [data, setData] = useState<SiteData>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/content/site')
      .then(r => r.json())
      .then(d => setData(d as SiteData))
  }, [])

  const set = (key: string, value: string | number) =>
    setData(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await fetch('/api/content/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpload = async (key: string, file: File) => {
    setUploading(key)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await res.json()
      set(key, url)
    } finally {
      setUploading(null)
    }
  }

  const SaveBtn = ({ className = '' }: { className?: string }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
        saved ? 'bg-green-600 text-white' : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'
      } ${className}`}
    >
      {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
      {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
    </button>
  )

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tiêu đề & Giao diện</h1>
          <p className="text-slate-500 text-sm mt-1">Chỉnh sửa nội dung, phong cách và vị trí tiêu đề trang chủ</p>
        </div>
        <SaveBtn />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: PHONG CÁCH & VỊ TRÍ
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-vn-gold-400 rounded-full" />
          <h2 className="font-black text-slate-800 text-base">Phong cách & Vị trí chữ</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Preview banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-end gap-4 min-h-[100px] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: `url('${data.heroImage || ''}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-black" style={{ opacity: (Number(data.heroOverlayOpacity) || 55) / 100 }} />
            <div className={`relative z-10 flex flex-col ${
              data.heroTextAlign === 'center' ? 'items-center w-full text-center' :
              data.heroTextAlign === 'right'  ? 'items-end w-full text-right'  :
              'items-start'
            }`}>
              <span className="text-white font-black leading-none" style={{ fontSize: TITLE_SIZE_PREVIEW[String(data.heroTitleSize) || 'lg'] }}>
                {String(data.heroTitle || 'HÀ TĨNH')}
              </span>
              <span className={`font-black italic leading-none ${COLOR_PREVIEW[String(data.heroSubtitleColor) || 'gold']}`}
                style={{ fontSize: SUBTITLE_SIZE_PREVIEW[String(data.heroTitleSize) || 'lg'] }}>
                {String(data.heroSubtitle || 'CÓ GÌ?')}
              </span>
            </div>
            <span className="absolute top-2 right-3 text-white/30 text-[10px] tracking-widest uppercase z-10">Preview</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Vị trí ngang */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Vị trí ngang</label>
              <div className="flex gap-2">
                {TEXT_ALIGN_OPTIONS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => set('heroTextAlign', value)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      (data.heroTextAlign ?? 'left') === value
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vị trí dọc */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Vị trí dọc</label>
              <div className="flex gap-2">
                {VERT_ALIGN_OPTIONS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => set('heroVerticalAlign', value)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      (data.heroVerticalAlign ?? 'center') === value
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cỡ chữ */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cỡ chữ tiêu đề</label>
              <div className="flex gap-2">
                {TITLE_SIZE_OPTIONS.map(({ value, label, preview }) => (
                  <button
                    key={value}
                    onClick={() => set('heroTitleSize', value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 font-bold transition-all ${
                      (data.heroTitleSize ?? 'lg') === value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className={`${preview} font-black leading-none ${(data.heroTitleSize ?? 'lg') === value ? 'text-green-700' : 'text-slate-400'}`}>A</span>
                    <span className="text-[10px] uppercase tracking-wide mt-0.5">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Màu chữ tiêu đề chính */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Màu chữ tiêu đề chính</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(({ value, label, bg, border }) => (
                  <button
                    key={value}
                    onClick={() => set('heroTitleColor', value)}
                    className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      (data.heroTitleColor ?? 'white') === value
                        ? `${border} bg-opacity-10 ring-2 ring-offset-1 ring-green-500`
                        : 'border-gray-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${bg} border ${border} flex-shrink-0`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu chữ tiêu đề phụ */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Màu chữ tiêu đề phụ</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(({ value, label, bg, border }) => (
                  <button
                    key={value}
                    onClick={() => set('heroSubtitleColor', value)}
                    className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      (data.heroSubtitleColor ?? 'gold') === value
                        ? `${border} bg-opacity-10 ring-2 ring-offset-1 ring-green-500`
                        : 'border-gray-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${bg} border ${border} flex-shrink-0`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Độ tối nền */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Độ tối lớp phủ nền</label>
                <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg">
                  {data.heroOverlayOpacity ?? 55}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={5}
                value={Number(data.heroOverlayOpacity ?? 55)}
                onChange={e => set('heroOverlayOpacity', Number(e.target.value))}
                className="w-full accent-green-600 h-2 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Trong suốt</span>
                <span>Tối hơn → chữ nổi hơn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: NỘI DUNG VĂN BẢN
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-400 rounded-full" />
          <h2 className="font-black text-slate-800 text-base">Nội dung văn bản</h2>
        </div>
        <div className="space-y-4">
          {CONTENT_FIELDS.map(field => (
            <div key={field.key} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="block text-sm font-bold text-slate-800 mb-1">{field.label}</label>
              {field.hint && <p className="text-xs text-slate-400 mb-3">{field.hint}</p>}

              {field.type === 'textarea' ? (
                <textarea
                  value={String(data[field.key] ?? '')}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
                />
              ) : field.type === 'image' ? (
                <div className="space-y-3">
                  {data[field.key] && (
                    <div className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={String(data[field.key])} alt={field.label} fill className="object-cover" sizes="600px"
                        unoptimized={String(data[field.key]).startsWith('/')} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={String(data[field.key] ?? '')}
                      onChange={e => set(field.key, e.target.value)}
                      placeholder="Dán URL ảnh..."
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    />
                    <button
                      onClick={() => fileRefs.current[field.key]?.click()}
                      disabled={uploading === field.key}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Upload size={14} />
                      {uploading === field.key ? 'Đang tải...' : 'Upload'}
                    </button>
                    <input
                      ref={el => { fileRefs.current[field.key] = el }}
                      type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && handleUpload(field.key, e.target.files[0])}
                    />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={String(data[field.key] ?? '')}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: GIAO DIỆN MÀU SẮC
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-pink-400 rounded-full" />
          <h2 className="font-black text-slate-800 text-base">Giao diện màu sắc</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5 ml-3">Màu chủ đạo và màu nhấn áp dụng cho Navigation, nút bấm, Footer trên toàn website</p>

        {/* Preset themes */}
        <div className="mb-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Chọn theme có sẵn</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_THEMES.map(t => {
              const isActive = data.themePrimary === t.primary && data.themeAccent === t.accent
              return (
                <button
                  key={t.name}
                  onClick={() => { set('themePrimary', t.primary); set('themeAccent', t.accent) }}
                  className={`relative flex flex-col gap-2 p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                    isActive ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                  {/* Color swatch */}
                  <div className="flex gap-1.5">
                    <div className="w-8 h-8 rounded-xl shadow-sm border border-white/50" style={{ backgroundColor: t.primary }} />
                    <div className="w-8 h-8 rounded-xl shadow-sm border border-white/50" style={{ backgroundColor: t.accent }} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">{t.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom color pickers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Palette size={14} /> Hoặc tùy chỉnh màu riêng
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Primary */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Màu chủ đạo</label>
              <p className="text-xs text-slate-400 mb-3">Navigation, nút chính, icon</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={String(data.themePrimary || '#1B5E20')}
                  onChange={e => set('themePrimary', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <div>
                  <div className="text-sm font-mono font-bold text-slate-700">{String(data.themePrimary || '#1B5E20').toUpperCase()}</div>
                  <div className="w-20 h-5 rounded-lg mt-1 border border-gray-100" style={{ backgroundColor: String(data.themePrimary || '#1B5E20') }} />
                </div>
              </div>
            </div>

            {/* Accent */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Màu nhấn (accent)</label>
              <p className="text-xs text-slate-400 mb-3">Logo phụ, gạch chân link, highlight</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={String(data.themeAccent || '#D4A017')}
                  onChange={e => set('themeAccent', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <div>
                  <div className="text-sm font-mono font-bold text-slate-700">{String(data.themeAccent || '#D4A017').toUpperCase()}</div>
                  <div className="w-20 h-5 rounded-lg mt-1 border border-gray-100" style={{ backgroundColor: String(data.themeAccent || '#D4A017') }} />
                </div>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preview Navigation</div>
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: String(data.themePrimary || '#1B5E20') }}>
                  <span className="text-white text-[10px]">📍</span>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 leading-tight">HÀ TĨNH</div>
                  <div className="text-[9px] font-bold" style={{ color: String(data.themeAccent || '#D4A017') }}>CÓ GÌ?</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {['Du Lịch', 'Ẩm Thực', 'Đặc Sản'].map(l => (
                  <span key={l} className="text-[11px] text-slate-600">{l}</span>
                ))}
                <span className="text-[11px] font-bold text-white px-3 py-1.5 rounded-full" style={{ backgroundColor: String(data.themePrimary || '#1B5E20') }}>
                  Khám phá
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Màu nền (background) ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🎨</span> Màu nền trang web
          </div>

          {/* Preset backgrounds */}
          <div className="mb-5">
            <div className="text-xs text-slate-400 mb-3">Chọn nhanh màu nền</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '⬜ Trắng',       bg: '#ffffff', bgAlt: '#f8fafc' },
                { label: '🟡 Kem nhẹ',     bg: '#FEFDF8', bgAlt: '#FFF9E6' },
                { label: '🟢 Xanh nhạt',   bg: '#F0FDF4', bgAlt: '#DCFCE7' },
                { label: '🔵 Xanh lơ',     bg: '#F0F9FF', bgAlt: '#E0F2FE' },
                { label: '🟣 Tím nhạt',    bg: '#FAF5FF', bgAlt: '#F3E8FF' },
                { label: '🔴 Hồng nhạt',   bg: '#FFF5F5', bgAlt: '#FFE4E6' },
                { label: '⚫ Xám nhạt',    bg: '#F8FAFC', bgAlt: '#F1F5F9' },
                { label: '🌙 Tối (Dark)',  bg: '#0f172a', bgAlt: '#1e293b' },
              ].map(p => {
                const isActive = data.themeBg === p.bg && data.themeBgAlt === p.bgAlt
                const isDark = p.bg === '#0f172a'
                return (
                  <button
                    key={p.label}
                    onClick={() => { set('themeBg', p.bg); set('themeBgAlt', p.bgAlt) }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      isActive ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: p.bg, color: isDark ? '#fff' : '#334155' }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: p.bgAlt }}
                    />
                    {p.label}
                    {isActive && <span className="text-green-600">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom pickers */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Màu nền chính</label>
              <p className="text-xs text-slate-400 mb-2">Áp dụng cho toàn bộ trang</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={String(data.themeBg || '#ffffff')}
                  onChange={e => set('themeBg', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <div>
                  <div className="text-sm font-mono font-bold text-slate-700">{String(data.themeBg || '#ffffff').toUpperCase()}</div>
                  <div className="w-20 h-5 rounded-lg mt-1 border border-gray-200" style={{ backgroundColor: String(data.themeBg || '#ffffff') }} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Màu nền xen kẽ</label>
              <p className="text-xs text-slate-400 mb-2">Cho các section phụ, card</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={String(data.themeBgAlt || '#f8fafc')}
                  onChange={e => set('themeBgAlt', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <div>
                  <div className="text-sm font-mono font-bold text-slate-700">{String(data.themeBgAlt || '#f8fafc').toUpperCase()}</div>
                  <div className="w-20 h-5 rounded-lg mt-1 border border-gray-200" style={{ backgroundColor: String(data.themeBgAlt || '#f8fafc') }} />
                </div>
              </div>
            </div>
          </div>

          {/* Preview page bg */}
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preview màu nền</div>
            <div
              className="rounded-xl border border-gray-200 p-4 space-y-2"
              style={{ backgroundColor: String(data.themeBg || '#ffffff') }}
            >
              <div
                className="h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor: String(data.themeBgAlt || '#f8fafc') }}
              />
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-lg border border-gray-200" style={{ backgroundColor: String(data.themeBg || '#ffffff') }} />
                <div className="h-16 flex-1 rounded-lg border border-gray-200" style={{ backgroundColor: String(data.themeBgAlt || '#f8fafc') }} />
              </div>
              <p className="text-[11px] text-center" style={{ color: String(data.themeBg || '#ffffff') === '#0f172a' ? '#94a3b8' : '#64748b' }}>
                Nền chính &amp; nền xen kẽ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: THÔNG TIN FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-slate-500 rounded-full" />
          <h2 className="font-black text-slate-800 text-base">Thông tin Footer</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4 ml-3">Thông tin liên hệ và bản quyền hiển thị ở cuối mỗi trang</p>

        {/* Preview */}
        <div className="bg-slate-900 rounded-2xl px-6 py-5 mb-4">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-forest-400">📍</span>
              <span>{String(data.footerAddress || 'Tỉnh Hà Tĩnh, Bắc Trung Bộ, Việt Nam')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-forest-400">📞</span>
              <span>Đường dây du lịch: {String(data.footerPhone || '0239 3852 xxx')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-forest-400">✉️</span>
              <span>{String(data.footerEmail || 'dulich@hatinh.gov.vn')}</span>
            </div>
            <div className="border-t border-slate-700 mt-2 pt-2 text-slate-500 text-xs">
              {String(data.footerCopyright || '© 2025 Hà Tĩnh Có Gì? — Thông tin du lịch tỉnh Hà Tĩnh')}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {FOOTER_FIELDS.map(field => (
            <div key={field.key} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="block text-sm font-bold text-slate-800 mb-1">{field.label}</label>
              {field.hint && <p className="text-xs text-slate-400 mb-3">{field.hint}</p>}
              <input
                type="text"
                value={String(data[field.key] ?? '')}
                onChange={e => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save */}
      <div className="sticky bottom-6 flex justify-end">
        <SaveBtn className="px-8 py-3 font-bold shadow-lg" />
      </div>
    </div>
  )
}

// ─── Local preview helpers (not in Hero.tsx scope) ───────────────────────────
const TITLE_SIZE_PREVIEW: Record<string, string> = {
  sm: '1.6rem', md: '2.2rem', lg: '3rem', xl: '3.8rem'
}
const SUBTITLE_SIZE_PREVIEW: Record<string, string> = {
  sm: '1rem', md: '1.4rem', lg: '1.8rem', xl: '2.3rem'
}
const COLOR_PREVIEW: Record<string, string> = {
  white: 'text-white',
  gold:  'text-amber-400',
  red:   'text-red-400',
}
