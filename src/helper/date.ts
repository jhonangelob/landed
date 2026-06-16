export function getTimeSince(date: Date | string): string {
  const inputDate = new Date(date)
  const now = new Date()

  const diffMs = now.getTime() - inputDate.getTime()

  const seconds = Math.floor(diffMs / 1000)

  if (seconds < 10) {
    return 'Just now'
  }

  if (seconds < 60) {
    return `${seconds} sec${seconds > 1 ? 's' : ''} ago`
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  const days = Math.floor(hours / 24)

  if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const months = Math.floor(days / 30)

  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  const years = Math.floor(months / 12)

  return `${years} year${years > 1 ? 's' : ''} ago`
}

export function formatDate(date: Date | string | null): string {
  if (!date) return 'Not set'

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Formats a timestamp as "Today · 08:50 AM" (or "Yesterday"/"Jun 14"). */
export function formatDayTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const day = isSameDay(d, now)
    ? 'Today'
    : isSameDay(d, yesterday)
      ? 'Yesterday'
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${day} · ${time}`
}
