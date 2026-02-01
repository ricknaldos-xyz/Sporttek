'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { cn } from '@/lib/utils'

const severityLevels = [
  {
    level: 'CRITICAL',
    label: 'Critico',
    variant: 'destructive' as const,
    description:
      'Errores fundamentales que afectan gravemente tu rendimiento o pueden causar lesiones. Debes corregirlos inmediatamente.',
  },
  {
    level: 'HIGH',
    label: 'Alto',
    variant: 'warning' as const,
    description:
      'Problemas importantes que limitan significativamente tu tecnica. Prioriza corregirlos en tu entrenamiento.',
  },
  {
    level: 'MEDIUM',
    label: 'Medio',
    variant: 'warning' as const,
    description:
      'Areas de mejora que impactan tu consistencia. Trabaja en ellos despues de los problemas criticos.',
  },
  {
    level: 'LOW',
    label: 'Bajo',
    variant: 'primary' as const,
    description:
      'Ajustes finos para optimizar tu tecnica. Utiles para pasar al siguiente nivel.',
  },
]

export function SeverityExplainer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Que significan los niveles?
      </GlassButton>

      {isOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative glass-heavy border-glass-strong rounded-2xl shadow-glass-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-glass">
              <h3 className="font-semibold">Niveles de severidad</h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {severityLevels.map((severity) => (
                <div
                  key={severity.level}
                  className="flex items-start gap-3 p-3 rounded-xl glass-ultralight border-glass"
                >
                  <GlassBadge variant={severity.variant} className="shrink-0">
                    {severity.label}
                  </GlassBadge>
                  <p className="text-sm text-muted-foreground">
                    {severity.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-glass">
              <GlassButton
                onClick={() => setIsOpen(false)}
                className="w-full"
                variant="outline"
              >
                Entendido
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
