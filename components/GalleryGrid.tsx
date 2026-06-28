"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface GalleryGridProps {
  images: string[]
  alt?: string
}

export default function GalleryGrid({ images, alt = "" }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = () => setLightboxIndex(i => (i === null ? 0 : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIndex(i => (i === null ? 0 : (i + 1) % images.length))

  return (
    <>
      <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-video focus:outline-none focus:ring-2 focus:ring-vn-gold-500"
          >
            <Image
              src={img}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                onClick={e => { e.stopPropagation(); prev() }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                onClick={e => { e.stopPropagation(); next() }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-5xl max-h-[85vh] mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
