'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

type Props = {
  className?: string
  scrolled?: boolean
}

export default function SearchBox({ className = '', scrolled = false }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when expanded on mobile
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [expanded])

  // Close on outside click
  useEffect(() => {
    if (!expanded) return
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.closest('form')?.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [expanded])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (q.length < 2) return
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`)
    setValue('')
    setExpanded(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center transition-all duration-300 ${className}`}
    >
      {/* Mobile: icon-only, expands on click */}
      <div className="md:hidden flex items-center">
        {!expanded ? (
          <button
            type="button"
            aria-label="Mở tìm kiếm"
            onClick={() => setExpanded(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Search size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 w-48">
            <Search size={16} className="flex-shrink-0 opacity-70" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Tìm kiếm…"
              className="bg-transparent flex-1 text-sm outline-none placeholder-white/60 min-w-0"
            />
            <button
              type="button"
              onClick={() => { setValue(''); setExpanded(false) }}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Đóng"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className={`hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-200 cursor-text ${
        scrolled
          ? 'border border-slate-200 bg-slate-50 hover:bg-slate-100'
          : 'border border-white/25 bg-white/10 hover:bg-white/20 focus-within:bg-white/20 focus-within:border-white/50'
      }`}>
        <Search size={16} className={`flex-shrink-0 opacity-70 ${scrolled ? 'text-slate-500' : 'text-white'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tìm kiếm…"
          className={`bg-transparent text-sm outline-none w-32 focus:w-44 transition-all duration-300 min-w-0 ${
            scrolled ? 'text-slate-700 placeholder-slate-400' : 'text-white placeholder-white/60'
          }`}
        />
      </div>
    </form>
  )
}
