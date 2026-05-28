'use client'

import { ActiveView } from '@/lib/types'

interface Props {
  active: ActiveView
  onChange: (v: ActiveView) => void
  onAdd: () => void
}

export default function BottomNav({ active, onChange, onAdd }: Props) {
  return (
    <div className="relative flex items-center justify-around px-6 py-3 bg-white border-t border-gray-100 safe-area-bottom">
      {/* Day view tab */}
      <button
        onClick={() => onChange('day')}
        className={`flex flex-col items-center gap-1 px-5 py-1 transition-colors ${
          active === 'day' ? 'text-black' : 'text-gray-300'
        }`}
        aria-label="Day view"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
          {active === 'day' && <rect x="9" y="13" width="6" height="5" rx="1" fill="currentColor" stroke="none" />}
        </svg>
        <span className="text-[10px] font-medium tracking-wide">Day</span>
      </button>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors -mt-5"
        aria-label="Add task"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <line x1="11" y1="4" x2="11" y2="18" />
          <line x1="4" y1="11" x2="18" y2="11" />
        </svg>
      </button>

      {/* List view tab */}
      <button
        onClick={() => onChange('list')}
        className={`flex flex-col items-center gap-1 px-5 py-1 transition-colors ${
          active === 'list' ? 'text-black' : 'text-gray-300'
        }`}
        aria-label="List view"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1.5" fill={active === 'list' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4" cy="12" r="1.5" fill={active === 'list' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4" cy="18" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="text-[10px] font-medium tracking-wide">All</span>
      </button>
    </div>
  )
}
