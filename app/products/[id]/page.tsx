export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, BadgeCheck, ShoppingBag, BookOpen, ChevronRight } from 'lucide-react'
import { getProductById, getProducts } from '@/lib/server-data'
import GalleryGrid from '@/components/GalleryGrid'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  const allProducts = getProducts()
  const related = allProducts.filter(p => p.id !== id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/#dac-san" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-forest-800 transition-colors">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm text-gray-400">Đặc sản</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm font-semibold text-gray-800 truncate">{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[340px]">
        <Image src={product.image} alt={product.name} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full border bg-forest-100 text-forest-700 border-forest-200 mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">{product.name}</h1>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map(cert => (
                <span key={cert} className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
                  <BadgeCheck size={11} />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-forest-700 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Giới thiệu</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Gallery */}
            {product.gallery && product.gallery.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-vn-gold-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                </div>
                <GalleryGrid images={product.gallery} alt={product.name} />
              </div>
            )}

            {/* Story */}
            {product.story && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-amber-400 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Câu chuyện & Lịch sử</h2>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <BookOpen size={20} className="text-amber-600 mb-3" />
                  <p className="text-gray-700 leading-relaxed italic">{product.story}</p>
                </div>
              </div>
            )}

            {/* Where to buy */}
            {product.whereToBuy && product.whereToBuy.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-forest-700 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Mua ở đâu?</h2>
                </div>
                <div className="space-y-2">
                  {product.whereToBuy.map((place, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-forest-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{place}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Thông tin sản phẩm</h3>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-forest-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Vùng sản xuất</div>
                  <div className="text-sm text-gray-700">{product.origin}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-vn-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Mùa thu hoạch</div>
                  <div className="text-sm text-gray-700">{product.harvestSeason}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShoppingBag size={16} className="text-vn-red-800 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Mức giá tham khảo</div>
                  <div className="text-sm text-gray-700">{product.priceRange || product.unit}</div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <h4 className="font-bold text-green-800 text-sm mb-3">Chứng nhận chất lượng</h4>
              <div className="space-y-2">
                {product.certifications.map(cert => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-green-700">
                    <BadgeCheck size={14} className="flex-shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/#gian-hang"
              className="flex items-center justify-center gap-2 w-full bg-forest-800 hover:bg-forest-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
            >
              <ShoppingBag size={16} />
              Tìm cửa hàng mua ngay
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Đặc sản khác của Hà Tĩnh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold bg-forest-100 text-forest-700 border border-forest-200 px-2 py-1 rounded-full">{p.category}</span>
                    <h3 className="font-bold text-gray-900 mt-2 group-hover:text-forest-800 transition-colors">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={11} />{p.origin}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
