import { Task } from './types'
import { today, isPast } from './dateUtils'

const KEY = 'snoops_tasks'

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(tasks))
}

export function rollOverdueTasks(tasks: Task[]): { tasks: Task[]; rolledCount: number } {
  let rolledCount = 0
  const updated = tasks.map((t) => {
    if (!t.completed && t.date !== 'someday' && isPast(t.date)) {
      rolledCount++
      return { ...t, date: today(), autoRolled: true }
    }
    return t
  })
  return { tasks: updated, rolledCount }
}
