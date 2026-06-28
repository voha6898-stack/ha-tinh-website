"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Trash2, Upload, Save, RefreshCw, CheckCircle,
  GripVertical, Eye, EyeOff, ImagePlus
} from 'lucide-react'

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  visible: boolean
}

function uid() {
  return 'gallery-' + Math.random().toString(36).slice(2, 9)
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const addFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content/gallery')
      .then(r => r.json())
      .then(d => setItems((d.items || []).map((it: GalleryImage) => ({ ...it, visible: it.visible !== false }))))
  }, [])

  const save = async (list = items) => {
    setSaving(true); setSaved(false)
    await fetch('/api/content/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: list }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const update = (id: string, patch: Partial<GalleryImage>) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it))

  const remove = (id: string) =>
    setItems(prev => prev.filter(it => it.id !== id))

  const addBlank = () =>
    setItems(prev => [...prev, { id: uid(), src: '', alt: '', caption: '', visible: true }])

  const uploadFile = async (id: string, file: File) => {
    setUploading(id)
    try {
      const form = new FormData(); form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      update(id, { src: url })
    } finally { setUploading(null) }
  }

  const uploadAndAdd = async (file: File) => {
    const tempId = uid()
    const newItem: GalleryImage = { id: tempId, src: '', alt: file.name.replace(/\.[^.]+$/, ''), caption: '', visible: true }
    setItems(prev => [...prev, newItem])
    setUploading(tempId)
    try {
      const form = new FormData(); form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      setItems(prev => prev.map(it => it.id === tempId ? { ...it, src: url } : it))
    } finally { setUploading(null) }
  }

  // Drag reorder
  const dragItem = useRef<number | null>(null)
  const dragTarget = useRef<number | null>(null)

  const onDragStart = (i: number) => { dragItem.current = i }
  const onDragEnter = (i: number) => { dragTarget.current = i; setDragOver(items[i]?.id ?? null) }
  const onDragEnd = () => {
    if (dragItem.current === null || dragTarget.current === null) return
    const next = [...items]
    const [moved] = next.splice(dragItem.current, 1)
    next.splice(dragTarget.current, 0, moved)
    dragItem.current = null; dragTarget.current = null; setDragOver(null)
    setItems(next)
  }

  const visible = items.filter(it => it.visible !== false).length

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gallery Hà Tĩnh</h1>
          <p className="text-slate-500 text-sm mt-1">
            {items.length} ảnh · {visible} đang hiển thị · Kéo thả để sắp xếp
          </p>
        </div>
        <button
          onClick={() => save()}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
            saved ? 'bg-green-600 text-white' : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'
          }`}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Add buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => addFileRef.current?.click()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Upload size={16} />
          Upload ảnh mới
        </button>
        <input ref={addFileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => Array.from(e.target.files || []).forEach(f => uploadAndAdd(f))} />

        <button
          onClick={addBlank}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Thêm từ URL
        </button>
      </div>

      {/* Grid of image cards */}
      {items.length === 0 ? (
        <div
          onClick={() => addFileRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
        >
          <ImagePlus size={40} className="mx-auto text-slate-400 mb-3" />
          <p className="text-slate-500 font-semibold">Chưa có ảnh. Click để upload</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`bg-white rounded-2xl border-2 transition-all shadow-sm overflow-hidden ${
                dragOver === img.id ? 'border-blue-400 scale-[1.02] shadow-lg' : 'border-gray-100'
              } ${img.visible === false ? 'opacity-50' : ''}`}
            >
              {/* Image preview */}
              <div className="relative aspect-video bg-slate-100 group">
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt || 'Gallery image'}
                    fill
                    className="object-cover"
                    sizes="400px"
                    unoptimized={img.src.startsWith('/')}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    {uploading === img.id
                      ? <RefreshCw size={28} className="animate-spin text-blue-400" />
                      : <ImagePlus size={28} />
                    }
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => fileRefs.current[img.id]?.click()}
                    disabled={uploading === img.id}
                    className="bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload size={12} />
                    Đổi ảnh
                  </button>
                  <input
                    ref={el => { fileRefs.current[img.id] = el }}
                    type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadFile(img.id, e.target.files[0])}
                  />
                </div>

                {/* Drag handle */}
                <div className="absolute top-2 left-2 bg-black/40 rounded-lg p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} className="text-white" />
                </div>

                {/* Visibility badge */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => update(img.id, { visible: !img.visible })}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      img.visible !== false
                        ? 'bg-green-500/90 text-white'
                        : 'bg-black/50 text-white/70'
                    }`}
                  >
                    {img.visible !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                    {img.visible !== false ? 'Hiện' : 'Ẩn'}
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="p-4 space-y-3">
                {/* URL input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">URL ảnh</label>
                  <input
                    type="text"
                    value={img.src}
                    onChange={e => update(img.id, { src: e.target.value })}
                    placeholder="https:// hoặc /uploads/..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Caption (hiển thị khi hover)</label>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={e => update(img.id, { caption: e.target.value })}
                    placeholder="Mô tả ngắn về ảnh..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>

                {/* Alt */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alt text (SEO)</label>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={e => update(img.id, { alt: e.target.value })}
                    placeholder="Mô tả nội dung ảnh cho SEO..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>

                {/* Delete */}
                <button
                  onClick={() => remove(img.id)}
                  className="w-full flex items-center justify-center gap-2 border border-red-100 hover:bg-red-50 hover:border-red-300 text-red-400 hover:text-red-600 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Trash2 size={12} />
                  Xóa ảnh này
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky save bottom */}
      {items.length > 0 && (
        <div className="sticky bottom-6 mt-8 flex justify-end">
          <button
            onClick={() => save()}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'
            }`}
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Đang lưu...' : saved ? 'Đã lưu thành công!' : 'Lưu tất cả thay đổi'}
          </button>
        </div>
      )}
    </div>
  )
}
