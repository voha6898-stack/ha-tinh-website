import { readFileSync } from 'fs'
import { join } from 'path'
import type { TourismSpot, CuisineItem, LocalProduct, Shop, SiteConfig, GalleryImage, NewsArticle } from './types'

function readJSON<T>(filename: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'data', filename), 'utf8'))
  } catch {
    return fallback
  }
}

export function getTourism(): TourismSpot[] {
  const data = readJSON<{ items: TourismSpot[] }>('tourism.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getTourismById(id: string): TourismSpot | null {
  const data = readJSON<{ items: TourismSpot[] }>('tourism.json', { items: [] })
  return (data.items || []).find(item => item.id === id) ?? null
}

export function getCuisine(): CuisineItem[] {
  const data = readJSON<{ items: CuisineItem[] }>('cuisine.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getCuisineById(id: string): CuisineItem | null {
  const data = readJSON<{ items: CuisineItem[] }>('cuisine.json', { items: [] })
  return (data.items || []).find(item => item.id === id) ?? null
}

export function getProducts(): LocalProduct[] {
  const data = readJSON<{ items: LocalProduct[] }>('products.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getProductById(id: string): LocalProduct | null {
  const data = readJSON<{ items: LocalProduct[] }>('products.json', { items: [] })
  return (data.items || []).find(item => item.id === id) ?? null
}

export function getShops(): Shop[] {
  const data = readJSON<{ items: Shop[] }>('shops.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getShopById(id: string): Shop | null {
  const data = readJSON<{ items: Shop[] }>('shops.json', { items: [] })
  return (data.items || []).find(item => item.id === id) ?? null
}

export function getNews(): NewsArticle[] {
  const data = readJSON<{ items: NewsArticle[] }>('news.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getNewsById(id: string): NewsArticle | null {
  const data = readJSON<{ items: NewsArticle[] }>('news.json', { items: [] })
  return (data.items || []).find(item => item.id === id) ?? null
}

export function getNewsBySlug(slug: string): NewsArticle | null {
  const data = readJSON<{ items: NewsArticle[] }>('news.json', { items: [] })
  return (data.items || []).find(item => item.slug === slug) ?? null
}

export function getGallery(): GalleryImage[] {
  const data = readJSON<{ items: GalleryImage[] }>('gallery.json', { items: [] })
  return (data.items || []).filter(item => item.visible !== false)
}

export function getSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>('site.json', {
    heroImage: 'https://picsum.photos/seed/vietnam-coast/1920/1080',
    heroTitle: 'HÀ TĨNH',
    heroSubtitle: 'CÓ GÌ?',
    heroAccentText: 'KHÁM PHÁ · BẮC TRUNG BỘ · VIỆT NAM',
    heroStat1: '🏖️ 137km bờ biển',
    heroStat2: '⛰️ Núi Hồng 99 ngọn',
    heroStat3: '🏛️ 73+ di tích quốc gia',
    heroStat4: '🍜 Ẩm thực OCOP đặc sắc',
    heroTagline: 'Vùng đất của di sản ngàn năm, biển xanh hoang sơ và ẩm thực đặc sắc',
    atmosphereQuote: 'Núi Hồng in bóng sóng Lam cuộn — đất Hà Tĩnh ngàn năm hào kiệt',
    atmosphereSubtext: 'Hà Tĩnh — nơi hồn thiêng sông núi gặp gỡ con người kiên cường, tài hoa',
    atmosphereImage: 'https://picsum.photos/seed/hongLinh-mountain/1920/800',
  })
}
