import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl px-4 py-2 text-sm',
          'glass-light border-glass',
          'placeholder:text-muted-foreground/60',
          'transition-all duration-[var(--duration-normal)] ease-[var(--ease-liquid)]',
          'focus:glass-medium focus:border-primary/40 focus:shadow-glass-glow focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassInput.displayName = 'GlassInput'

export { GlassInput }
