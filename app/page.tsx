'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Task, Category, ActiveTab, ZoomLevel } from '@/lib/types'
import { loadTasks, saveTasks, rollOverdueTasks } from '@/lib/storage'
import { loadXP, saveXP, XPStore, XP_PER_TASK } from '@/lib/xp'
import { today, nextWeek } from '@/lib/dateUtils'
import YearView from '@/components/YearView'
import MonthView from '@/components/MonthView'
import DayView from '@/components/DayView'
import ProgressView from '@/components/ProgressView'
import BottomNav from '@/components/BottomNav'
import AddTaskModal from '@/components/AddTaskModal'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [xpStore, setXpStore] = useState<XPStore>({ xp: 0, streak: 0, lastCompletedDate: '', totalDone: 0 })
  const [tab, setTab] = useState<ActiveTab>('calendar')
  const [zoom, setZoom] = useState<ZoomLevel>(0)   // 0=year 1=month 2=day
  const [viewDate, setViewDate] = useState(new Date())
  const [focusDate, setFocusDate] = useState(today())
  const [showAdd, setShowAdd] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ── Pinch-zoom gesture ──────────────────────────────────────────────────
  const zoomRef = useRef<HTMLDivElement>(null)
  const lastDist = useRef<number | null>(null)
  const accumulated = useRef(0)
  const PINCH_THRESHOLD = 55

  const applyZoomDelta = useCallback((delta: number) => {
    setZoom((z) => {
      const next = z + delta
      if (next < 0 || next > 2) return z
      return next as ZoomLevel
    })
  }, [])

  useEffect(() => {
    const el = zoomRef.current
    if (!el) return

    const getTouchDist = (e: TouchEvent) => {
      const [a, b] = [e.touches[0], e.touches[1]]
      return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastDist.current = getTouchDist(e)
        accumulated.current = 0
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || lastDist.current === null) return
      const dist = getTouchDist(e)
      accumulated.current += dist - lastDist.current
      lastDist.current = dist

      if (accumulated.current > PINCH_THRESHOLD) {
        applyZoomDelta(1)
        accumulated.current = 0
      } else if (accumulated.current < -PINCH_THRESHOLD) {
        applyZoomDelta(-1)
        accumulated.current = 0
      }
    }

    const onTouchEnd = () => {
      lastDist.current = null
      accumulated.current = 0
    }

    // Ctrl+wheel for desktop trackpad pinch
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      if (e.deltaY < -15) applyZoomDelta(1)
      else if (e.deltaY > 15) applyZoomDelta(-1)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [applyZoomDelta])

  // ── Load data ───────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = loadTasks()
    const { tasks: rolled } = rollOverdueTasks(stored)
    setTasks(rolled)
    saveTasks(rolled)
    setXpStore(loadXP())
    setMounted(true)
  }, [])

  // ── Task mutations ──────────────────────────────────────────────────────
  const persist = (updated: Task[]) => {
    setTasks(updated)
    saveTasks(updated)
  }

  const handleAdd = (title: string, date: string, category: Category, time?: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      date,
      time,
      category,
      createdAt: new Date().toISOString(),
    }
    persist([...tasks, task])
  }

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const nowCompleted = !task.completed
    persist(tasks.map((t) => (t.id === id ? { ...t, completed: nowCompleted } : t)))

    if (nowCompleted) {
      const todayStr = today()
      setXpStore((prev) => {
        const newStreak =
          prev.lastCompletedDate === todayStr
            ? prev.streak
            : prev.lastCompletedDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
            ? prev.streak + 1
            : 1
        const next: XPStore = {
          xp: prev.xp + XP_PER_TASK,
          streak: newStreak,
          lastCompletedDate: todayStr,
          totalDone: prev.totalDone + 1,
        }
        saveXP(next)
        return next
      })
    } else {
      setXpStore((prev) => {
        const next: XPStore = {
          ...prev,
          xp: Math.max(0, prev.xp - XP_PER_TASK),
          totalDone: Math.max(0, prev.totalDone - 1),
        }
        saveXP(next)
        return next
      })
    }
  }

  const handleDelete = (id: string) => persist(tasks.filter((t) => t.id !== id))

  const handleMoveNextWeek = (id: string) =>
    persist(tasks.map((t) => (t.id === id ? { ...t, date: nextWeek(), autoRolled: false } : t)))

  const handleMoveSomeday = (id: string) =>
    persist(tasks.map((t) => (t.id === id ? { ...t, date: 'someday', autoRolled: false } : t)))

  const handleMoveToday = (id: string) =>
    persist(tasks.map((t) => (t.id === id ? { ...t, date: today(), autoRolled: false } : t)))

  const handleDayPress = (date: string) => {
    setFocusDate(date)
    setViewDate(new Date(date + 'T00:00:00'))
    setZoom(2)
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
    <main
      className="flex flex-col h-screen max-w-md mx-auto overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Zoomable calendar area */}
      <div ref={zoomRef} className="flex-1 overflow-hidden">
        {tab === 'calendar' && zoom === 0 && (
          <YearView
            tasks={tasks}
            year={viewDate.getFullYear()}
            onDayPress={handleDayPress}
          />
        )}
        {tab === 'calendar' && zoom === 1 && (
          <MonthView
            tasks={tasks}
            viewDate={viewDate}
            onMonthChange={setViewDate}
            onDayPress={handleDayPress}
          />
        )}
        {tab === 'calendar' && zoom === 2 && (
          <DayView
            {...sharedProps}
            focusDate={focusDate}
            onAdd={() => setShowAdd(true)}
          />
        )}
        {tab === 'progress' && (
          <ProgressView tasks={tasks} xpStore={xpStore} />
        )}
      </div>

      <BottomNav
        activeTab={tab}
        zoomLevel={zoom}
        onTabChange={setTab}
        onAdd={() => setShowAdd(true)}
      />

      {showAdd && (
        <AddTaskModal
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </main>
  )
}
