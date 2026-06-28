# CLAUDE.md — ha-tinh-website

Website du lịch và thương mại địa phương tỉnh Hà Tĩnh.

## Stack
- **Framework:** Next.js 16 App Router (breaking changes vs Next.js 14/15 — đọc `node_modules/next/dist/docs/` trước khi code)
- **Styling:** TailwindCSS
- **Animations:** framer-motion
- **Icons:** lucide-react
- **QR:** qrcode.react
- **Language:** TypeScript (strict — không dùng `any`)

## Dev server
```powershell
cd C:\Users\Admin\ha-tinh-website
npx next dev --port 3001
# URL: http://localhost:3001
```

## Architecture
```
app/
  admin/          → Admin panel (site config, gallery, analytics, reviews, transport)
  api/            → Route handlers
  bat-dong-san/   → Bất động sản
  cuisine/        → Ẩm thực
  dang-ky-gian-hang/ → Đăng ký gian hàng
  offline/        → Offline page
  products/       → Sản phẩm địa phương
  shops/          → Cửa hàng
  tim-kiem/       → Tìm kiếm
  tin-tuc/        → Tin tức
  tourism/        → Du lịch
  van-chuyen/     → Vận chuyển

lib/
  data.ts         → Static data
  server-data.ts  → Server-side data fetching
  types.ts        → TypeScript types
  jsonld.ts       → Structured data (SEO)
```

## Conventions
- Tất cả data static nằm trong `lib/data.ts` và `lib/server-data.ts`
- Route handler: `app/api/<resource>/route.ts`
- Dynamic route: `app/<section>/[slug]/page.tsx`
- Không dùng `use client` trừ khi cần thiết — ưu tiên Server Components
- Import icons: `import { IconName } from 'lucide-react'`
- Animation: dùng `framer-motion` với `motion.div`, không CSS animations

## Build & Deploy
```powershell
npm run build   # Production build
npm run lint    # ESLint check
```
Deploy target: Vercel
