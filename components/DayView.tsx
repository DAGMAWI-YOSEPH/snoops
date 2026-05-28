'use client'

import { Task } from '@/lib/types'
import { today, formatDayHeader } from '@/lib/dateUtils'
import TaskItem from './TaskItem'
import SnoopyMascot from './SnoopyMascot'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onMoveNextWeek: (id: string) => void
  onMoveSomeday: (id: string) => void
  onMoveToday: (id: string) => void
  onAdd: () => void
}

export default function DayView({
  tasks,
  onToggle,
  onDelete,
  onMoveNextWeek,
  onMoveSomeday,
  onMoveToday,
  onAdd,
}: Props) {
  const todayStr = today()
  const todayTasks = tasks.filter((t) => t.date === todayStr)
  const pending = todayTasks.filter((t) => !t.completed)
  const done = todayTasks.filter((t) => t.completed)
  const rolledCount = todayTasks.filter((t) => t.autoRolled && !t.completed).length

  const d = new Date()
  const dayNum = d.getDate()
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-gray-400 uppercase tracking-widest">{weekday}</p>
          <h1 className="text-[52px] font-bold leading-none text-black tracking-tight">{dayNum}</h1>
          <p className="text-[15px] text-gray-500 font-medium mt-0.5">{month}</p>
        </div>
        <div className="mt-2">
          <SnoopyMascot size={72} />
        </div>
      </div>

      {/* Rolled banner */}
      {rolledCount > 0 && (
        <div className="mx-6 mb-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2">
          <span className="text-sm">↩</span>
          <p className="text-[13px] text-gray-600">
            <span className="font-semibold">{rolledCount} task{rolledCount > 1 ? 's' : ''}</span> rolled over from yesterday
          </p>
        </div>
      )}

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto px-6">
        {todayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-gray-300 text-[15px] font-medium">Nothing on the list.</p>
            <button
              onClick={onAdd}
              className="text-[14px] text-black font-semibold underline underline-offset-4"
            >
              Add your first task
            </button>
          </div>
        ) : (
          <div>
            {/* Pending */}
            {pending.length > 0 && (
              <div className="mb-4 rounded-2xl border border-gray-200 overflow-hidden">
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

            {/* Done */}
            {done.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-widest text-gray-300 font-semibold mb-2 px-1">
                  Completed
                </p>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
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
