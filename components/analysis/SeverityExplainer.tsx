'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const severityLevels = [
  {
    level: 'CRITICAL',
    label: 'Critico',
    color: 'bg-red-100 text-red-700 border-red-200',
    description:
      'Errores fundamentales que afectan gravemente tu rendimiento o pueden causar lesiones. Debes corregirlos inmediatamente.',
  },
  {
    level: 'HIGH',
    label: 'Alto',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    description:
      'Problemas importantes que limitan significativamente tu tecnica. Prioriza corregirlos en tu entrenamiento.',
  },
  {
    level: 'MEDIUM',
    label: 'Medio',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    description:
      'Areas de mejora que impactan tu consistencia. Trabaja en ellos despues de los problemas criticos.',
  },
  {
    level: 'LOW',
    label: 'Bajo',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description:
      'Ajustes finos para optimizar tu tecnica. Utiles para pasar al siguiente nivel.',
  },
]

export function SeverityExplainer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Que significan los niveles?
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Niveles de severidad</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {severityLevels.map((severity) => (
                <div
                  key={severity.level}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span
                    className={cn(
                      'px-2 py-1 rounded-md text-xs font-medium border shrink-0',
                      severity.color
                    )}
                  >
                    {severity.label}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {severity.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full"
                variant="outline"
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
