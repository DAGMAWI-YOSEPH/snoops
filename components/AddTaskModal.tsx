'use client'

import { useState } from 'react'
import { Category } from '@/lib/types'
import { today, tomorrow, nextWeek } from '@/lib/dateUtils'
import { CATEGORIES, CategoryIcon } from './CategoryIcon'
import DateTimePicker from './DateTimePicker'

interface Props {
  onAdd: (title: string, date: string, category: Category, time?: string) => void
  onClose: () => void
}

const DATE_CHIPS = [
  { label: 'Today', value: today() },
  { label: 'Tomorrow', value: tomorrow() },
  { label: 'Next Week', value: nextWeek() },
  { label: 'Someday', value: 'someday' },
  { label: 'Custom…', value: 'custom' },
]

export default function AddTaskModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today())
  const [category, setCategory] = useState<Category>('personal')
  const [showPicker, setShowPicker] = useState(false)
  const [customDateTime, setCustomDateTime] = useState({ date: today(), time: '' })

  const effectiveDate = date === 'custom' ? customDateTime.date : date
  const effectiveTime = date === 'custom' ? customDateTime.time : undefined

  const handleDateChip = (val: string) => {
    setDate(val)
    if (val === 'custom') setShowPicker(true)
    else setShowPicker(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), effectiveDate, category, effectiveTime || undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass-strong rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + X */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'var(--fg3)' }} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--fg)' }}>New Task</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-60"
            style={{ background: 'var(--bg3)', color: 'var(--fg)' }}
            aria-label="Cancel"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title input */}
          <input
            autoFocus
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-[16px] pb-2 outline-none bg-transparent"
            style={{
              borderBottom: '2px solid var(--fg)',
              color: 'var(--fg)',
              caretColor: 'var(--fg)',
            }}
          />

          {/* Category */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium mb-2" style={{ color: 'var(--fg3)' }}>
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all"
                  style={{
                    background: category === key ? 'var(--fg)' : 'var(--bg2)',
                    color: category === key ? 'var(--bg)' : 'var(--fg)',
                    borderColor: category === key ? 'var(--fg)' : 'var(--border)',
                  }}
                >
                  <CategoryIcon category={key} size={12} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-medium mb-2" style={{ color: 'var(--fg3)' }}>
              When
            </p>
            <div className="flex gap-2 flex-wrap">
              {DATE_CHIPS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleDateChip(opt.value)}
                  className="px-3 py-1.5 rounded-full text-[12px] border transition-all"
                  style={{
                    background: date === opt.value ? 'var(--fg)' : 'var(--bg2)',
                    color: date === opt.value ? 'var(--bg)' : 'var(--fg)',
                    borderColor: date === opt.value ? 'var(--fg)' : 'var(--border)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date/time drum picker */}
          {showPicker && date === 'custom' && (
            <div
              className="rounded-2xl overflow-hidden py-2"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <DateTimePicker
                value={customDateTime}
                onChange={(v) => setCustomDateTime(v)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!title.trim()}
            className="mt-1 w-full py-3.5 rounded-2xl text-[15px] font-semibold disabled:opacity-30 transition-opacity"
            style={{ background: 'var(--fg)', color: 'var(--bg)' }}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
