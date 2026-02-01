'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

interface MediaItem {
  id: string
  type: string
  url: string
  filename: string
  angle: string | null
}

interface MediaLightboxProps {
  items: MediaItem[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function MediaLightbox({ items, currentIndex, onClose, onNavigate }: MediaLightboxProps) {
  const item = items[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < items.length - 1
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [mediaError, setMediaError] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  useEffect(() => {
    setMediaError(false)
  }, [currentIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    // Use 60px threshold to reduce accidental swipes on small screens
    const threshold = 60
    if (diff > threshold && hasNext) onNavigate(currentIndex + 1)
    if (diff < -threshold && hasPrev) onNavigate(currentIndex - 1)
    setTouchStart(null)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
    if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
  }, [onClose, onNavigate, currentIndex, hasPrev, hasNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          aria-label="Anterior"
          className="absolute left-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          aria-label="Siguiente"
          className="absolute right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Media content */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full mx-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {item.type === 'VIDEO' ? (
          mediaError ? (
            <div className="w-full h-64 flex items-center justify-center glass-ultralight rounded-xl">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No se pudo cargar el video</p>
              </div>
            </div>
          ) : (
            <video
              src={item.url}
              controls
              muted
              playsInline
              className="w-full max-h-[85vh] rounded-xl bg-black"
              onError={() => setMediaError(true)}
            />
          )
        ) : (
          mediaError ? (
            <div className="w-full h-64 flex items-center justify-center glass-ultralight rounded-xl">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No se pudo cargar la imagen</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '85vh' }}>
              <Image
                src={item.url}
                alt={item.filename}
                width={1200}
                height={800}
                className="object-contain rounded-xl max-h-[85vh] w-auto h-auto"
                sizes="(max-width: 1024px) 100vw, 1024px"
                onError={() => setMediaError(true)}
              />
            </div>
          )
        )}

        {/* Info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl flex items-center justify-between">
          <span className="text-white/80 text-sm truncate">{item.filename}</span>
          <div className="flex items-center gap-2">
            {item.angle && (
              <span className="text-white/70 text-xs px-2 py-0.5 rounded bg-white/10">{item.angle}</span>
            )}
            <span className="text-white/50 text-xs">{currentIndex + 1}/{items.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
