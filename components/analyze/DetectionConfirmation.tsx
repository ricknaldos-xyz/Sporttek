'use client'

import { cn } from '@/lib/utils'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Check, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react'

interface DetectedTechnique {
  technique: {
    id: string
    slug: string
    name: string
    description: string | null
  }
  variant: {
    id: string
    slug: string
    name: string
  } | null
  confidence: number
  reasoning: string
}

interface Alternative {
  technique: { id: string; slug: string; name: string }
  variant: { id: string; slug: string; name: string } | null
  confidence: number
}

interface DetectionConfirmationProps {
  detected: DetectedTechnique
  multipleDetected: boolean
  alternatives: Alternative[]
  onConfirm: (techniqueId: string, variantId: string | null) => void
  onManualSelect: () => void
}

export function DetectionConfirmation({
  detected,
  multipleDetected,
  alternatives,
  onConfirm,
  onManualSelect,
}: DetectionConfirmationProps) {
  const confidencePercent = Math.round(detected.confidence * 100)
  const isLowConfidence = detected.confidence < 0.6
  const isMediumConfidence = detected.confidence >= 0.6 && detected.confidence < 0.8

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-primary border-glass mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Tecnica Detectada</h2>
        <p className="text-muted-foreground mt-1">
          Nuestra IA analizo tu video y detecto la siguiente tecnica
        </p>
      </div>

      {/* Main detection result */}
      <GlassCard intensity="light" padding="lg">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{detected.technique.name}</h3>
              {detected.variant && (
                <p className="text-sm text-primary font-medium mt-0.5">
                  {detected.variant.name}
                </p>
              )}
              {detected.technique.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {detected.technique.description}
                </p>
              )}
            </div>

            {/* Confidence badge */}
            <div
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
                isLowConfidence
                  ? 'bg-destructive/15 text-destructive border-destructive/30'
                  : isMediumConfidence
                  ? 'bg-warning/15 text-warning border-warning/30'
                  : 'bg-success/15 text-success border-success/30'
              )}
            >
              {isLowConfidence ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {confidencePercent}%
            </div>
          </div>

          {/* Reasoning */}
          <div className="p-3 glass-ultralight border-glass rounded-xl">
            <p className="text-sm text-muted-foreground">{detected.reasoning}</p>
          </div>

          {isLowConfidence && (
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                La confianza es baja. Recomendamos seleccionar la tecnica manualmente para un analisis mas preciso.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Alternatives (if multiple detected) */}
      {multipleDetected && alternatives.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Tambien se detectaron:
          </h4>
          {alternatives.map((alt, i) => (
            <button
              key={i}
              onClick={() =>
                onConfirm(alt.technique.id, alt.variant?.id || null)
              }
              className="w-full p-3 glass-ultralight border-glass rounded-xl text-left hover:glass-light transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-medium">{alt.technique.name}</span>
                {alt.variant && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({alt.variant.name})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(alt.confidence * 100)}%
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <GlassButton
          variant="outline"
          onClick={onManualSelect}
          className="flex-1"
        >
          Elegir manualmente
        </GlassButton>
        <GlassButton
          variant="solid"
          onClick={() =>
            onConfirm(
              detected.technique.id,
              detected.variant?.id || null
            )
          }
          className="flex-1"
        >
          <Check className="mr-2 h-4 w-4" />
          Confirmar y analizar
        </GlassButton>
      </div>
    </div>
  )
}
