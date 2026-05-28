'use client'

import { useState, useRef } from 'react'
import { Task } from '@/lib/types'
import { formatDate } from '@/lib/dateUtils'

interface Props {
  task: Task
  showDate?: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onMoveNextWeek: (id: string) => void
  onMoveSomeday: (id: string) => void
  onMoveToday: (id: string) => void
}

export default function TaskItem({
  task,
  showDate = false,
  onToggle,
  onDelete,
  onMoveNextWeek,
  onMoveSomeday,
  onMoveToday,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((v) => !v)
  }

  return (
    <div className="relative group flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition-colors"
        style={{ background: task.completed ? 'black' : 'transparent' }}
        aria-label="Toggle complete"
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] leading-snug truncate transition-colors ${
            task.completed ? 'line-through text-gray-400' : 'text-black'
          }`}
        >
          {task.title}
        </p>
        {(showDate || task.autoRolled) && (
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            {task.autoRolled && (
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                ↩ rolled
              </span>
            )}
            {showDate && formatDate(task.date)}
          </p>
        )}
      </div>

      {/* More button */}
      <button
        onClick={handleMenuToggle}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
        aria-label="More options"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute right-3 top-10 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden w-48"
          >
            {task.date !== 'today' && (
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100"
                onClick={() => { onMoveToday(task.id); setMenuOpen(false) }}
              >
                Move to Today
              </button>
            )}
            <button
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100"
              onClick={() => { onMoveNextWeek(task.id); setMenuOpen(false) }}
            >
              Move to Next Week
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100"
              onClick={() => { onMoveSomeday(task.id); setMenuOpen(false) }}
            >
              Move to Someday
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              onClick={() => { onDelete(task.id); setMenuOpen(false) }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
