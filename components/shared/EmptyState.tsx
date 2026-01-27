import Link from 'next/link'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <GlassCard intensity="light" padding="xl" className="text-center">
      <div className="w-16 h-16 glass-ultralight border-glass rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
        {description}
      </p>
      <div className="flex items-center justify-center gap-3">
        {action && (
          <GlassButton variant="solid" asChild>
            <Link href={action.href}>{action.label}</Link>
          </GlassButton>
        )}
        {secondaryAction && (
          <GlassButton variant="outline" asChild>
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </GlassButton>
        )}
      </div>
    </GlassCard>
  )
}
