'use client'

import Image from 'next/image'
import { Task } from '@/lib/types'
import { getLevelInfo, XPStore } from '@/lib/xp'
import { today } from '@/lib/dateUtils'
import { useTheme } from '@/lib/theme'
import { CategoryIcon } from './CategoryIcon'
import { Category } from '@/lib/types'

interface Props {
  tasks: Task[]
  xpStore: XPStore
}

const LEVEL_BADGES = [
  { bg: 'rgba(200,200,200,0.3)', emoji: '🐾' },
  { bg: 'rgba(180,180,180,0.3)', emoji: '🦴' },
  { bg: 'rgba(160,160,160,0.3)', emoji: '⭐' },
  { bg: 'rgba(140,140,140,0.3)', emoji: '🏅' },
  { bg: 'rgba(120,120,120,0.3)', emoji: '🏆' },
  { bg: 'rgba(100,100,100,0.3)', emoji: '🌟' },
  { bg: 'rgba(80,80,80,0.3)', emoji: '💫' },
  { bg: 'rgba(60,60,60,0.4)', emoji: '👑' },
]

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="glass rounded-2xl p-4 flex flex-col gap-1"
    >
      <p className="text-[11px] uppercase tracking-widest font-medium" style={{ color: 'var(--fg3)' }}>
        {label}
      </p>
      <p className="text-[28px] font-bold leading-none" style={{ color: 'var(--fg)' }}>{value}</p>
      {sub && <p className="text-[11px]" style={{ color: 'var(--fg2)' }}>{sub}</p>}
    </div>
  )
}

export default function ProgressView({ tasks, xpStore }: Props) {
  const { isDark, toggle } = useTheme()
  const info = getLevelInfo(xpStore.xp, xpStore.streak, xpStore.totalDone)
  const badge = LEVEL_BADGES[Math.min(info.level - 1, LEVEL_BADGES.length - 1)]

  const todayStr = today()
  const todayDone = tasks.filter((t) => t.completed && t.date === todayStr).length
  const todayTotal = tasks.filter((t) => t.date === todayStr).length
  const todayProgress = todayTotal > 0 ? todayDone / todayTotal : 0

  // Category breakdown
  const categories: Record<string, number> = {}
  tasks.filter((t) => t.completed).forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + 1
  })
  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  // Upcoming tasks
  const upcoming = tasks.filter((t) => !t.completed && t.date !== 'someday').length

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-widest" style={{ color: 'var(--fg2)' }}>
            Progress
          </p>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight" style={{ color: 'var(--fg)' }}>
            {info.name}
          </h1>
        </div>
        <button onClick={toggle} className="mt-1 rounded-full p-1 transition-transform active:scale-90">
          <Image
            src={isDark ? '/woodstock.png' : '/snoopy.png'}
            alt="mascot"
            width={60}
            height={60}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
          />
        </button>
      </div>

      <div className="px-5 pb-24 flex flex-col gap-4">
        {/* Level card */}
        <div
          className="glass rounded-2xl p-5 relative overflow-hidden noise"
          style={{ background: badge.bg }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'var(--glass-bg)', border: '2px solid var(--border)' }}
            >
              Lv{info.level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[15px] font-bold" style={{ color: 'var(--fg)' }}>
                  {info.name}
                </p>
                <p className="text-[12px] font-medium" style={{ color: 'var(--fg2)' }}>
                  {info.xp} XP
                </p>
              </div>
              {/* XP progress bar */}
              <div
                className="w-full h-2.5 rounded-full overflow-hidden"
                style={{ background: 'var(--bg3)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(info.progress * 100)}%`,
                    background: 'var(--fg)',
                  }}
                />
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--fg3)' }}>
                {info.xpForNext > 0 ? `${info.xpForNext} XP to next level` : 'Max level reached!'}
              </p>
            </div>
          </div>
        </div>

        {/* Today's progress */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: 'var(--fg2)' }}>
              Today
            </p>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--fg)' }}>
              {todayDone} / {todayTotal}
            </p>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'var(--bg3)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(todayProgress * 100)}%`,
                background: 'var(--fg)',
              }}
            />
          </div>
          {todayProgress === 1 && todayTotal > 0 && (
            <p className="text-[12px] mt-2 font-medium text-center" style={{ color: 'var(--fg2)' }}>
              All done for today
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Done" value={xpStore.totalDone} sub="tasks completed" />
          <StatCard
            label="Streak"
            value={`${xpStore.streak}d`}
            sub={xpStore.streak > 0 ? 'keep it up!' : 'start today'}
          />
          <StatCard label="Upcoming" value={upcoming} sub="tasks ahead" />
          <StatCard label="Total XP" value={xpStore.xp} sub={`Lv ${info.level} • ${info.name}`} />
        </div>

        {/* Category breakdown */}
        {topCategories.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <p className="text-[12px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--fg3)' }}>
              Top Categories
            </p>
            <div className="flex flex-col gap-2.5">
              {topCategories.map(([cat, count]) => {
                const maxCount = topCategories[0][1]
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <CategoryIcon category={cat as Category} size={14} />
                    <div className="flex-1">
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: 'var(--bg3)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(count / maxCount) * 100}%`, background: 'var(--fg)' }}
                        />
                      </div>
                    </div>
                    <p className="text-[12px] w-6 text-right font-medium" style={{ color: 'var(--fg2)' }}>
                      {count}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Level roadmap */}
        <div className="glass rounded-2xl p-4">
          <p className="text-[12px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--fg3)' }}>
            Level Path
          </p>
          <div className="flex flex-col gap-1.5">
            {['Pup', 'Good Pup', 'Buddy', 'Good Boy', 'Superdog', 'Hero', 'Legend', 'Snoopy Star'].map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: i + 1 === info.level ? 'var(--bg3)' : 'transparent',
                  border: i + 1 === info.level ? '1px solid var(--border)' : '1px solid transparent',
                }}
              >
                <span
                  className="text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold"
                  style={{
                    background: i + 1 <= info.level ? 'var(--fg)' : 'var(--bg3)',
                    color: i + 1 <= info.level ? 'var(--bg)' : 'var(--fg3)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: i + 1 <= info.level ? 'var(--fg)' : 'var(--fg3)' }}
                >
                  {name}
                </span>
                {i + 1 === info.level && (
                  <span
                    className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--fg)', color: 'var(--bg)' }}
                  >
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
