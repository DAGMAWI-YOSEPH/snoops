'use client'

import { useRef, useEffect, useCallback } from 'react'

interface Column {
  items: string[]
  selected: number
  onSelect: (i: number) => void
  label: string
}

function DrumColumn({ items, selected, onSelect, label }: Column) {
  const ref = useRef<HTMLDivElement>(null)
  const ITEM_H = 44

  // Pad top/bottom so first and last items can center
  const padded = ['', '', ...items, '', '']

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = (selected + 2) * ITEM_H - ITEM_H // offset for 2 padding items
  }, [selected])

  const handleScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ITEM_H) - 2
    const clamped = Math.max(0, Math.min(items.length - 1, idx))
    if (clamped !== selected) onSelect(clamped)
  }, [items.length, selected, onSelect])

  return (
    <div className="flex flex-col items-center flex-1">
      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--fg3)' }}>
        {label}
      </p>
      <div className="relative">
        {/* Selection highlight */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-10 rounded-xl"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            height: ITEM_H,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
          }}
        />
        {/* Fade top */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: ITEM_H * 2,
            background: `linear-gradient(to bottom, var(--glass-bg-strong), transparent)`,
          }}
        />
        {/* Fade bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: ITEM_H * 2,
            background: `linear-gradient(to top, var(--glass-bg-strong), transparent)`,
          }}
        />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="drum-col"
          style={{ height: ITEM_H * 5 }}
        >
          {padded.map((item, i) => (
            <div
              key={i}
              className="drum-item text-[15px] font-medium select-none"
              style={{
                height: ITEM_H,
                color: item === '' ? 'transparent' : 'var(--fg)',
                cursor: item ? 'pointer' : 'default',
              }}
              onClick={() => item && onSelect(i - 2)}
            >
              {item || '·'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const YEARS = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() + i))
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const AMPM = ['AM', 'PM']

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

interface DateTimePickerProps {
  value: { date: string; time: string }
  onChange: (v: { date: string; time: string }) => void
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // Parse current value
  const [y, m, d] = (value.date && value.date !== 'someday')
    ? value.date.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]
  const [h, min] = value.time
    ? value.time.split(':').map(Number)
    : [new Date().getHours(), 0]

  const monthIdx = (m || 1) - 1
  const yearIdx = Math.max(0, YEARS.indexOf(String(y || new Date().getFullYear())))
  const year = parseInt(YEARS[yearIdx])
  const numDays = daysInMonth(monthIdx, year)
  const DAYS = Array.from({ length: numDays }, (_, i) => String(i + 1).padStart(2, '0'))
  const dayIdx = Math.min((d || 1) - 1, numDays - 1)

  const ampmIdx = h >= 12 ? 1 : 0
  const hour12 = h % 12 === 0 ? 11 : (h % 12) - 1
  const minIdx = min || 0

  const emit = (
    mi: number, di: number, yi: number, hi: number, mni: number, api: number
  ) => {
    const dd = Math.min(di + 1, daysInMonth(mi, parseInt(YEARS[yi])))
    const dateStr = `${YEARS[yi]}-${String(mi + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
    const rawH = (hi + 1) + (api === 1 ? 12 : 0)
    const finalH = rawH >= 24 ? rawH - 12 : rawH
    const timeStr = `${String(finalH).padStart(2, '0')}:${String(mni).padStart(2, '0')}`
    onChange({ date: dateStr, time: timeStr })
  }

  return (
    <div className="flex gap-1 px-2">
      <DrumColumn label="Month" items={MONTHS} selected={monthIdx} onSelect={(i) => emit(i, dayIdx, yearIdx, hour12, minIdx, ampmIdx)} />
      <DrumColumn label="Day" items={DAYS} selected={dayIdx} onSelect={(i) => emit(monthIdx, i, yearIdx, hour12, minIdx, ampmIdx)} />
      <DrumColumn label="Year" items={YEARS} selected={yearIdx} onSelect={(i) => emit(monthIdx, dayIdx, i, hour12, minIdx, ampmIdx)} />
      <DrumColumn label="Hour" items={HOURS} selected={hour12} onSelect={(i) => emit(monthIdx, dayIdx, yearIdx, i, minIdx, ampmIdx)} />
      <DrumColumn label="Min" items={MINS} selected={minIdx} onSelect={(i) => emit(monthIdx, dayIdx, yearIdx, hour12, i, ampmIdx)} />
      <DrumColumn label="" items={AMPM} selected={ampmIdx} onSelect={(i) => emit(monthIdx, dayIdx, yearIdx, hour12, minIdx, i)} />
    </div>
  )
}
