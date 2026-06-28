'use client'

import { useEffect } from 'react'

export default function ContentProtection() {
  useEffect(() => {
    // ── 1. Console copyright notice ────────────────────────────────────────
    console.log(
      '%c© Hà Tĩnh Có Gì? 2025\n%cNội dung và hình ảnh thuộc bản quyền hatinhcogi.com\nMọi sao chép trái phép đều vi phạm pháp luật.',
      'color:#1B5E20;font-size:18px;font-weight:bold;',
      'color:#555;font-size:12px;'
    )

    // ── 2. Block right-click on images ────────────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
      }
    }

    // ── 3. Block drag on images ───────────────────────────────────────────
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
      }
    }

    // ── 4. Copyright notice on text copy ─────────────────────────────────
    const handleCopy = () => {
      const selection = window.getSelection()?.toString() ?? ''
      if (selection.length < 10) return
      const notice = `\n\n--- Nguồn: Hà Tĩnh Có Gì? (hatinhcogi.com) ---\nBản quyền nội dung © 2025 hatinhcogi.com — Vui lòng trích dẫn nguồn khi chia sẻ.`
      setTimeout(() => {
        navigator.clipboard?.writeText(selection + notice).catch(() => {})
      }, 0)
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('copy', handleCopy)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('copy', handleCopy)
    }
  }, [])

  return null
}
