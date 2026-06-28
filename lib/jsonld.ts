import type { TourismSpot, NewsArticle, Shop } from '@/lib/types'

export function tourismSpotSchema(spot: TourismSpot): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: spot.name,
    description: spot.description,
    image: spot.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: spot.location,
      addressRegion: 'Hà Tĩnh',
      addressCountry: 'VN',
    },
    ...(spot.mapLink && { hasMap: spot.mapLink }),
    ...(spot.openHours && { openingHours: spot.openHours }),
    touristType: spot.tag,
  }
}

export function newsArticleSchema(article: NewsArticle): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    articleSection: article.category,
    ...(article.tags && { keywords: article.tags.join(', ') }),
    publisher: {
      '@type': 'Organization',
      name: 'Hà Tĩnh Có Gì',
      url: 'https://hatinhcogi.com',
    },
  }
}

export function localBusinessSchema(shop: Shop): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shop.name,
    description: shop.description,
    image: shop.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.address,
      addressRegion: 'Hà Tĩnh',
      addressCountry: 'VN',
    },
    telephone: shop.phone,
    openingHours: shop.hours,
    priceRange: shop.priceRange,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: shop.rating,
      bestRating: 5,
    },
    ...(shop.mapLink && { hasMap: shop.mapLink }),
  }
}
