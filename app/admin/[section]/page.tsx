"use client"

import { useEffect, useState, use } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Star, Save, ExternalLink, Link2 } from 'lucide-react'

interface Field {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image' | 'select' | 'number' | 'url' | 'toggle' | 'array' | 'gallery' | 'date'
  options?: string[]
  placeholder?: string
  hint?: string
  tab?: string
}

// ─── SECTION CONFIG ───────────────────────────────────────────────────────────
const SECTION_CONFIG: Record<string, { title: string; subtitle: string; tabs: string[]; fields: Field[] }> = {
  tourism: {
    title: 'Du Lịch',
    subtitle: 'Các địa điểm tham quan, bãi biển, di tích lịch sử',
    tabs: ['Cơ bản', 'Chi tiết', 'Hình ảnh', 'Đặt phòng'],
    fields: [
      // Tab: Cơ bản
      { key: 'name',        label: 'Tên địa điểm',        type: 'text',     placeholder: 'VD: Bãi Biển Thiên Cầm',              tab: 'Cơ bản' },
      { key: 'location',    label: 'Vị trí / Địa chỉ',   type: 'text',     placeholder: 'VD: Huyện Cẩm Xuyên, cách TP 20km',  tab: 'Cơ bản' },
      { key: 'highlight',   label: 'Điểm nổi bật (1 câu)',type: 'text',     placeholder: 'VD: Thiên đường biển xanh cát trắng',  tab: 'Cơ bản' },
      { key: 'description', label: 'Mô tả chi tiết',      type: 'textarea', placeholder: 'Mô tả đầy đủ về địa điểm...',          tab: 'Cơ bản' },
      { key: 'tag',         label: 'Thẻ phân loại',       type: 'select',   options: ['Bãi Biển','Thiên Nhiên','Lịch Sử','Văn Hóa','Danh Lam'], tab: 'Cơ bản' },
      { key: 'image',       label: 'Hình đại diện',       type: 'image',                                                          tab: 'Cơ bản' },
      // Tab: Chi tiết
      { key: 'openHours',   label: 'Giờ mở cửa',          type: 'text',     placeholder: 'VD: 6:00 — 18:00 hàng ngày',           tab: 'Chi tiết' },
      { key: 'ticketPrice', label: 'Giá vé',               type: 'text',     placeholder: 'VD: 30.000đ/người hoặc Miễn phí',      tab: 'Chi tiết' },
      { key: 'bestTime',    label: 'Thời điểm lý tưởng',  type: 'text',     placeholder: 'VD: Tháng 4 — 8, sáng sớm hoặc chiều',  tab: 'Chi tiết' },
      { key: 'tips',        label: 'Mẹo du lịch',          type: 'array',    placeholder: 'Thêm 1 mẹo...',                         tab: 'Chi tiết', hint: 'Mỗi mẹo là 1 dòng ngắn' },
      { key: 'mapLink',     label: 'Link Google Maps',     type: 'url',      placeholder: 'https://maps.google.com/...',            tab: 'Chi tiết' },
      // Tab: Hình ảnh
      { key: 'gallery',     label: 'Thư viện ảnh',         type: 'gallery',                                                        tab: 'Hình ảnh', hint: 'Upload nhiều ảnh để hiển thị trong trang chi tiết' },
      // Tab: Đặt phòng
      { key: 'bookingUrl',  label: 'Booking.com Link',     type: 'url',      placeholder: 'https://booking.com/...',               tab: 'Đặt phòng' },
      { key: 'agodaUrl',    label: 'Agoda Link',           type: 'url',      placeholder: 'https://agoda.com/...',                 tab: 'Đặt phòng' },
      { key: 'klookUrl',    label: 'Klook Link',           type: 'url',      placeholder: 'https://klook.com/...',                 tab: 'Đặt phòng' },
    ],
  },

  cuisine: {
    title: 'Ẩm Thực',
    subtitle: 'Các món ăn đặc sản và ẩm thực truyền thống Hà Tĩnh',
    tabs: ['Cơ bản', 'Chi tiết', 'Hình ảnh'],
    fields: [
      { key: 'name',        label: 'Tên món ăn',           type: 'text',     placeholder: 'VD: Kẹo Cu Đơ',                       tab: 'Cơ bản' },
      { key: 'type',        label: 'Loại hình',             type: 'text',     placeholder: 'VD: Đặc sản số 1 Hà Tĩnh',            tab: 'Cơ bản' },
      { key: 'origin',      label: 'Xuất xứ',               type: 'text',     placeholder: 'VD: Phường Đại Nai, TP Hà Tĩnh',      tab: 'Cơ bản' },
      { key: 'season',      label: 'Mùa / Thời điểm có',   type: 'text',     placeholder: 'VD: Quanh năm',                        tab: 'Cơ bản' },
      { key: 'badge',       label: 'Huy hiệu / Nhãn',      type: 'text',     placeholder: 'VD: OCOP ★★★★',                      tab: 'Cơ bản' },
      { key: 'description', label: 'Mô tả',                 type: 'textarea', placeholder: 'Mô tả hương vị, cách thưởng thức...', tab: 'Cơ bản' },
      { key: 'image',       label: 'Hình đại diện',         type: 'image',                                                         tab: 'Cơ bản' },
      // Chi tiết
      { key: 'price',       label: 'Mức giá tham khảo',    type: 'text',     placeholder: 'VD: 50.000 — 150.000đ/kg',             tab: 'Chi tiết' },
      { key: 'pairsWith',   label: 'Thưởng thức cùng với', type: 'text',     placeholder: 'VD: Trà xanh Hà Tĩnh',                 tab: 'Chi tiết' },
      { key: 'whereToEat',  label: 'Nơi mua / thưởng thức',type: 'array',    placeholder: 'Thêm địa điểm...',                     tab: 'Chi tiết', hint: 'Tên quán, địa chỉ cụ thể' },
      { key: 'ingredients', label: 'Nguyên liệu chính',     type: 'array',    placeholder: 'Thêm nguyên liệu...',                  tab: 'Chi tiết' },
      // Hình ảnh
      { key: 'gallery',     label: 'Thư viện ảnh',          type: 'gallery',                                                       tab: 'Hình ảnh' },
    ],
  },

  products: {
    title: 'Đặc Sản',
    subtitle: 'Nông sản, sản phẩm OCOP, hàng lưu niệm đặc trưng',
    tabs: ['Cơ bản', 'Chi tiết', 'Hình ảnh', 'Mua hàng'],
    fields: [
      { key: 'name',          label: 'Tên sản phẩm',          type: 'text',     placeholder: 'VD: Bưởi Phúc Trạch',              tab: 'Cơ bản' },
      { key: 'category',      label: 'Danh mục',               type: 'text',     placeholder: 'VD: Nông sản đặc sản',             tab: 'Cơ bản' },
      { key: 'origin',        label: 'Vùng sản xuất',          type: 'text',     placeholder: 'VD: Huyện Hương Khê',              tab: 'Cơ bản' },
      { key: 'harvestSeason', label: 'Mùa thu hoạch',          type: 'text',     placeholder: 'VD: Tháng 8 — 9',                  tab: 'Cơ bản' },
      { key: 'unit',          label: 'Giá tham khảo',          type: 'text',     placeholder: 'VD: 20.000 — 35.000đ/quả',         tab: 'Cơ bản' },
      { key: 'description',   label: 'Mô tả',                  type: 'textarea', placeholder: 'Đặc điểm, chứng nhận, lý do nên mua...', tab: 'Cơ bản' },
      { key: 'image',         label: 'Hình đại diện',          type: 'image',                                                      tab: 'Cơ bản' },
      // Chi tiết
      { key: 'priceRange',    label: 'Khoảng giá bán lẻ',      type: 'text',     placeholder: 'VD: 150.000 — 250.000đ/kg',        tab: 'Chi tiết' },
      { key: 'story',         label: 'Câu chuyện sản phẩm',    type: 'textarea', placeholder: 'Lịch sử, đặc trưng vùng miền...',  tab: 'Chi tiết' },
      { key: 'certifications',label: 'Chứng nhận / Giải thưởng',type: 'array',  placeholder: 'VD: OCOP 4 sao, VietGAP...',       tab: 'Chi tiết', hint: 'Mỗi chứng nhận 1 dòng' },
      { key: 'whereToBuy',    label: 'Nơi mua',                 type: 'array',    placeholder: 'VD: Chợ Hà Tĩnh, siêu thị...',   tab: 'Chi tiết' },
      // Hình ảnh
      { key: 'gallery',       label: 'Thư viện ảnh',            type: 'gallery',                                                   tab: 'Hình ảnh' },
      // Mua hàng
      { key: 'shopeeUrl',     label: 'Link Shopee',             type: 'url',      placeholder: 'https://shopee.vn/...',            tab: 'Mua hàng' },
      { key: 'lazadaUrl',     label: 'Link Lazada',             type: 'url',      placeholder: 'https://lazada.vn/...',            tab: 'Mua hàng' },
      { key: 'orderUrl',      label: 'Link đặt hàng khác',      type: 'url',      placeholder: 'https://...',                      tab: 'Mua hàng' },
      { key: 'orderPhone',    label: 'SĐT đặt hàng',           type: 'text',     placeholder: '0xxx xxx xxx',                      tab: 'Mua hàng' },
    ],
  },

  shops: {
    title: 'Gian Hàng & Quán Ăn',
    subtitle: 'Quán ăn, cơ sở đặc sản, cửa hàng địa phương',
    tabs: ['Cơ bản', 'Chi tiết', 'Hình ảnh', 'Premium'],
    fields: [
      { key: 'name',          label: 'Tên quán / cửa hàng', type: 'text',     placeholder: 'VD: Nhà Hàng Hải Sản Thiên Cầm',  tab: 'Cơ bản' },
      { key: 'category',      label: 'Loại hình',            type: 'select',   options: ['Ẩm thực','Đặc sản','Nông sản','Lưu niệm','Đồ uống','Khác'], tab: 'Cơ bản' },
      { key: 'specialty',     label: 'Món / sản phẩm đặc trưng', type: 'text', placeholder: 'VD: Mực nướng, Tôm hùm nướng',   tab: 'Cơ bản' },
      { key: 'description',   label: 'Giới thiệu',           type: 'textarea', placeholder: 'Mô tả quán, điểm đặc biệt...',   tab: 'Cơ bản' },
      { key: 'address',       label: 'Địa chỉ',              type: 'text',     placeholder: 'Địa chỉ đầy đủ...',               tab: 'Cơ bản' },
      { key: 'phone',         label: 'Số điện thoại',        type: 'text',     placeholder: '0xxx xxx xxx',                    tab: 'Cơ bản' },
      { key: 'hours',         label: 'Giờ mở cửa',           type: 'text',     placeholder: 'VD: 10:00 — 22:00 hàng ngày',    tab: 'Cơ bản' },
      { key: 'priceRange',    label: 'Mức giá',              type: 'text',     placeholder: 'VD: 100.000 — 300.000đ/người',   tab: 'Cơ bản' },
      { key: 'rating',        label: 'Đánh giá (1–5)',        type: 'number',   placeholder: '4.8',                             tab: 'Cơ bản' },
      { key: 'image',         label: 'Hình đại diện',         type: 'image',                                                   tab: 'Cơ bản' },
      // Chi tiết
      { key: 'menu',          label: 'Menu / Danh mục sản phẩm', type: 'array', placeholder: 'VD: Bún bò Hà Tĩnh — 45.000đ', tab: 'Chi tiết', hint: 'Mỗi món/sản phẩm 1 dòng' },
      { key: 'mapLink',       label: 'Link Google Maps',      type: 'url',      placeholder: 'https://maps.google.com/...',     tab: 'Chi tiết' },
      { key: 'zaloPhone',     label: 'Số Zalo',               type: 'text',     placeholder: '0xxx xxx xxx',                    tab: 'Chi tiết' },
      { key: 'zaloUrl',       label: 'Link Zalo OA',          type: 'url',      placeholder: 'https://zalo.me/...',              tab: 'Chi tiết' },
      // Hình ảnh
      { key: 'gallery',       label: 'Thư viện ảnh',          type: 'gallery',                                                  tab: 'Hình ảnh' },
      // Premium
      { key: 'featured',      label: 'Gian hàng nổi bật ⭐',  type: 'toggle',   hint: 'Hiển thị badge vàng và lên đầu danh sách', tab: 'Premium' },
      { key: 'featuredUntil', label: 'Nổi bật đến ngày',      type: 'date',     tab: 'Premium', hint: 'Để trống = không giới hạn' },
      { key: 'promotionText', label: 'Nội dung khuyến mãi',   type: 'text',     placeholder: 'VD: Giảm 20% cuối tuần này!',   tab: 'Premium' },
    ],
  },

  transport: {
    title: 'Vận Chuyển',
    subtitle: 'Taxi, xe dịch vụ, lái xe hộ, xe ghép tại Hà Tĩnh',
    tabs: ['Cơ bản', 'Dịch vụ', 'Hình ảnh', 'Liên hệ'],
    fields: [
      // Cơ bản
      { key: 'name',         label: 'Tên tài xế / dịch vụ',   type: 'text',     placeholder: 'VD: Taxi Minh Hùng',                    tab: 'Cơ bản' },
      { key: 'type',         label: 'Loại hình',               type: 'select',   options: ['taxi','xe-dich-vu','lai-xe-ho','xe-ghep'], tab: 'Cơ bản' },
      { key: 'vehicle',      label: 'Loại xe',                 type: 'text',     placeholder: 'VD: Toyota Vios 4 chỗ',                 tab: 'Cơ bản' },
      { key: 'seats',        label: 'Số chỗ ngồi',             type: 'number',   placeholder: '4',                                     tab: 'Cơ bản' },
      { key: 'priceText',    label: 'Giá (hiển thị)',          type: 'text',     placeholder: 'VD: 12.000đ/km hoặc 800.000đ/ngày',    tab: 'Cơ bản' },
      { key: 'priceKm',      label: 'Giá /km (số)',            type: 'number',   placeholder: '12000 (hoặc 0 nếu theo chuyến)',        tab: 'Cơ bản' },
      { key: 'description',  label: 'Giới thiệu',              type: 'textarea', placeholder: 'Mô tả dịch vụ, kinh nghiệm...',        tab: 'Cơ bản' },
      { key: 'image',        label: 'Hình đại diện',           type: 'image',                                                          tab: 'Cơ bản' },
      // Dịch vụ
      { key: 'workingHours', label: 'Giờ hoạt động',           type: 'text',     placeholder: 'VD: 24/7 hoặc 6:00 – 22:00',          tab: 'Dịch vụ' },
      { key: 'licensePlate', label: 'Biển số xe',              type: 'text',     placeholder: 'VD: 38A-123.45',                       tab: 'Dịch vụ' },
      { key: 'areas',        label: 'Khu vực phục vụ',         type: 'array',    placeholder: 'VD: TP Hà Tĩnh',                      tab: 'Dịch vụ', hint: 'Mỗi khu vực 1 dòng' },
      { key: 'services',     label: 'Danh sách dịch vụ',       type: 'array',    placeholder: 'VD: Đưa đón sân bay Vinh',            tab: 'Dịch vụ', hint: 'Mỗi dịch vụ 1 dòng' },
      { key: 'routes',       label: 'Tuyến đường thường chạy', type: 'array',    placeholder: 'VD: TP Hà Tĩnh → Hà Nội',            tab: 'Dịch vụ', hint: 'Mỗi tuyến 1 dòng' },
      { key: 'featured',     label: 'Dịch vụ nổi bật ⭐',      type: 'toggle',   hint: 'Hiển thị đầu trang với badge vàng',          tab: 'Dịch vụ' },
      { key: 'verified',     label: 'Đã xác minh ✓',           type: 'toggle',   hint: 'Hiển thị badge xanh "Đã xác minh"',          tab: 'Dịch vụ' },
      { key: 'available',    label: 'Đang hoạt động',          type: 'toggle',                                                        tab: 'Dịch vụ' },
      // Hình ảnh
      { key: 'gallery',      label: 'Thư viện ảnh',            type: 'gallery',                                                       tab: 'Hình ảnh' },
      // Liên hệ
      { key: 'phone',        label: 'Số điện thoại',           type: 'text',     placeholder: '0912 345 678',                        tab: 'Liên hệ' },
      { key: 'zalo',         label: 'Số Zalo',                 type: 'text',     placeholder: '0912345678 (không khoảng trắng)',     tab: 'Liên hệ' },
      { key: 'facebook',     label: 'Link Facebook',           type: 'url',      placeholder: 'https://facebook.com/...',             tab: 'Liên hệ' },
    ],
  },

  realestate: {
    title: 'Bất Động Sản',
    subtitle: 'Quản lý tin đăng mua bán và cho thuê nhà đất tại Hà Tĩnh',
    tabs: ['Cơ bản', 'Chi tiết', 'Hình ảnh', 'Liên hệ'],
    fields: [
      // Cơ bản
      { key: 'title',       label: 'Tiêu đề tin đăng',       type: 'text',     placeholder: 'VD: Bán nhà 3 tầng mặt đường Nguyễn Du',        tab: 'Cơ bản' },
      { key: 'type',        label: 'Loại giao dịch',          type: 'select',   options: ['ban','cho-thue'],                                    tab: 'Cơ bản' },
      { key: 'category',    label: 'Loại bất động sản',       type: 'select',   options: ['Nhà ở','Đất nền','Căn hộ','Mặt bằng KD','Nhà trọ'], tab: 'Cơ bản' },
      { key: 'priceText',   label: 'Giá (hiển thị)',          type: 'text',     placeholder: 'VD: 3,8 tỷ hoặc 5 triệu/tháng',                 tab: 'Cơ bản' },
      { key: 'area',        label: 'Diện tích (m²)',           type: 'number',   placeholder: '90',                                             tab: 'Cơ bản' },
      { key: 'bedrooms',    label: 'Số phòng ngủ',            type: 'number',   placeholder: '3',                                              tab: 'Cơ bản' },
      { key: 'bathrooms',   label: 'Số nhà vệ sinh',          type: 'number',   placeholder: '2',                                              tab: 'Cơ bản' },
      { key: 'floors',      label: 'Số tầng',                 type: 'number',   placeholder: '3',                                              tab: 'Cơ bản' },
      { key: 'image',       label: 'Hình đại diện',           type: 'image',                                                                   tab: 'Cơ bản' },
      // Chi tiết
      { key: 'address',     label: 'Địa chỉ đầy đủ',         type: 'text',     placeholder: 'Số nhà, đường, phường/xã, huyện/TP',             tab: 'Chi tiết' },
      { key: 'district',    label: 'Khu vực / Huyện',         type: 'text',     placeholder: 'VD: TP Hà Tĩnh',                                tab: 'Chi tiết' },
      { key: 'description', label: 'Mô tả chi tiết',          type: 'textarea', placeholder: 'Mô tả đặc điểm, vị trí, pháp lý...',            tab: 'Chi tiết' },
      { key: 'features',    label: 'Đặc điểm nổi bật',        type: 'array',    placeholder: 'VD: Sổ đỏ chính chủ',                          tab: 'Chi tiết', hint: 'Mỗi đặc điểm 1 dòng' },
      { key: 'status',      label: 'Trạng thái',              type: 'select',   options: ['active','sold','rented'],                           tab: 'Chi tiết' },
      { key: 'featured',    label: 'Tin nổi bật ⭐',           type: 'toggle',   hint: 'Hiển thị đầu trang với badge vàng',                   tab: 'Chi tiết' },
      // Hình ảnh
      { key: 'gallery',     label: 'Thư viện ảnh thực tế',    type: 'gallery',                                                                 tab: 'Hình ảnh' },
      // Liên hệ
      { key: 'contactName', label: 'Tên người liên hệ',       type: 'text',     placeholder: 'VD: Anh Minh (Chính chủ)',                      tab: 'Liên hệ' },
      { key: 'phone',       label: 'Số điện thoại',           type: 'text',     placeholder: '0912 345 678',                                   tab: 'Liên hệ' },
      { key: 'zalo',        label: 'Số Zalo',                 type: 'text',     placeholder: '0912345678 (không có khoảng trắng)',             tab: 'Liên hệ' },
      { key: 'mapLink',     label: 'Link Google Maps',        type: 'url',      placeholder: 'https://maps.google.com/...',                    tab: 'Liên hệ' },
    ],
  },

}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function asArr(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[]
  return []
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  const config = SECTION_CONFIG[section]

  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null) // key of field being uploaded

  useEffect(() => { if (config) fetchItems() }, [section])

  const fetchItems = async () => {
    const res = await fetch(`/api/content/${section}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  const saveItems = async (newItems: Record<string, unknown>[]) => {
    setSaving(true)
    await fetch(`/api/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: newItems }),
    })
    setSaving(false)
  }

  const openAdd = () => {
    setEditItem({ id: `item-${Date.now()}`, visible: true })
    setActiveTab(0)
    setShowModal(true)
  }

  const openEdit = (item: Record<string, unknown>) => {
    setEditItem({ ...item })
    setActiveTab(0)
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null) }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mục này khỏi website?')) return
    const updated = items.filter((i) => i.id !== id)
    setItems(updated); await saveItems(updated)
  }

  const handleToggle = async (id: string) => {
    const updated = items.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i))
    setItems(updated); await saveItems(updated)
  }

  const handleSave = async () => {
    if (!editItem) return
    const isExisting = items.some((i) => i.id === editItem.id)
    const updated = isExisting
      ? items.map((i) => (i.id === editItem.id ? editItem : i))
      : [...items, editItem]
    setItems(updated); await saveItems(updated)
    closeModal()
  }

  // Upload single image to a text/image field
  const handleImageUpload = async (file: File, fieldKey: string) => {
    setUploading(fieldKey)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setEditItem((prev) => ({ ...prev!, [fieldKey]: url }))
    } finally { setUploading(null) }
  }

  // Upload image(s) to a gallery[] field
  const handleGalleryUpload = async (files: FileList, fieldKey: string) => {
    setUploading(fieldKey)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const { url } = await res.json()
        urls.push(url)
      }
      setEditItem((prev) => ({
        ...prev!,
        [fieldKey]: [...asArr(prev?.[fieldKey]), ...urls],
      }))
    } finally { setUploading(null) }
  }

  if (!config) return <div className="p-8 text-slate-500">Section không tồn tại.</div>

  const tabFields = (tab: string) => config.fields.filter((f) => f.tab === tab)

  // ─── RENDER SINGLE FIELD ────────────────────────────────────────────────────
  const renderField = (field: Field) => {
    if (!editItem) return null
    const val = editItem[field.key]

    switch (field.type) {

      // ── Toggle (boolean) ──
      case 'toggle':
        return (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <span className="text-sm font-semibold text-slate-700">{field.label}</span>
              {field.hint && <p className="text-xs text-slate-400 mt-0.5">{field.hint}</p>}
            </div>
            <button
              type="button"
              onClick={() => setEditItem({ ...editItem, [field.key]: !val })}
              className={`relative w-12 h-6 rounded-full transition-colors ${val ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        )

      // ── URL ──
      case 'url':
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
              <span className="pl-3 text-slate-400"><Link2 size={15} /></span>
              <input
                type="url"
                value={String(val || '')}
                onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="flex-1 px-2 py-3 text-sm outline-none bg-transparent"
              />
              {Boolean(val) && (
                <a href={String(val)} target="_blank" rel="noreferrer"
                  className="pr-3 text-blue-400 hover:text-blue-600 transition-colors">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )

      // ── Date ──
      case 'date':
        return (
          <input
            type="date"
            value={String(val || '')}
            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )

      // ── Array (string[]) ──
      case 'array': {
        const arr = asArr(val)
        return (
          <div className="space-y-2">
            {arr.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...arr]; next[idx] = e.target.value
                    setEditItem({ ...editItem, [field.key]: next })
                  }}
                  placeholder={field.placeholder}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setEditItem({ ...editItem, [field.key]: arr.filter((_, i) => i !== idx) })}
                  className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                ><X size={14} /></button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setEditItem({ ...editItem, [field.key]: [...arr, ''] })}
              className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 py-1"
            >
              <Plus size={14} /> Thêm mục
            </button>
          </div>
        )
      }

      // ── Gallery (string[]) ──
      case 'gallery': {
        const imgs = asArr(val)
        return (
          <div className="space-y-4">
            {imgs.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imgs.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditItem({ ...editItem, [field.key]: imgs.filter((_, i) => i !== idx) })}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    ><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
            <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-4 text-sm cursor-pointer transition-colors ${
              uploading === field.key
                ? 'border-green-300 text-green-600 bg-green-50'
                : 'border-gray-200 text-slate-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50'
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files?.length && handleGalleryUpload(e.target.files, field.key)}
                disabled={uploading === field.key}
              />
              <Upload size={16} />
              {uploading === field.key ? 'Đang tải lên...' : `Upload ảnh (${imgs.length} ảnh hiện tại)`}
            </label>
          </div>
        )
      }

      // ── Image (single) ──
      case 'image':
        return (
          <div className="space-y-3">
            {Boolean(val) && (
              <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={String(val)} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="url"
              value={String(val || '')}
              onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
              placeholder="Dán URL hình ảnh từ internet..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
            <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-3.5 text-sm cursor-pointer transition-colors ${
              uploading === field.key
                ? 'border-green-300 text-green-600 bg-green-50'
                : 'border-gray-200 text-slate-400 hover:border-green-400 hover:text-green-600'
            }`}>
              <input
                type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], field.key)}
                disabled={uploading === field.key}
              />
              <Upload size={16} />
              {uploading === field.key ? 'Đang tải lên...' : 'Upload từ máy tính'}
            </label>
          </div>
        )

      // ── Textarea ──
      case 'textarea':
        return (
          <textarea
            value={String(val || '')}
            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder:text-gray-400"
          />
        )

      // ── Select ──
      case 'select':
        return (
          <select
            value={String(val || '')}
            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Chọn...</option>
            {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        )

      // ── Number ──
      case 'number':
        return (
          <input
            type="number"
            value={String(val || '')}
            onChange={(e) => setEditItem({ ...editItem, [field.key]: parseFloat(e.target.value) })}
            placeholder={field.placeholder}
            step="0.1" min="1" max="5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        )

      // ── Text (default) ──
      default:
        return (
          <input
            type="text"
            value={String(val || '')}
            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        )
    }
  }

  // ─── PAGE RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{config.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{config.subtitle}</p>
          <p className="text-slate-400 text-xs mt-1">
            {items.length} mục · {items.filter(i => i.visible !== false).length} đang hiển thị
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={String(item.id)}
            className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all ${
              item.visible === false ? 'opacity-50 border-gray-100' : 'border-gray-100 hover:border-green-200 hover:shadow-md'
            }`}
          >
            <div className="relative h-44 bg-gray-100">
              {item.image
                ? <img src={String(item.image)} alt={String(item.name || '')} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Chưa có hình ảnh</div>
              }
              <div className="absolute top-3 left-3 flex gap-1.5">
                {item.visible !== false
                  ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Hiển thị</span>
                  : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Ẩn</span>
                }
                {Boolean(item.featured) && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Nổi bật</span>}
              </div>
            </div>

            <div className="p-4">
              <div className="font-bold text-slate-900 mb-1 line-clamp-1">{String(item.name || 'Chưa đặt tên')}</div>
              {Boolean(item.description) && (
                <div className="text-slate-500 text-xs mb-2 line-clamp-2">{String(item.description)}</div>
              )}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Boolean(item.rating) && (
                  <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <Star size={10} className="fill-amber-500" />{String(item.rating)}
                  </span>
                )}
                {asArr(item.gallery).length > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    📷 {asArr(item.gallery).length} ảnh
                  </span>
                )}
                {Boolean(item.bookingUrl || item.shopeeUrl || item.orderUrl) && (
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">🔗 Link</span>
                )}
                {asArr(item.tips).length > 0 && (
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                    💡 {asArr(item.tips).length} mẹo
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Pencil size={13} /> Chỉnh sửa
                </button>
                <button
                  onClick={() => handleToggle(String(item.id))}
                  title={item.visible !== false ? 'Ẩn khỏi website' : 'Hiện trên website'}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                  {item.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(String(item.id))}
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400">
            <Plus size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">Chưa có mục nào</p>
            <p className="text-sm">Nhấn &quot;Thêm mới&quot; để bắt đầu</p>
          </div>
        )}
      </div>

      {/* ── DEEP EDIT MODAL ──────────────────────────────────────────────────── */}
      {showModal && editItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">
                {items.some((i) => i.id === editItem.id)
                  ? `Sửa: ${String(editItem.name || '')}`
                  : 'Thêm mới'}
              </h2>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              ><X size={18} /></button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-gray-100 px-6 flex-shrink-0 overflow-x-auto">
              {config.tabs.map((tab, idx) => {
                const count = tabFields(tab).filter(f =>
                  f.type === 'array' ? asArr(editItem[f.key]).length > 0
                  : f.type === 'gallery' ? asArr(editItem[f.key]).length > 0
                  : !!editItem[f.key]
                ).length
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === idx
                        ? 'border-green-600 text-green-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                    {count > 0 && (
                      <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Fields for active tab */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {tabFields(config.tabs[activeTab]).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {field.label}
                  </label>
                  {field.hint && (
                    <p className="text-xs text-slate-400 mb-2">{field.hint}</p>
                  )}
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                {activeTab > 0 && (
                  <button onClick={() => setActiveTab(t => t - 1)}
                    className="px-4 py-2 text-slate-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                    ← Trước
                  </button>
                )}
                {activeTab < config.tabs.length - 1 && (
                  <button onClick={() => setActiveTab(t => t + 1)}
                    className="px-4 py-2 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors text-sm">
                    Tiếp →
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal}
                  className="px-5 py-2.5 text-slate-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
                >
                  <Save size={15} />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
