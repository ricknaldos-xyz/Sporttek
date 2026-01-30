'use client'

import { useState, useEffect, useCallback } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { logger } from '@/lib/logger'
import {
  Dumbbell, Loader2, Plus, ChevronDown, ChevronUp, Trash2, Pencil, Power,
} from 'lucide-react'
import { toast } from 'sonner'

interface ExerciseTemplate {
  id: string
  slug: string
  name: string
  description: string
  instructions: string
  category: string
  targetAreas: string[]
  sportSlugs: string[]
  defaultSets: number | null
  defaultReps: number | null
  defaultDurationMins: number | null
  videoUrl: string | null
  imageUrls: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TemplatesResponse {
  templates: ExerciseTemplate[]
  total: number
  page: number
  totalPages: number
}

const EMPTY_FORM = {
  slug: '',
  name: '',
  description: '',
  instructions: '',
  category: '',
  targetAreas: '',
  sportSlugs: '',
  defaultSets: '',
  defaultReps: '',
  defaultDurationMins: '',
  videoUrl: '',
  imageUrls: '',
}

type FormData = typeof EMPTY_FORM

const SPORT_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Padel', value: 'padel' },
  { label: 'Tenis', value: 'tenis' },
  { label: 'Squash', value: 'squash' },
  { label: 'Badminton', value: 'badminton' },
  { label: 'Pickleball', value: 'pickleball' },
]

const CATEGORY_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Calentamiento', value: 'calentamiento' },
  { label: 'Tecnica', value: 'tecnica' },
  { label: 'Tactica', value: 'tactica' },
  { label: 'Fisico', value: 'fisico' },
  { label: 'Mental', value: 'mental' },
  { label: 'Recuperacion', value: 'recuperacion' },
]

const ACTIVE_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Activos', value: 'true' },
  { label: 'Inactivos', value: 'false' },
]

function templateToForm(t: ExerciseTemplate): FormData {
  return {
    slug: t.slug,
    name: t.name,
    description: t.description,
    instructions: t.instructions,
    category: t.category,
    targetAreas: t.targetAreas.join(', '),
    sportSlugs: t.sportSlugs.join(', '),
    defaultSets: t.defaultSets?.toString() ?? '',
    defaultReps: t.defaultReps?.toString() ?? '',
    defaultDurationMins: t.defaultDurationMins?.toString() ?? '',
    videoUrl: t.videoUrl ?? '',
    imageUrls: t.imageUrls.join(', '),
  }
}

function formToPayload(form: FormData) {
  return {
    slug: form.slug.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    instructions: form.instructions.trim(),
    category: form.category.trim(),
    targetAreas: form.targetAreas.split(',').map((s) => s.trim()).filter(Boolean),
    sportSlugs: form.sportSlugs.split(',').map((s) => s.trim()).filter(Boolean),
    defaultSets: form.defaultSets ? parseInt(form.defaultSets) : null,
    defaultReps: form.defaultReps ? parseInt(form.defaultReps) : null,
    defaultDurationMins: form.defaultDurationMins ? parseInt(form.defaultDurationMins) : null,
    videoUrl: form.videoUrl.trim() || null,
    imageUrls: form.imageUrls ? form.imageUrls.split(',').map((s) => s.trim()).filter(Boolean) : [],
  }
}

