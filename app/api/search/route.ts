import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

type SearchResult = {
  id: string
  type: 'tourism' | 'cuisine' | 'product' | 'shop' | 'news'
  title: string
  subtitle: string
  href: string
  image: string
}

function readData<T>(file: string): T[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', file), 'utf8')
    return JSON.parse(raw).items ?? []
  } catch {
    return []
  }
}

function matches(q: string, ...fields: (string | undefined)[]): boolean {
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const lower = q.toLowerCase()
  const results: SearchResult[] = []

  // Tourism
  type TourismItem = { id: string; name: string; description: string; location: string; image: string; visible?: boolean }
  const tourism = readData<TourismItem>('tourism.json')
  for (const item of tourism) {
    if (matches(lower, item.name, item.description, item.location)) {
      results.push({
        id: item.id,
        type: 'tourism',
        title: item.name,
        subtitle: item.location ?? '',
        href: `/tourism/${item.id}`,
        image: item.image ?? '',
      })
    }
  }

  // Cuisine
  type CuisineItem = { id: string; name: string; description: string; origin: string; image: string; visible?: boolean }
  const cuisine = readData<CuisineItem>('cuisine.json')
  for (const item of cuisine) {
    if (matches(lower, item.name, item.description, item.origin)) {
      results.push({
        id: item.id,
        type: 'cuisine',
        title: item.name,
        subtitle: item.origin ?? '',
        href: `/cuisine/${item.id}`,
        image: item.image ?? '',
      })
    }
  }

  // Products
  type ProductItem = { id: string; name: string; description: string; origin: string; image: string; visible?: boolean }
  const products = readData<ProductItem>('products.json')
  for (const item of products) {
    if (matches(lower, item.name, item.description, item.origin)) {
      results.push({
        id: item.id,
        type: 'product',
        title: item.name,
        subtitle: item.origin ?? '',
        href: `/products/${item.id}`,
        image: item.image ?? '',
      })
    }
  }

  // Shops
  type ShopItem = { id: string; name: string; description: string; address: string; specialty: string; image: string; visible?: boolean }
  const shops = readData<ShopItem>('shops.json')
  for (const item of shops) {
    if (matches(lower, item.name, item.description, item.address, item.specialty)) {
      results.push({
        id: item.id,
        type: 'shop',
        title: item.name,
        subtitle: item.address ?? '',
        href: `/shops/${item.id}`,
        image: item.image ?? '',
      })
    }
  }

  // News (visible:true only)
  type NewsItem = { id: string; title: string; excerpt: string; slug: string; image: string; visible?: boolean }
  const news = readData<NewsItem>('news.json')
  for (const item of news) {
    if (item.visible !== false && matches(lower, item.title, item.excerpt)) {
      results.push({
        id: item.id,
        type: 'news',
        title: item.title,
        subtitle: item.excerpt ? item.excerpt.slice(0, 80) + (item.excerpt.length > 80 ? '…' : '') : '',
        href: `/tin-tuc/${item.slug}`,
        image: item.image ?? '',
      })
    }
  }

  return NextResponse.json({ results: results.slice(0, 20) })
}
