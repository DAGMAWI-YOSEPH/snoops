'use client'

import { Category } from '@/lib/types'

const ICONS: Record<Category, { svg: React.ReactNode; label: string; color: string }> = {
  work: {
    label: 'Work',
    color: '#3b3b3b',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  health: {
    label: 'Health',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.335 3.64 1 6.5 1c1.924 0 3.557.946 4.5 2.427C11.943 1.946 13.576 1 15.5 1 18.36 1 21 3.335 21 7.191c0 4.105-5.37 8.863-11 14.402z" />
      </svg>
    ),
  },
  shopping: {
    label: 'Shopping',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  finance: {
    label: 'Finance',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  social: {
    label: 'Social',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  creative: {
    label: 'Creative',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  learning: {
    label: 'Learning',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  personal: {
    label: 'Personal',
    color: '#2d2d2d',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
}

interface Props {
  category: Category
  size?: number
  className?: string
}

export function CategoryIcon({ category, size = 16, className = '' }: Props) {
  const icon = ICONS[category]
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color: 'currentColor' }}
    >
      {icon.svg}
    </span>
  )
}

export function CategoryBadge({ category }: { category: Category }) {
  const icon = ICONS[category]
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium"
      style={{
        background: 'var(--bg3)',
        color: 'var(--fg2)',
        border: '1px solid var(--border)',
      }}
    >
      <span style={{ width: 10, height: 10, display: 'inline-flex', alignItems: 'center', color: 'var(--fg)' }}>
        {icon.svg}
      </span>
      {icon.label}
    </span>
  )
}

export const CATEGORIES = Object.entries(ICONS).map(([key, val]) => ({
  key: key as Category,
  label: val.label,
}))
