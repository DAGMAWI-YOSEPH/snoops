export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function nextWeek(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

export function formatDate(dateStr: string): string {
  if (dateStr === 'someday') return 'Someday'
  const d = new Date(dateStr + 'T00:00:00')
  const t = today()
  const tom = tomorrow()
  if (dateStr === t) return 'Today'
  if (dateStr === tom) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export function formatDayHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function isPast(dateStr: string): boolean {
  if (dateStr === 'someday') return false
  return dateStr < today()
}
