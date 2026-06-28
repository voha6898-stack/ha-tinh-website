import type { Metadata, Viewport } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Analytics from "@/components/Analytics"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"
import ZaloFloat from "@/components/ZaloFloat"
import AdSense from "@/components/AdSense"
import LedTickerWrapper from "@/components/LedTickerWrapper"
import ThemeInjector from "@/components/ThemeInjector"
import ContentProtection from "@/components/ContentProtection"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#1B5E20",
}

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Hà Tĩnh Có Gì?" },
  title: "Hà Tĩnh Có Gì? — Khám phá vùng đất di sản",
  description:
    "Khám phá Hà Tĩnh — vùng đất của di sản ngàn năm, bờ biển 137km hoang sơ, ẩm thực đặc sắc và đặc sản nông nghiệp nổi tiếng cả nước.",
  keywords: [
    "Hà Tĩnh",
    "du lịch Hà Tĩnh",
    "ẩm thực Hà Tĩnh",
    "kẹo cu đơ",
    "bưởi Phúc Trạch",
    "Ngã Ba Đồng Lộc",
    "Nguyễn Du",
    "bãi biển Thiên Cầm",
  ],
  openGraph: {
    title: "Hà Tĩnh Có Gì? — Khám phá vùng đất di sản",
    description: "Vùng đất của di sản ngàn năm, biển xanh hoang sơ và ẩm thực đặc sắc",
    type: "website",
    locale: "vi_VN",
  },
  other: {
    copyright: '© 2025 Hà Tĩnh Có Gì? — hatinhcogi.com. All rights reserved.',
    'dc.rights': '© 2025 hatinhcogi.com',
    'dc.language': 'vi-VN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <ThemeInjector />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="antialiased">
        <ContentProtection />
        <AdSense />
        <ServiceWorkerRegister />
        <GoogleAnalytics />
        <Analytics />
        <LedTickerWrapper />
        {children}
        <ZaloFloat />
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`}
        </Script>
      </body>
    </html>
  )
}
