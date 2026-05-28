export interface LevelInfo {
  level: number
  name: string
  xp: number
  xpForNext: number
  progress: number // 0–1
  streak: number
  totalDone: number
}

const LEVELS = [
  { min: 0,    name: 'Pup' },
  { min: 50,   name: 'Good Pup' },
  { min: 150,  name: 'Buddy' },
  { min: 350,  name: 'Good Boy' },
  { min: 700,  name: 'Superdog' },
  { min: 1200, name: 'Hero' },
  { min: 2000, name: 'Legend' },
  { min: 3000, name: 'Snoopy Star' },
]

export const XP_PER_TASK = 10

export function getLevelInfo(xp: number, streak: number, totalDone: number): LevelInfo {
  let idx = 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { idx = i; break }
  }
  const current = LEVELS[idx]
  const next = LEVELS[idx + 1]
  const progress = next
    ? (xp - current.min) / (next.min - current.min)
    : 1
  return {
    level: idx + 1,
    name: current.name,
    xp,
    xpForNext: next ? next.min - xp : 0,
    progress: Math.min(progress, 1),
    streak,
    totalDone,
  }
}

export interface XPStore {
  xp: number
  streak: number
  lastCompletedDate: string
  totalDone: number
}

const XP_KEY = 'snoops_xp'

export function loadXP(): XPStore {
  if (typeof window === 'undefined') return { xp: 0, streak: 0, lastCompletedDate: '', totalDone: 0 }
  try {
    const raw = localStorage.getItem(XP_KEY)
    return raw ? JSON.parse(raw) : { xp: 0, streak: 0, lastCompletedDate: '', totalDone: 0 }
  } catch { return { xp: 0, streak: 0, lastCompletedDate: '', totalDone: 0 } }
}

export function saveXP(store: XPStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(XP_KEY, JSON.stringify(store))
}
