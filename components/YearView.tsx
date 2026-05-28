'use client'

import { Task } from '@/lib/types'
import { today } from '@/lib/dateUtils'

interface Props {
  tasks: Task[]
  year: number
  onDayPress: (date: string) => void
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function taskDates(tasks: Task[]): Set<string> {
  return new Set(tasks.filter((t) => !t.completed && t.date !== 'someday').map((t) => t.date))
}

function MiniMonth({
  year, month, datesWithTasks, todayStr, onDayPress,
}: {
  year: number
  month: number
  datesWithTasks: Set<string>
  todayStr: string
  onDayPress: (d: string) => void
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const numDays = new Date(year, month + 1, 0).getDate()
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === month

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= numDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="flex flex-col gap-0.5">
      <p
        className="text-[10px] font-semibold mb-0.5 uppercase tracking-wide"
        style={{ color: isCurrentMonth ? 'var(--fg)' : 'var(--fg2)' }}
      >
        {MONTH_NAMES[month]}
      </p>
      <div className="grid grid-cols-7 gap-0">
        {DOW.map((d, i) => (
          <div key={i} className="text-[7px] text-center font-medium" style={{ color: 'var(--fg3)' }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === todayStr
          const hasTasks = datesWithTasks.has(dateStr)

          return (
            <button
              key={i}
              onClick={() => onDayPress(dateStr)}
              className="flex flex-col items-center"
              style={{ padding: '1px 0' }}
            >
              <span
                className="text-[8px] leading-none w-4 h-4 flex items-center justify-center rounded-full font-medium"
                style={{
                  background: isToday ? 'var(--fg)' : 'transparent',
                  color: isToday ? 'var(--bg)' : 'var(--fg)',
                }}
              >
                {day}
              </span>
              {hasTasks && (
                <span
                  className="rounded-full mt-0.5"
                  style={{ width: 3, height: 3, background: isToday ? 'var(--bg)' : 'var(--fg)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function YearView({ tasks, year, onDayPress }: Props) {
  const todayStr = today()
  const dates = taskDates(tasks)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-3">
        <p className="text-[13px] font-medium uppercase tracking-widest" style={{ color: 'var(--fg2)' }}>
          Pinch to zoom in
        </p>
        <h1 className="text-[42px] font-bold leading-tight tracking-tight" style={{ color: 'var(--fg)' }}>
          {year}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 px-5 pb-24">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-3 noise relative overflow-hidden"
          >
            <MiniMonth
              year={year}
              month={i}
              datesWithTasks={dates}
              todayStr={todayStr}
              onDayPress={onDayPress}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
