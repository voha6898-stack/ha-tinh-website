'use client'

import { useEffect, useState } from 'react'

type TickerData = {
  enabled: boolean
  speed: 'slow' | 'normal' | 'fast'
  bgColor: 'amber' | 'green' | 'red' | 'blue' | 'black'
  messages: { id: string; text: string; visible: boolean }[]
}

const SPEED_MAP = { slow: '60s', normal: '35s', fast: '18s' }

const BG_STYLES: Record<string, { bg: string; label: string; text: string; badge: string; glow: string; border: string }> = {
  amber: {
    bg: 'bg-[#1a1000]',
    text: 'text-amber-300',
    label: 'bg-amber-500 text-black',
    badge: 'bg-amber-900/60 border-amber-500/40',
    glow: 'drop-shadow(0 0 8px rgba(245,158,11,0.9)) drop-shadow(0 0 18px rgba(245,158,11,0.5))',
    border: 'border-amber-600/50',
  },
  green: {
    bg: 'bg-[#001a00]',
    text: 'text-green-300',
    label: 'bg-green-500 text-white',
    badge: 'bg-green-900/60 border-green-500/40',
    glow: 'drop-shadow(0 0 8px rgba(74,222,128,0.9)) drop-shadow(0 0 18px rgba(74,222,128,0.5))',
    border: 'border-green-600/50',
  },
  red: {
    bg: 'bg-[#1a0000]',
    text: 'text-red-300',
    label: 'bg-red-500 text-white',
    badge: 'bg-red-900/60 border-red-500/40',
    glow: 'drop-shadow(0 0 8px rgba(252,165,165,0.9)) drop-shadow(0 0 18px rgba(252,165,165,0.5))',
    border: 'border-red-600/50',
  },
  blue: {
    bg: 'bg-[#00061a]',
    text: 'text-blue-300',
    label: 'bg-blue-500 text-white',
    badge: 'bg-blue-900/60 border-blue-500/40',
    glow: 'drop-shadow(0 0 8px rgba(147,197,253,0.9)) drop-shadow(0 0 18px rgba(147,197,253,0.5))',
    border: 'border-blue-600/50',
  },
  black: {
    bg: 'bg-[#0a0a0a]',
    text: 'text-white',
    label: 'bg-white text-black',
    badge: 'bg-white/10 border-white/20',
    glow: 'drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 18px rgba(255,255,255,0.4))',
    border: 'border-white/20',
  },
}

export default function LedTicker() {
  const [ticker, setTicker] = useState<TickerData | null>(null)

  useEffect(() => {
    fetch('/api/content/ticker')
      .then(r => r.json())
      .then(d => setTicker(d as TickerData))
      .catch(() => null)
  }, [])

  if (!ticker || !ticker.enabled) return null

  const visibleMessages = ticker.messages.filter(m => m.visible)
  if (visibleMessages.length === 0) return null

  const fullText = visibleMessages.map(m => m.text).join('   ·   ')
  const duration = SPEED_MAP[ticker.speed] ?? '35s'
  const style = BG_STYLES[ticker.bgColor] ?? BG_STYLES.amber

  return (
    <>
      <style>{`
        @keyframes led-scroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .led-scroll {
          animation: led-scroll ${duration} linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
        .led-scroll:hover {
          animation-play-state: paused;
        }
        /* LED dot-matrix pixel font effect */
        .led-text {
          font-family: 'Courier New', 'Lucida Console', monospace;
          letter-spacing: 0.08em;
          font-weight: 700;
        }
        /* LED scanline overlay */
        .led-scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.12) 3px,
            rgba(0,0,0,0.12) 4px
          );
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className={`w-full ${style.bg} border-t border-b ${style.border} relative led-scanlines overflow-hidden`}
        style={{ height: '42px' }}>

        {/* LEFT LABEL */}
        <div className={`absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 text-xs font-black uppercase tracking-widest ${style.label} shadow-lg`}
          style={{ minWidth: '80px', letterSpacing: '0.15em' }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
            LIVE
          </span>
        </div>

        {/* SCROLL TRACK */}
        <div className="overflow-hidden h-full ml-[80px] relative">
          <div className="led-scroll flex items-center h-full">
            <span
              className={`led-text text-sm ${style.text}`}
              style={{ filter: style.glow }}
            >
              {fullText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fullText}
            </span>
          </div>
        </div>

        {/* RIGHT GRADIENT FADE */}
        <div className={`absolute right-0 top-0 bottom-0 w-12 z-10`}
          style={{ background: `linear-gradient(to left, ${ticker.bgColor === 'amber' ? '#1a1000' : ticker.bgColor === 'green' ? '#001a00' : ticker.bgColor === 'red' ? '#1a0000' : ticker.bgColor === 'blue' ? '#00061a' : '#0a0a0a'}, transparent)` }} />
      </div>
    </>
  )
}
