export function formatDate(date: string | Date, style: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions =
    style === 'short' ? { day: 'numeric', month: 'short' } :
    style === 'medium' ? { day: 'numeric', month: 'short', year: 'numeric' } :
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return d.toLocaleDateString('es-PE', options)
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  return formatDate(date, 'short')
}
