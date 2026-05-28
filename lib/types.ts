export type Category =
  | 'work'
  | 'health'
  | 'shopping'
  | 'finance'
  | 'social'
  | 'creative'
  | 'learning'
  | 'personal'

export interface Task {
  id: string
  title: string
  completed: boolean
  date: string         // YYYY-MM-DD or 'someday'
  time?: string        // HH:MM optional
  category: Category
  createdAt: string
  autoRolled?: boolean
}

export type ZoomLevel = 0 | 1 | 2   // 0=year, 1=month, 2=day
export type ActiveTab = 'calendar' | 'progress'
