export interface TourismSpot {
  id: string
  name: string
  location: string
  description: string
  highlight: string
  image: string
  tag: string
  tagColor: string
  visible?: boolean
  // Detail page
  gallery?: string[]
  openHours?: string
  ticketPrice?: string
  bestTime?: string
  tips?: string[]
  mapLink?: string
  bookingUrl?: string
  agodaUrl?: string
  klookUrl?: string
}

export interface CuisineItem {
  id: string
  name: string
  type: string
  description: string
  origin: string
  season: string
  image: string
  badge: string
  badgeColor: string
  visible?: boolean
  // Detail page
  gallery?: string[]
  price?: string
  whereToEat?: string[]
  ingredients?: string[]
  pairsWith?: string
}

export interface LocalProduct {
  id: string
  name: string
  category: string
  description: string
  origin: string
  certifications: string[]
  image: string
  harvestSeason: string
  unit: string
  visible?: boolean
  // Detail page
  gallery?: string[]
  priceRange?: string
  whereToBuy?: string[]
  story?: string
  shopeeUrl?: string
  lazadaUrl?: string
  orderUrl?: string
  orderPhone?: string
}

export interface Shop {
  id: string
  name: string
  category: string
  description: string
  address: string
  phone: string
  hours: string
  priceRange: string
  image: string
  specialty: string
  rating: number
  visible?: boolean
  // Detail page
  gallery?: string[]
  mapLink?: string
  zaloPhone?: string
  menu?: string[]
  featured?: boolean
  featuredUntil?: string
  promotionText?: string
  zaloUrl?: string
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  category: 'dia-phuong' | 'xa-hoi' | 'chinh-tri'
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  visible?: boolean
  tags?: string[]
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  visible?: boolean
}

export interface SiteConfig {
  heroImage: string
  heroTagline: string
  heroTitle: string
  heroSubtitle: string
  heroAccentText: string
  heroStat1: string
  heroStat2: string
  heroStat3: string
  heroStat4: string
  atmosphereQuote: string
  atmosphereSubtext: string
  atmosphereImage: string
  // Style & position
  heroTextAlign?: 'left' | 'center' | 'right'
  heroVerticalAlign?: 'top' | 'center' | 'bottom'
  heroTitleSize?: 'sm' | 'md' | 'lg' | 'xl'
  heroTitleColor?: 'white' | 'gold' | 'red'
  heroSubtitleColor?: 'white' | 'gold' | 'red'
  heroOverlayOpacity?: number
}

export interface Review {
  id: string
  itemId: string
  itemType: 'tourism' | 'cuisine' | 'product' | 'shop' | 'transport'
  authorName: string
  rating: number
  content: string
  createdAt: string
  approved?: boolean
}

export interface Subscriber {
  email: string
  subscribedAt: string
  active?: boolean
}
