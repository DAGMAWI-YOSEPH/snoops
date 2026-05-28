'use client'

import { useEffect, useState } from 'react'
import { Task, ActiveView } from '@/lib/types'
import { loadTasks, saveTasks, rollOverdueTasks } from '@/lib/storage'
import { today, nextWeek } from '@/lib/dateUtils'
import DayView from '@/components/DayView'
import ListView from '@/components/ListView'
import BottomNav from '@/components/BottomNav'
import AddTaskModal from '@/components/AddTaskModal'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<ActiveView>('day')
  const [showAdd, setShowAdd] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = loadTasks()
    const { tasks: rolled } = rollOverdueTasks(stored)
    setTasks(rolled)
    saveTasks(rolled)
    setMounted(true)
  }, [])

  const persist = (updated: Task[]) => {
    setTasks(updated)
    saveTasks(updated)
  }

  const handleAdd = (title: string, date: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      date,
      createdAt: new Date().toISOString(),
    }
    persist([...tasks, task])
  }

  const handleToggle = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const handleDelete = (id: string) => {
    persist(tasks.filter((t) => t.id !== id))
  }

  const handleMoveNextWeek = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, date: nextWeek(), autoRolled: false } : t)))
  }

  const handleMoveSomeday = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, date: 'someday', autoRolled: false } : t)))
  }

  const handleMoveToday = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, date: today(), autoRolled: false } : t)))
  }

  if (!mounted) return null

  const sharedProps = {
    tasks,
    onToggle: handleToggle,
    onDelete: handleDelete,
    onMoveNextWeek: handleMoveNextWeek,
    onMoveSomeday: handleMoveSomeday,
    onMoveToday: handleMoveToday,
  }

  return (
    <main className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {view === 'day' ? (
          <DayView {...sharedProps} onAdd={() => setShowAdd(true)} />
        ) : (
          <ListView {...sharedProps} />
        )}
      </div>
      <BottomNav active={view} onChange={setView} onAdd={() => setShowAdd(true)} />
      {showAdd && (
        <AddTaskModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
    </main>
  )
}
