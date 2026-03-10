import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtSeconds(s: number): string {
  if (s <= 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function fmtPrice(n: number | null): string {
  if (n == null) return '—'
  return `$${n.toFixed(2)}`
}

export function fmtWeight(g: number): string {
  if (g >= 1000) return `${(g / 1000).toFixed(2)}kg`
  return `${Math.round(g)}g`
}

export function fmtTemp(t: number): string {
  return `${Math.round(t)}°C`
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
