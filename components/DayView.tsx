'use client'

import Image from 'next/image'
import { Task } from '@/lib/types'
import { today, formatDayHeader } from '@/lib/dateUtils'
import TaskItem from './TaskItem'
import { useTheme } from '@/lib/theme'

interface Props {
  tasks: Task[]
  focusDate?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onMoveNextWeek: (id: string) => void
  onMoveSomeday: (id: string) => void
  onMoveToday: (id: string) => void
  onAdd: () => void
}

export default function DayView({
  tasks,
  focusDate,
  onToggle,
  onDelete,
  onMoveNextWeek,
  onMoveSomeday,
  onMoveToday,
  onAdd,
}: Props) {
  const { isDark, toggle } = useTheme()
  const dateStr = focusDate || today()
  const todayStr = today()
  const isToday = dateStr === todayStr

  const dayTasks = tasks.filter((t) => t.date === dateStr)
  const pending = dayTasks.filter((t) => !t.completed)
  const done = dayTasks.filter((t) => t.completed)
  const rolledCount = pending.filter((t) => t.autoRolled).length

  const d = new Date(dateStr + 'T00:00:00')
  const dayNum = d.getDate()
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-widest" style={{ color: 'var(--fg2)' }}>
            {weekday}
          </p>
          <h1 className="text-[52px] font-bold leading-none tracking-tight" style={{ color: 'var(--fg)' }}>
            {dayNum}
          </h1>
          <p className="text-[15px] font-medium mt-0.5" style={{ color: 'var(--fg2)' }}>
            {month}{!isToday ? ` · ${d.getFullYear()}` : ''}
          </p>
        </div>

        {/* Snoopy / Woodstock — click to toggle dark mode */}
        <button
          onClick={toggle}
          className="mt-1 flex-shrink-0 rounded-full p-1 transition-transform active:scale-90"
          aria-label="Toggle dark mode"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Image
            src={isDark ? '/woodstock.png' : '/snoopy.png'}
            alt={isDark ? 'Woodstock' : 'Snoopy'}
            width={72}
            height={72}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
            priority
          />
        </button>
      </div>

      {/* Rolled banner */}
      {rolledCount > 0 && (
        <div
          className="mx-5 mb-3 px-4 py-2.5 glass rounded-2xl flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10H8"/></svg>
          <p className="text-[13px]" style={{ color: 'var(--fg2)' }}>
            <span className="font-semibold" style={{ color: 'var(--fg)' }}>
              {rolledCount} task{rolledCount > 1 ? 's' : ''}
            </span>{' '}
            rolled over from yesterday
          </p>
        </div>
      )}

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-[15px] font-medium" style={{ color: 'var(--fg3)' }}>
              {isToday ? 'Nothing on the list.' : 'No tasks this day.'}
            </p>
            {isToday && (
              <button
                onClick={onAdd}
                className="text-[14px] font-semibold underline underline-offset-4"
                style={{ color: 'var(--fg)' }}
              >
                Add your first task
              </button>
            )}
          </div>
        ) : (
          <div>
            {pending.length > 0 && (
              <div className="mb-4 glass rounded-2xl overflow-hidden">
                {pending.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onMoveNextWeek={onMoveNextWeek}
                    onMoveSomeday={onMoveSomeday}
                    onMoveToday={onMoveToday}
                  />
                ))}
              </div>
            )}
            {done.length > 0 && (
              <div className="mb-4">
                <p
                  className="text-[11px] uppercase tracking-widest font-semibold mb-2 px-1"
                  style={{ color: 'var(--fg3)' }}
                >
                  Completed
                </p>
                <div className="glass rounded-2xl overflow-hidden">
                  {done.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onMoveNextWeek={onMoveNextWeek}
                      onMoveSomeday={onMoveSomeday}
                      onMoveToday={onMoveToday}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