export default function AdminExerciseTemplatesPage() {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  // Filters
  const [sportFilter, setSportFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<FormData>({ ...EMPTY_FORM })
  const [creating, setCreating] = useState(false)

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormData>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  // Actions
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const fetchTemplates = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (sportFilter) params.set('sport', sportFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      if (activeFilter) params.set('active', activeFilter)

      const res = await fetch(`/api/admin/exercise-templates?${params}`)
      if (res.ok) {
        const data: TemplatesResponse = await res.json()
        setTemplates(data.templates)
        setPagination({ page: data.page, totalPages: data.totalPages, total: data.total })
      } else {
        toast.error('Error al cargar plantillas')
      }
    } catch (error) {
      logger.error('Error fetching exercise templates:', error)
      toast.error('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [sportFilter, categoryFilter, activeFilter])

  useEffect(() => {
    fetchTemplates(1)
  }, [fetchTemplates])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const payload = formToPayload(createForm)
      const res = await fetch('/api/admin/exercise-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('Plantilla creada exitosamente')
        setCreateForm({ ...EMPTY_FORM })
        setShowCreate(false)
        fetchTemplates(1)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al crear plantilla')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = (template: ExerciseTemplate) => {
    if (editingId === template.id) {
      setEditingId(null)
      return
    }
    setEditingId(template.id)
    setEditForm(templateToForm(template))
  }

  const handleSave = async (e: React.FormEvent, id: string) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = formToPayload(editForm)
      const res = await fetch(`/api/admin/exercise-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('Plantilla actualizada')
        setEditingId(null)
        fetchTemplates(pagination.page)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al actualizar')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (template: ExerciseTemplate) => {
    setActionId(template.id)
    try {
      const res = await fetch(`/api/admin/exercise-templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !template.isActive }),
      })
      if (res.ok) {
        toast.success(template.isActive ? 'Plantilla desactivada' : 'Plantilla activada')
        fetchTemplates(pagination.page)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al cambiar estado')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionId(id)
    try {
      const res = await fetch(`/api/admin/exercise-templates/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Plantilla eliminada')
        setDeleteConfirmId(null)
        fetchTemplates(pagination.page)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setActionId(null)
    }
  }

  const renderFormFields = (
    form: FormData,
    setForm: (f: FormData) => void,
    onSubmit: (e: React.FormEvent) => void,
    submitting: boolean,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="ejercicio-ejemplo"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre del ejercicio"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripcion</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descripcion breve del ejercicio"
          rows={2}
          className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Instrucciones</label>
        <textarea
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          placeholder="Instrucciones paso a paso..."
          rows={3}
          className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="tecnica, fisico, etc."
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Areas objetivo (coma sep.)</label>
          <input
            type="text"
            value={form.targetAreas}
            onChange={(e) => setForm({ ...form, targetAreas: e.target.value })}
            placeholder="brazo, pierna, core"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deportes (coma sep.)</label>
          <input
            type="text"
            value={form.sportSlugs}
            onChange={(e) => setForm({ ...form, sportSlugs: e.target.value })}
            placeholder="padel, tenis"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sets por defecto</label>
          <input
            type="number"
            value={form.defaultSets}
            onChange={(e) => setForm({ ...form, defaultSets: e.target.value })}
            placeholder="3"
            min="1"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reps por defecto</label>
          <input
            type="number"
            value={form.defaultReps}
            onChange={(e) => setForm({ ...form, defaultReps: e.target.value })}
            placeholder="10"
            min="1"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duracion (min)</label>
          <input
            type="number"
            value={form.defaultDurationMins}
            onChange={(e) => setForm({ ...form, defaultDurationMins: e.target.value })}
            placeholder="15"
            min="1"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://youtube.com/..."
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagenes URLs (coma sep.)</label>
          <input
            type="text"
            value={form.imageUrls}
            onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
            placeholder="https://img1.jpg, https://img2.jpg"
            className="w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <GlassButton type="submit" variant="solid" size="sm" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </GlassButton>
      </div>
    </form>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Dumbbell className="h-7 w-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Plantillas de Ejercicios</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SPORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="rounded-lg border border-glass bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ACTIVE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Count + Create button */}
      <div className="flex items-center justify-between">
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {pagination.total} plantilla{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
          </p>
        )}
        <GlassButton
          variant="solid"
          size="sm"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? (
            <ChevronUp className="h-4 w-4 mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {showCreate ? 'Cerrar formulario' : 'Nueva plantilla'}
        </GlassButton>
      </div>

      {/* Create form */}
      {showCreate && (
        <GlassCard intensity="light" padding="lg">
          <h2 className="text-lg font-semibold mb-4">Crear nueva plantilla</h2>
          {renderFormFields(createForm, setCreateForm, handleCreate, creating, 'Crear plantilla')}
        </GlassCard>
      )}

      {/* Templates list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} intensity="light" padding="lg">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-5 w-24 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-64 bg-muted rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-muted rounded-full" />
                  <div className="h-6 w-20 bg-muted rounded-full" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center space-y-3">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No hay plantillas</h3>
            <p className="text-muted-foreground text-sm">
              No se encontraron plantillas con los filtros seleccionados.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => {
            const isEditing = editingId === template.id
            const isActioning = actionId === template.id
            const isDeleting = deleteConfirmId === template.id

            return (
              <GlassCard key={template.id} intensity="light" padding="lg">
                <div className="space-y-4">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <GlassBadge variant={template.isActive ? 'success' : 'destructive'} size="sm">
                        {template.isActive ? 'Activo' : 'Inactivo'}
                      </GlassBadge>
                      <GlassBadge variant="primary" size="sm">
                        {template.category}
                      </GlassBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        {isEditing ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </GlassButton>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        disabled={isActioning}
                        onClick={() => handleToggleActive(template)}
                      >
                        {isActioning ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </GlassButton>
                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <GlassButton
                            variant="destructive"
                            size="sm"
                            disabled={isActioning}
                            onClick={() => handleDelete(template.id)}
                          >
                            {isActioning ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Confirmar'
                            )}
                          </GlassButton>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancelar
                          </GlassButton>
                        </div>
                      ) : (
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(template.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </GlassButton>
                      )}
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>

                  {/* Sport slugs + target areas */}
                  <div className="flex flex-wrap gap-1.5">
                    {template.sportSlugs.map((sport) => (
                      <GlassBadge key={sport} variant="warning" size="sm">
                        {sport}
                      </GlassBadge>
                    ))}
                    {template.targetAreas.map((area) => (
                      <GlassBadge key={area} size="sm">
                        {area}
                      </GlassBadge>
                    ))}
                  </div>

                  {/* Defaults row */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {template.defaultSets != null && (
                      <span>Sets: <span className="font-medium text-foreground">{template.defaultSets}</span></span>
                    )}
                    {template.defaultReps != null && (
                      <span>Reps: <span className="font-medium text-foreground">{template.defaultReps}</span></span>
                    )}
                    {template.defaultDurationMins != null && (
                      <span>Duracion: <span className="font-medium text-foreground">{template.defaultDurationMins} min</span></span>
                    )}
                    <span className="text-xs">slug: {template.slug}</span>
                  </div>

                  {/* Edit form */}
                  {isEditing && (
                    <div className="pt-4 border-t border-glass">
                      <h4 className="text-sm font-semibold mb-3">Editar plantilla</h4>
                      {renderFormFields(
                        editForm,
                        setEditForm,
                        (e) => handleSave(e, template.id),
                        saving,
                        'Guardar cambios'
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            )
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <GlassButton
                variant="ghost"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => {
                  const newPage = pagination.page - 1
                  setPagination((prev) => ({ ...prev, page: newPage }))
                  fetchTemplates(newPage)
                }}
              >
                Anterior
              </GlassButton>
              <span className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.totalPages}
              </span>
              <GlassButton
                variant="ghost"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {
                  const newPage = pagination.page + 1
                  setPagination((prev) => ({ ...prev, page: newPage }))
                  fetchTemplates(newPage)
                }}
              >
                Siguiente
              </GlassButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
