export type TaskBucket = 'day' | 'someday'

export interface Task {
  id: string
  title: string
  completed: boolean
  date: string // YYYY-MM-DD or 'someday'
  createdAt: string
  autoRolled?: boolean
}

export type ActiveView = 'day' | 'list'
