'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, Trophy, Building2, MapPin, X, Loader2 } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  subtitle?: string
  href: string
  imageUrl?: string
}

interface SearchResults {
  jugadores: SearchResult[]
  torneos: SearchResult[]
  clubes: SearchResult[]
  canchas: SearchResult[]
}

const CATEGORIES = [
  { key: 'jugadores' as const, label: 'Jugadores', icon: User },
  { key: 'torneos' as const, label: 'Torneos', icon: Trophy },
  { key: 'clubes' as const, label: 'Clubes', icon: Building2 },
  { key: 'canchas' as const, label: 'Canchas', icon: MapPin },
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults(null)
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results)
          setSelectedIndex(0)
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Flatten for keyboard nav
  const flatResults = results
    ? (Object.values(results) as SearchResult[][]).flat()
    : []

  const handleNavigate = useCallback(
    (href: string) => {
      setIsOpen(false)
      router.push(href)
    },
    [router]
  )

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      handleNavigate(flatResults[selectedIndex].href)
    }
  }

  const hasResults = results && flatResults.length > 0
  const noResults = results && flatResults.length === 0 && query.length >= 2

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center h-10 w-10 rounded-xl hover:bg-white/10 transition-colors"
        aria-label="Buscar (Cmd+K)"
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg glass-medium border-glass rounded-2xl shadow-glass-glow overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border-light">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar jugadores, torneos, clubes, canchas..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                autoComplete="off"
              />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Cerrar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {hasResults && (
                <div className="py-2">
                  {CATEGORIES.map(({ key, label, icon: Icon }) => {
                    const items = results[key]
                    if (!items || items.length === 0) return null
                    return (
                      <div key={key}>
                        <div className="px-4 py-1.5">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {label}
                          </span>
                        </div>
                        {items.map((item) => {
                          const globalIndex = flatResults.findIndex((r) => r.id === item.id && r.href === item.href)
                          const isSelected = globalIndex === selectedIndex
                          return (
                            <button
                              key={`${key}-${item.id}`}
                              onClick={() => handleNavigate(item.href)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                isSelected ? 'glass-light' : 'hover:glass-ultralight'
                              }`}
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg glass-ultralight border-glass shrink-0">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.subtitle && (
                                  <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}

              {noResults && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No se encontraron resultados para &quot;{query}&quot;
                </div>
              )}

              {!results && query.length < 2 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Escribe al menos 2 caracteres para buscar
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-glass-border-light flex items-center gap-4 text-xs text-muted-foreground">
              <span><kbd className="px-1.5 py-0.5 rounded glass-ultralight border-glass text-[10px]">↑↓</kbd> navegar</span>
              <span><kbd className="px-1.5 py-0.5 rounded glass-ultralight border-glass text-[10px]">↵</kbd> abrir</span>
              <span><kbd className="px-1.5 py-0.5 rounded glass-ultralight border-glass text-[10px]">esc</kbd> cerrar</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
