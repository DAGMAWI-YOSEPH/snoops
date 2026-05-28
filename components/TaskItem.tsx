'use client'

import { useState, useRef } from 'react'
import { Task } from '@/lib/types'
import { CategoryBadge } from './CategoryIcon'

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
  task, showDate = false, onToggle, onDelete, onMoveNextWeek, onMoveSomeday, onMoveToday,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="relative group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors"
      style={{
        background: 'transparent',
        borderColor: 'var(--border2)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
        style={{
          borderColor: 'var(--fg)',
          background: task.completed ? 'var(--fg)' : 'transparent',
        }}
        aria-label="Toggle complete"
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] leading-snug truncate transition-colors"
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'var(--fg3)' : 'var(--fg)',
          }}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <CategoryBadge category={task.category} />
          {task.time && (
            <span className="text-[10px] font-medium" style={{ color: 'var(--fg3)' }}>
              {task.time}
            </span>
          )}
          {task.autoRolled && !task.completed && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--bg3)', color: 'var(--fg2)' }}
            >
              ↩ rolled
            </span>
          )}
        </div>
      </div>

      {/* More button */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--fg3)' }}
        aria-label="More options"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div
            className="absolute right-3 top-10 z-20 glass-strong rounded-2xl overflow-hidden w-48"
          >
            <button
              className="w-full text-left px-4 py-2.5 text-sm border-b transition-colors hover:opacity-70"
              style={{ color: 'var(--fg)', borderColor: 'var(--border2)' }}
              onClick={() => { onMoveToday(task.id); setMenuOpen(false) }}
            >
              Move to Today
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm border-b transition-colors hover:opacity-70"
              style={{ color: 'var(--fg)', borderColor: 'var(--border2)' }}
              onClick={() => { onMoveNextWeek(task.id); setMenuOpen(false) }}
            >
              Move to Next Week
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm border-b transition-colors hover:opacity-70"
              style={{ color: 'var(--fg)', borderColor: 'var(--border2)' }}
              onClick={() => { onMoveSomeday(task.id); setMenuOpen(false) }}
            >
              Move to Someday
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:opacity-70"
              style={{ color: '#ef4444' }}
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
