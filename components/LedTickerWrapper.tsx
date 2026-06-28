'use client'

import { usePathname } from 'next/navigation'
import LedTicker from './LedTicker'

export default function LedTickerWrapper() {
  const pathname = usePathname()
  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null
  return (
    <div className="fixed w-full z-40 top-16 md:top-20">
      <LedTicker />
    </div>
  )
}
