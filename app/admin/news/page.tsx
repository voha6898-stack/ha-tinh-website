"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import {
  Plus, Trash2, Save, RefreshCw, CheckCircle,
  Upload, Eye, EyeOff, Star, Newspaper, Edit3, X
} from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  category: 'dia-phuong' | 'xa-hoi' | 'chinh-tri'
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  visible: boolean
  tags: string[]
}

interface Rating { average: number; count: number }

const CATEGORIES = {
  'dia-phuong': { label: 'Địa Phương', color: 'bg-green-100 text-green-700' },
  'xa-hoi':     { label: 'Xã Hội',    color: 'bg-blue-100 text-blue-700'  },
  'chinh-tri':  { label: 'Chính Trị', color: 'bg-red-100 text-red-700'    },
}

function uid() { return 'news-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }
function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/content/news')
      .then(r => r.json())
      .then(d => setArticles((d.items || []).map((a: Article) => ({ ...a, visible: a.visible !== false }))))
  }, [])

  useEffect(() => {
    articles.forEach(a => {
      if (!ratings[a.id]) {
        fetch(`/api/ratings/${a.id}`)
          .then(r => r.json())
          .then(d => setRatings(prev => ({ ...prev, [a.id]: d })))
      }
    })
  }, [articles])

  const save = async () => {
    setSaving(true); setSaved(false)
    await fetch('/api/content/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: articles }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const update = (id: string, patch: Partial<Article>) =>
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))

  const addNew = () => {
    const id = uid()
    const blank: Article = {
      id, title: '', slug: '', category: 'dia-phuong',
      excerpt: '', content: '', image: '', author: 'Ban Biên Tập',
      publishedAt: new Date().toISOString().slice(0, 10) + 'T08:00:00Z',
      visible: true, tags: [],
    }
    setArticles(prev => [blank, ...prev])
    setEditing(id)
  }

  const remove = (id: string) => {
    if (!confirm('Xóa bài viết này?')) return
    setArticles(prev => prev.filter(a => a.id !== id))
    if (editing === id) setEditing(null)
  }

  const uploadImage = async (id: string, file: File) => {
    setUploading(true)
    try {
      const form = new FormData(); form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      update(id, { image: url })
    } finally { setUploading(false) }
  }

  const editingArticle = articles.find(a => a.id === editing)

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản lý Tin Tức</h1>
          <p className="text-slate-500 text-sm mt-1">{articles.length} bài viết · {articles.filter(a => a.visible).length} đang hiển thị</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} />Thêm bài mới
          </button>
          <button onClick={save} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${saved ? 'bg-green-600 text-white' : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'}`}>
            {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Article list */}
        <div className="flex-1 space-y-3 min-w-0">
          {articles.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Chưa có bài viết. Nhấn "Thêm bài mới"</p>
            </div>
          )}
          {articles.map(article => {
            const cat = CATEGORIES[article.category]
            const r = ratings[article.id]
            const isEditing = editing === article.id
            return (
              <div key={article.id}
                className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${isEditing ? 'border-green-500' : 'border-gray-100 hover:border-gray-200'}`}>
                {/* Card header */}
                <div className="flex items-start gap-4 p-4">
                  {article.image ? (
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <Image src={article.image} alt="" fill className="object-cover" sizes="80px" unoptimized={article.image.startsWith('/')} />
                    </div>
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                      <Newspaper size={20} className="text-slate-300" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                      {!article.visible && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Ẩn</span>}
                    </div>
                    <p className="font-bold text-slate-800 text-sm leading-snug truncate">
                      {article.title || <span className="text-slate-400 italic">Chưa có tiêu đề</span>}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{article.author}</span>
                      {r?.count > 0 && <span className="text-amber-500">★ {r.average.toFixed(1)} ({r.count} đánh giá)</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => update(article.id, { visible: !article.visible })}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                      {article.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => setEditing(isEditing ? null : article.id)}
                      className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-green-100 text-green-700' : 'hover:bg-slate-100 text-slate-400'}`}>
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => remove(article.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Inline editor */}
                {isEditing && (
                  <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                    {/* Image */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tiêu đề *</label>
                        <input value={article.title}
                          onChange={e => update(article.id, { title: e.target.value, slug: slugify(e.target.value) })}
                          placeholder="Tiêu đề bài viết..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Danh mục</label>
                        <select value={article.category} onChange={e => update(article.id, { category: e.target.value as Article['category'] })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white">
                          <option value="dia-phuong">Địa Phương</option>
                          <option value="xa-hoi">Xã Hội</option>
                          <option value="chinh-tri">Chính Trị</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tác giả</label>
                        <input value={article.author} onChange={e => update(article.id, { author: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Ngày đăng</label>
                        <input type="date" value={article.publishedAt.slice(0, 10)}
                          onChange={e => update(article.id, { publishedAt: e.target.value + 'T08:00:00Z' })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Ảnh đại diện</label>
                      <div className="flex gap-2">
                        <input value={article.image} onChange={e => update(article.id, { image: e.target.value })}
                          placeholder="URL hoặc upload ảnh..."
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                          <Upload size={13} />{uploading ? '...' : 'Upload'}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                          onChange={e => e.target.files?.[0] && uploadImage(article.id, e.target.files[0])} />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tóm tắt (hiện trên listing)</label>
                      <textarea value={article.excerpt} onChange={e => update(article.id, { excerpt: e.target.value })}
                        rows={2} placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none" />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nội dung bài viết (phân đoạn bằng dòng trống)</label>
                      <textarea value={article.content} onChange={e => update(article.id, { content: e.target.value })}
                        rows={10} placeholder="Nhập nội dung bài viết. Để trống 1 dòng giữa các đoạn văn..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-y font-mono" />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tags (cách nhau bằng dấu phẩy)</label>
                      <input value={(article.tags || []).join(', ')}
                        onChange={e => update(article.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="du lịch, biển, hà tĩnh..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <a href={`/tin-tuc/${article.slug}`} target="_blank"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Eye size={12} />Xem trước bài viết
                      </a>
                      <button onClick={() => setEditing(null)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-semibold">
                        <X size={14} />Đóng editor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stats sidebar */}
        <div className="w-56 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              Điểm đánh giá
            </h3>
            <div className="space-y-3">
              {articles.map(a => {
                const r = ratings[a.id]
                return (
                  <div key={a.id} className="text-xs">
                    <p className="text-slate-600 font-semibold truncate leading-snug mb-1">{a.title || 'Chưa có tiêu đề'}</p>
                    {r?.count > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-[10px] ${s <= Math.round(r.average) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-amber-600 font-bold">{r.average.toFixed(1)}</span>
                        <span className="text-slate-400">({r.count})</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">Chưa có đánh giá</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-slate-700 mb-3">Thống kê</h3>
            {Object.entries(CATEGORIES).map(([key, val]) => {
              const c = articles.filter(a => a.category === key).length
              return (
                <div key={key} className="flex justify-between text-xs mb-2">
                  <span className="text-slate-600">{val.label}</span>
                  <span className="font-bold text-slate-800">{c}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky save */}
      <div className="sticky bottom-6 mt-8 flex justify-end">
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${saved ? 'bg-green-600 text-white' : 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'}`}>
          {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu thành công!' : 'Lưu tất cả thay đổi'}
        </button>
      </div>
    </div>
  )
}
