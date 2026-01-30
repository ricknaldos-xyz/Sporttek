'use client'

import { useState, useEffect, useCallback } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { logger } from '@/lib/logger'
import {
  MessageSquare, Loader2, ChevronLeft, ChevronRight, Eye, EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'

interface CommentItem {
  id: string
  authorId: string
  author: {
    id: string
    user: { name: string | null; email: string | null }
  }
  targetId: string
  targetType: string
  content: string
  isHidden: boolean
  reportCount: number
  createdAt: string
  updatedAt: string
}

interface CommentsResponse {
  comments: CommentItem[]
  total: number
  page: number
  totalPages: number
}

type TabValue = 'flagged' | 'hidden'

const TABS: { label: string; value: TabValue }[] = [
  { label: 'Reportados', value: 'flagged' },
  { label: 'Ocultos', value: 'hidden' },
]

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabValue>('flagged')
  const [actionId, setActionId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchComments = useCallback(async (filter: TabValue, currentPage = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '20',
        filter,
      })
      const res = await fetch(`/api/admin/comments?${params}`)
      if (res.ok) {
        const data: CommentsResponse = await res.json()
        setComments(data.comments)
        setTotalPages(data.totalPages)
        setTotal(data.total)
      } else {
        toast.error('Error al cargar comentarios')
      }
    } catch (error) {
      logger.error('Error fetching comments:', error)
      toast.error('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments(activeTab, page)
  }, [activeTab, page, fetchComments])

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleToggleHide = async (commentId: string, hide: boolean) => {
    setActionId(commentId)
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden: hide }),
      })
      if (res.ok) {
        toast.success(hide ? 'Comentario ocultado' : 'Comentario restaurado')
        fetchComments(activeTab, page)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al actualizar comentario')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="h-7 w-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Moderacion de Comentarios</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <GlassButton
            key={tab.value}
            variant={activeTab === tab.value ? 'solid' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </GlassButton>
        ))}
      </div>

      {/* Total count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {total} comentario{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} intensity="light" padding="lg">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-5 w-24 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center space-y-3">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No hay comentarios en esta categoria</h3>
            <p className="text-muted-foreground text-sm">
              No se encontraron comentarios con el filtro seleccionado.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isActioning = actionId === comment.id

            return (
              <GlassCard key={comment.id} intensity="light" padding="lg">
                <div className="space-y-4">
                  {/* Top: Author, report count, date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {comment.author?.user?.name || 'Usuario desconocido'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {comment.author?.user?.email || '-'} &middot; {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {comment.reportCount > 0 && (
                        <GlassBadge variant="destructive" size="sm">
                          {comment.reportCount} reporte{comment.reportCount !== 1 ? 's' : ''}
                        </GlassBadge>
                      )}
                      {comment.isHidden && (
                        <GlassBadge variant="warning" size="sm">
                          Oculto
                        </GlassBadge>
                      )}
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-sm text-foreground/80 bg-muted/30 rounded-lg p-3">
                    {comment.content.length > 300
                      ? `${comment.content.slice(0, 300)}...`
                      : comment.content}
                  </p>

                  {/* Target info */}
                  <p className="text-xs text-muted-foreground">
                    Tipo: {comment.targetType} &middot; ID destino: {comment.targetId}
                  </p>

                  {/* Action button */}
                  <div className="flex items-center gap-3 pt-2 border-t border-glass">
                    {comment.isHidden ? (
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        disabled={isActioning}
                        onClick={() => handleToggleHide(comment.id, false)}
                      >
                        {isActioning ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        Restaurar
                      </GlassButton>
                    ) : (
                      <GlassButton
                        variant="destructive"
                        size="sm"
                        disabled={isActioning}
                        onClick={() => handleToggleHide(comment.id, true)}
                      >
                        {isActioning ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <EyeOff className="h-4 w-4 mr-2" />
                        )}
                        Ocultar
                      </GlassButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            )
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {((page - 1) * 20) + 1}-{Math.min(page * 20, total)} de {total} comentarios
              </p>
              <div className="flex items-center gap-2">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </GlassButton>
                <span className="text-sm font-medium px-2">
                  {page} / {totalPages}
                </span>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </GlassButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
