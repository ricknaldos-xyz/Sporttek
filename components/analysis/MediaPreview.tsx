'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, ZoomIn, AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { MediaLightbox } from './MediaLightbox'

interface MediaItem {
  id: string
  type: string
  url: string
  filename: string
  angle: string | null
  thumbnailUrl: string | null
}

interface MediaPreviewProps {
  items: MediaItem[]
}

export function MediaPreview({ items }: MediaPreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set())
  const [errorItems, setErrorItems] = useState<Set<string>>(new Set())

  const handleLoad = (id: string) => {
    setLoadedItems(prev => new Set(prev).add(id))
  }

  const handleError = (id: string) => {
    setErrorItems(prev => new Set(prev).add(id))
  }

  if (items.length === 0) return null

  return (
    <>
      <GlassCard intensity="light" padding="lg">
        <h2 className="font-semibold mb-3">Archivos analizados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              aria-label={`Ver ${item.type === 'VIDEO' ? 'video' : 'imagen'}: ${item.filename}`}
              className="aspect-video glass-ultralight border-glass rounded-lg overflow-hidden relative group cursor-pointer"
            >
              {item.type === 'VIDEO' ? (
                <>
                  {errorItems.has(item.id) ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <video
                      src={item.url + '#t=0.5'}
                      preload="metadata"
                      playsInline
                      muted
                      className="w-full h-full object-cover bg-black"
                      onLoadedData={() => handleLoad(item.id)}
                      onError={() => handleError(item.id)}
                    />
                  )}
                  {!loadedItems.has(item.id) && !errorItems.has(item.id) && (
                    <div className="absolute inset-0 animate-pulse bg-muted/30 rounded-lg" />
                  )}
                  {!errorItems.has(item.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {errorItems.has(item.id) ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      onLoad={() => handleLoad(item.id)}
                      onError={() => handleError(item.id)}
                    />
                  )}
                  {!loadedItems.has(item.id) && !errorItems.has(item.id) && (
                    <div className="absolute inset-0 animate-pulse bg-muted/30 rounded-lg" />
                  )}
                  {!errorItems.has(item.id) && (
                    <div className="absolute inset-0 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </>
              )}
              {item.angle && (
                <span className="absolute bottom-1 right-1 glass-medium text-white text-xs px-2 py-0.5 rounded">
                  {item.angle}
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {lightboxIndex !== null && (
        <MediaLightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}
