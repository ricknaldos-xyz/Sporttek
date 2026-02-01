'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <GlassCard intensity="light" padding="lg" className="max-w-md w-full text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Algo salio mal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ocurrio un error inesperado. Intenta recargar la pagina.
            </p>
            <GlassButton
              variant="solid"
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar pagina
            </GlassButton>
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}
