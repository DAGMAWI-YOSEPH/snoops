'use client'

import { Task } from '@/lib/types'
import { today, tomorrow, formatDate, formatDayHeader } from '@/lib/dateUtils'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onMoveNextWeek: (id: string) => void
  onMoveSomeday: (id: string) => void
  onMoveToday: (id: string) => void
}

function groupTasks(tasks: Task[]) {
  const groups: Record<string, Task[]> = {}
  const order: string[] = []

  const todayStr = today()
  const tomStr = tomorrow()

  for (const t of tasks) {
    const key = t.date
    if (!groups[key]) {
      groups[key] = []
      order.push(key)
    }
    groups[key].push(t)
  }

  // Sort order: today, tomorrow, future dates, someday
  order.sort((a, b) => {
    if (a === 'someday') return 1
    if (b === 'someday') return -1
    return a.localeCompare(b)
  })

  return { groups, order }
}

export default function ListView({
  tasks,
  onToggle,
  onDelete,
  onMoveNextWeek,
  onMoveSomeday,
  onMoveToday,
}: Props) {
  const { groups, order } = groupTasks(tasks)
  const totalPending = tasks.filter((t) => !t.completed).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <p className="text-[13px] font-medium text-gray-400 uppercase tracking-widest mb-1">All Tasks</p>
        <h1 className="text-[34px] font-bold leading-tight text-black tracking-tight">
          {totalPending === 0 ? 'All done 🎉' : `${totalPending} pending`}
        </h1>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-gray-300 text-[15px] font-medium">No tasks yet.</p>
          </div>
        ) : (
          order.map((dateKey) => {
            const group = groups[dateKey]
            if (!group || group.length === 0) return null
            const label = formatDate(dateKey)

            return (
              <div key={dateKey} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                  {dateKey === today() && (
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  )}
                </div>
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  {group.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      showDate={false}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onMoveNextWeek={onMoveNextWeek}
                      onMoveSomeday={onMoveSomeday}
                      onMoveToday={onMoveToday}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
