"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  try {
    let id = localStorage.getItem('_ht_sid')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('_ht_sid', id)
    }
    return id
  } catch {
    return ''
  }
}

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const sessionId = getSessionId()
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, sessionId }),
      }).catch(() => {})
    } catch {}
  }, [pathname])

  return null
}
