'use client'

import { useState } from 'react'
import { today, tomorrow, nextWeek } from '@/lib/dateUtils'

interface Props {
  onAdd: (title: string, date: string) => void
  onClose: () => void
}

const DATE_OPTIONS = [
  { label: 'Today', value: today() },
  { label: 'Tomorrow', value: tomorrow() },
  { label: 'Next Week', value: nextWeek() },
  { label: 'Someday', value: 'someday' },
]

export default function AddTaskModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), date)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        <h2 className="text-lg font-semibold mb-4 text-black">New Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-[16px] border-b-2 border-black pb-2 outline-none bg-transparent placeholder-gray-300 text-black"
          />

          {/* Date picker */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">When</p>
            <div className="flex gap-2 flex-wrap">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDate(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    date === opt.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-200 hover:border-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="mt-2 w-full bg-black text-white py-3.5 rounded-2xl text-[15px] font-semibold disabled:opacity-30 transition-opacity"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
