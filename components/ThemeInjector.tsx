import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

type Theme = { primary: string; accent: string; bg: string; bgAlt: string }

function getSiteTheme(): Theme {
  try {
    const path = join(process.cwd(), 'data', 'site.json')
    if (!existsSync(path)) return { primary: '#1B5E20', accent: '#D4A017', bg: '#ffffff', bgAlt: '#f8fafc' }
    const d = JSON.parse(readFileSync(path, 'utf8'))
    return {
      primary: d.themePrimary || '#1B5E20',
      accent:  d.themeAccent  || '#D4A017',
      bg:      d.themeBg      || '#ffffff',
      bgAlt:   d.themeBgAlt   || '#f8fafc',
    }
  } catch {
    return { primary: '#1B5E20', accent: '#D4A017', bg: '#ffffff', bgAlt: '#f8fafc' }
  }
}

function adjustHex(hex: string, amount: number): string {
  const clamp = (n: number) => Math.min(255, Math.max(0, n))
  const r = clamp(parseInt(hex.slice(1, 3), 16) + amount)
  const g = clamp(parseInt(hex.slice(3, 5), 16) + amount)
  const b = clamp(parseInt(hex.slice(5, 7), 16) + amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

export default function ThemeInjector() {
  const { primary, accent, bg, bgAlt } = getSiteTheme()

  const css = `
    :root {
      --ht-primary:       ${primary};
      --ht-primary-dark:  ${adjustHex(primary, -30)};
      --ht-primary-light: ${adjustHex(primary,  50)};
      --ht-primary-pale:  ${adjustHex(primary,  80)};
      --ht-accent:        ${accent};
      --ht-accent-dark:   ${adjustHex(accent,  -25)};
      --ht-accent-light:  ${adjustHex(accent,   40)};
      --ht-primary-rgb:   ${hexToRgb(primary)};
      --ht-accent-rgb:    ${hexToRgb(accent)};
      --ht-bg:            ${bg};
      --ht-bg-alt:        ${bgAlt};
    }
  `.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
