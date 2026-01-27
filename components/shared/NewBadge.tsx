import { cn } from '@/lib/utils'

interface NewBadgeProps {
  className?: string
}

export function NewBadge({ className }: NewBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground',
        className
      )}
    >
      Nuevo
    </span>
  )
}
