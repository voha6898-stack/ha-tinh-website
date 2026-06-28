import type { MetadataRoute } from 'next'
import { getTourism, getCuisine, getProducts, getShops, getNews } from '@/lib/server-data'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hatinhcogi.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const tourism = getTourism()
  const cuisine = getCuisine()
  const products = getProducts()
  const shops = getShops()
  const news = getNews()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tim-kiem`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  const tourismRoutes: MetadataRoute.Sitemap = tourism.map((spot) => ({
    url: `${BASE_URL}/tourism/${spot.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const cuisineRoutes: MetadataRoute.Sitemap = cuisine.map((item) => ({
    url: `${BASE_URL}/cuisine/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const shopRoutes: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${BASE_URL}/shops/${shop.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const newsRoutes: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${BASE_URL}/tin-tuc/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...tourismRoutes,
    ...cuisineRoutes,
    ...productRoutes,
    ...shopRoutes,
    ...newsRoutes,
  ]
}
