export const dynamic = 'force-dynamic'

import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import StatsBar from "@/components/StatsBar"
import TourismSection from "@/components/TourismSection"
import AtmosphereSection from "@/components/AtmosphereSection"
import CuisineSection from "@/components/CuisineSection"
import ProductsSection from "@/components/ProductsSection"
import ShopsSection from "@/components/ShopsSection"
import SeasonCalendar from "@/components/SeasonCalendar"
import GallerySection from "@/components/GallerySection"
import Footer from "@/components/Footer"
import SearchBar from "@/components/SearchBar"
import { getTourism, getCuisine, getProducts, getShops, getSiteConfig, getGallery } from "@/lib/server-data"
import AdSlot from "@/components/AdSlot"

export default async function Home() {
  const [tourism, cuisine, products, shops, siteConfig, gallery] = await Promise.all([
    Promise.resolve(getTourism()),
    Promise.resolve(getCuisine()),
    Promise.resolve(getProducts()),
    Promise.resolve(getShops()),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getGallery()),
  ])

  return (
    <main>
      <Navigation />
      <Hero config={siteConfig} />

      {/* Search bar pinned below hero */}
      <div className="bg-gradient-to-b from-slate-900 to-white pb-10 pt-6 px-4">
        <SearchBar data={{ tourism, cuisine, products, shops }} />
      </div>

      <StatsBar />

      {/* Ad: Banner trên — sau StatsBar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot slotId="homepage-top-banner" />
      </div>

      <TourismSection items={tourism} />
      <AtmosphereSection config={siteConfig} />
      <CuisineSection items={cuisine} />

      {/* Ad: Banner giữa — giữa Ẩm Thực & Đặc Sản */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot slotId="homepage-mid-banner" />
      </div>

      <ProductsSection items={products} />
      <ShopsSection items={shops} />
      <SeasonCalendar />
      <GallerySection items={gallery} />

      {/* Ad: Banner trước Footer */}
      <AdSlot slotId="global-prefooter" />

      <Footer />
    </main>
  )
}
