'use client'

import { useRef, useState, useCallback } from 'react'
import { Task } from '@/lib/types'
import { today } from '@/lib/dateUtils'
import { CategoryIcon } from './CategoryIcon'

interface Props {
  tasks: Task[]
  viewDate: Date
  onMonthChange: (d: Date) => void
  onDayPress: (date: string) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function MonthView({ tasks, viewDate, onMonthChange, onDayPress }: Props) {
  const todayStr = today()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const numDays = new Date(year, month + 1, 0).getDate()

  const touchStartX = useRef(0)
  const [swiping, setSwiping] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setSwiping(true)
  }

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!swiping) return
      const dx = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(dx) > 60) {
        const next = new Date(viewDate)
        next.setMonth(next.getMonth() + (dx > 0 ? 1 : -1))
        onMonthChange(next)
      }
      setSwiping(false)
    },
    [swiping, viewDate, onMonthChange]
  )

  // Build list of all days in the month
  const days = Array.from({ length: numDays }, (_, i) => {
    const day = i + 1
    const dateStr = formatDateKey(year, month, day)
    const dayTasks = tasks.filter((t) => t.date === dateStr && !t.completed)
    const doneTasks = tasks.filter((t) => t.date === dateStr && t.completed)
    const dow = new Date(year, month, day).getDay()
    return { day, dateStr, dayTasks, doneTasks, dow }
  })

  return (
    <div
      className="flex flex-col h-full swipe-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-widest" style={{ color: 'var(--fg2)' }}>
            Swipe to change month
          </p>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight" style={{ color: 'var(--fg)' }}>
            {MONTH_NAMES[month]}
          </h1>
          <p className="text-[13px] font-medium" style={{ color: 'var(--fg3)' }}>{year}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); onMonthChange(d) }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 11L5 7l4-4" />
            </svg>
          </button>
          <button
            onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); onMonthChange(d) }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 11l4-4-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day list */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {days.map(({ day, dateStr, dayTasks, doneTasks, dow }) => {
          const isToday = dateStr === todayStr
          const allTasks = [...dayTasks, ...doneTasks]

          return (
            <button
              key={dateStr}
              onClick={() => onDayPress(dateStr)}
              className="w-full flex items-start gap-3 py-2.5 border-b text-left"
              style={{ borderColor: 'var(--border2)' }}
            >
              {/* Day number */}
              <div className="flex-shrink-0 flex flex-col items-center w-10">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[15px] font-semibold leading-none"
                  style={{
                    background: isToday ? 'var(--fg)' : 'transparent',
                    color: isToday ? 'var(--bg)' : 'var(--fg)',
                  }}
                >
                  {day}
                </span>
                <span className="text-[9px] uppercase mt-0.5" style={{ color: 'var(--fg3)' }}>
                  {DOW_SHORT[dow]}
                </span>
              </div>

              {/* Task tags */}
              <div className="flex-1 flex flex-wrap gap-1 pt-1 min-h-[32px]">
                {allTasks.length === 0 && (
                  <span className="text-[12px]" style={{ color: 'var(--fg3)' }}>—</span>
                )}
                {allTasks.slice(0, 4).map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium max-w-[120px] truncate"
                    style={{
                      background: t.completed ? 'var(--bg3)' : 'var(--bg2)',
                      color: t.completed ? 'var(--fg3)' : 'var(--fg)',
                      border: '1px solid var(--border)',
                      textDecoration: t.completed ? 'line-through' : 'none',
                    }}
                  >
                    <CategoryIcon category={t.category} size={10} />
                    <span className="truncate">{t.title}</span>
                  </span>
                ))}
                {allTasks.length > 4 && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: 'var(--bg3)', color: 'var(--fg3)' }}
                  >
                    +{allTasks.length - 4}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
