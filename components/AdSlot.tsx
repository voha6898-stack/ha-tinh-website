import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import Image from 'next/image'

type SlotType = 'horizontal' | 'rectangle' | 'prefooter'

type AdSlotData = {
  id: string
  name: string
  type: SlotType
  size: string
  image: string
  linkUrl: string
  linkTarget: string
  enabled: boolean
  altText: string
}

function readSlot(slotId: string): AdSlotData | null {
  try {
    const filePath = join(process.cwd(), 'data', 'ads.json')
    if (!existsSync(filePath)) return null
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    return (data.slots as AdSlotData[]).find(s => s.id === slotId) ?? null
  } catch { return null }
}

interface Props {
  slotId: string
  className?: string
}

export default function AdSlot({ slotId, className = '' }: Props) {
  const slot = readSlot(slotId)
  if (!slot || !slot.enabled) return null

  const isHorizontal = slot.type === 'horizontal'
  const isRectangle  = slot.type === 'rectangle'
  const isPrefooter  = slot.type === 'prefooter'

  const hasImage = Boolean(slot.image)

  // ── Prefooter ────────────────────────────────────────────────────────────
  if (isPrefooter) {
    const inner = (
      <div className={`relative w-full h-[140px] md:h-[160px] overflow-hidden ${className}`}>
        {hasImage ? (
          <Image src={slot.image} alt={slot.altText || 'Quảng cáo'} fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 flex flex-col items-center justify-center gap-2 text-white/40">
            <div className="text-sm font-black uppercase tracking-[0.2em]">Vị trí Quảng cáo</div>
            <div className="text-xs">{slot.size} · Liên hệ đặt quảng cáo tại đây</div>
          </div>
        )}
        {/* QC badge */}
        <span className="absolute top-2 right-2 bg-black/40 text-white/70 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
          QC
        </span>
      </div>
    )
    if (slot.linkUrl) return (
      <a href={slot.linkUrl} target={slot.linkTarget} rel="noopener noreferrer sponsored" className="block">
        {inner}
      </a>
    )
    return inner
  }

  // ── Horizontal banner ─────────────────────────────────────────────────────
  if (isHorizontal) {
    const inner = (
      <div className={`relative w-full h-[72px] md:h-[90px] overflow-hidden rounded-xl ${className}`}>
        {hasImage ? (
          <Image src={slot.image} alt={slot.altText || 'Quảng cáo'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 970px" />
        ) : (
          <div className="absolute inset-0 bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 rounded-xl">
            <div className="text-xs font-bold uppercase tracking-widest">Vị trí Quảng cáo</div>
            <div className="text-xs">{slot.size}</div>
          </div>
        )}
        <span className="absolute top-1.5 right-2 bg-black/25 text-white/80 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
          QC
        </span>
      </div>
    )
    if (slot.linkUrl) return (
      <a href={slot.linkUrl} target={slot.linkTarget} rel="noopener noreferrer sponsored" className="block">
        {inner}
      </a>
    )
    return inner
  }

  // ── Rectangle (sidebar) ────────────────────────────────────────────────────
  if (isRectangle) {
    const inner = (
      <div className={`relative w-full overflow-hidden rounded-xl ${className}`} style={{ paddingBottom: '83.33%' /* 250/300 */ }}>
        {hasImage ? (
          <Image src={slot.image} alt={slot.altText || 'Quảng cáo'} fill className="object-cover" sizes="300px" />
        ) : (
          <div className="absolute inset-0 bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 rounded-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <div className="text-xs font-bold uppercase tracking-widest text-center px-4">Vị trí Quảng cáo</div>
            <div className="text-[11px] text-center px-4">{slot.size}</div>
          </div>
        )}
        <span className="absolute top-1.5 right-1.5 bg-black/25 text-white/80 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
          QC
        </span>
      </div>
    )
    if (slot.linkUrl) return (
      <a href={slot.linkUrl} target={slot.linkTarget} rel="noopener noreferrer sponsored" className="block">
        {inner}
      </a>
    )
    return inner
  }

  return null
}
