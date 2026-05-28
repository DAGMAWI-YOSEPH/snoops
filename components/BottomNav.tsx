'use client'

import { ActiveTab, ZoomLevel } from '@/lib/types'

interface Props {
  activeTab: ActiveTab
  zoomLevel: ZoomLevel
  onTabChange: (t: ActiveTab) => void
  onAdd: () => void
}

export default function BottomNav({ activeTab, zoomLevel, onTabChange, onAdd }: Props) {
  const isCalendar = activeTab === 'calendar'
  const isProgress = activeTab === 'progress'

  return (
    <div
      className="glass-strong flex items-center justify-around px-6 py-3 safe-pb border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Calendar tab */}
      <button
        onClick={() => onTabChange('calendar')}
        className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all"
        aria-label="Calendar view"
        style={{ color: isCalendar ? 'var(--fg)' : 'var(--fg3)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
          {zoomLevel === 0 && <rect x="5" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />}
          {zoomLevel === 0 && <rect x="9" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />}
          {zoomLevel === 0 && <rect x="13" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />}
          {zoomLevel === 1 && <rect x="5" y="11" width="14" height="2" rx="1" fill="currentColor" stroke="none" />}
          {zoomLevel === 1 && <rect x="5" y="15" width="10" height="2" rx="1" fill="currentColor" stroke="none" />}
          {zoomLevel === 2 && <rect x="9" y="11" width="6" height="7" rx="1" fill="currentColor" stroke="none" />}
        </svg>
        <span className="text-[10px] font-medium tracking-wide">
          {zoomLevel === 0 ? 'Year' : zoomLevel === 1 ? 'Month' : 'Day'}
        </span>
      </button>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 -mt-5"
        style={{ background: 'var(--fg)' }}
        aria-label="Add task"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round">
          <line x1="11" y1="4" x2="11" y2="18" />
          <line x1="4" y1="11" x2="18" y2="11" />
        </svg>
      </button>

      {/* Progress tab */}
      <button
        onClick={() => onTabChange('progress')}
        className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all"
        aria-label="Progress"
        style={{ color: isProgress ? 'var(--fg)' : 'var(--fg3)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          {isProgress && <path d="M3 20h18" strokeWidth="2" />}
        </svg>
        <span className="text-[10px] font-medium tracking-wide">Progress</span>
      </button>
    </div>
  )
}
